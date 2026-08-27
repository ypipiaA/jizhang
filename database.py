"""SQLite database layer for the bookkeeping app."""

import sqlite3
from datetime import date, datetime
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).parent / "records.db"

DEFAULT_CATEGORIES = [
    ("餐饮", "expense"),
    ("交通", "expense"),
    ("购物", "expense"),
    ("娱乐", "expense"),
    ("住房", "expense"),
    ("其他支出", "expense"),
    ("工资", "income"),
    ("奖金", "income"),
    ("理财", "income"),
    ("其他收入", "income"),
]

# 已合并进“其他支出”的旧分类（启动时自动迁移历史记录）
MERGED_INTO_OTHER = ["医疗", "教育"]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
            );

            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
                amount REAL NOT NULL CHECK(amount > 0),
                category_id INTEGER NOT NULL,
                record_date TEXT NOT NULL,
                note TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            );
            """
        )
        count = conn.execute("SELECT COUNT(*) FROM categories").fetchone()[0]
        if count == 0:
            conn.executemany(
                "INSERT INTO categories (name, type) VALUES (?, ?)",
                DEFAULT_CATEGORIES,
            )

        # 迁移：把旧的 医疗/教育 分类下的记录归入“其他支出”，并删除旧分类（幂等）
        other = conn.execute(
            "SELECT id FROM categories WHERE name = '其他支出'"
        ).fetchone()
        if other:
            for name in MERGED_INTO_OTHER:
                row = conn.execute(
                    "SELECT id FROM categories WHERE name = ?", (name,)
                ).fetchone()
                if row:
                    conn.execute(
                        "UPDATE records SET category_id = ? WHERE category_id = ?",
                        (other["id"], row["id"]),
                    )
                    conn.execute("DELETE FROM categories WHERE id = ?", (row["id"],))


def row_to_dict(row: sqlite3.Row) -> dict:
    return dict(row)


def get_categories(record_type: Optional[str] = None) -> list[dict]:
    with get_connection() as conn:
        if record_type:
            rows = conn.execute(
                "SELECT * FROM categories WHERE type = ? ORDER BY id",
                (record_type,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM categories ORDER BY type, id"
            ).fetchall()
    return [row_to_dict(r) for r in rows]


def add_record(
    record_type: str,
    amount: float,
    category_id: int,
    record_date: date,
    note: str = "",
) -> int:
    now = datetime.now().isoformat(timespec="seconds")
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO records (type, amount, category_id, record_date, note, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (record_type, amount, category_id, record_date.isoformat(), note, now),
        )
        return cursor.lastrowid


def delete_record(record_id: int) -> None:
    with get_connection() as conn:
        conn.execute("DELETE FROM records WHERE id = ?", (record_id,))


def get_records(
    year: Optional[int] = None,
    month: Optional[int] = None,
    record_type: Optional[str] = None,
) -> list[dict]:
    query = """
        SELECT r.*, c.name AS category_name
        FROM records r
        JOIN categories c ON r.category_id = c.id
        WHERE 1=1
    """
    params: list = []

    if year is not None:
        query += " AND strftime('%Y', r.record_date) = ?"
        params.append(f"{year:04d}")
    if month is not None:
        query += " AND strftime('%m', r.record_date) = ?"
        params.append(f"{month:02d}")
    if record_type:
        query += " AND r.type = ?"
        params.append(record_type)

    query += " ORDER BY r.record_date DESC, r.id DESC"

    with get_connection() as conn:
        rows = conn.execute(query, params).fetchall()
    return [row_to_dict(r) for r in rows]


def get_summary(year: int, month: int) -> dict:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT type, COALESCE(SUM(amount), 0) AS total
            FROM records
            WHERE strftime('%Y', record_date) = ?
              AND strftime('%m', record_date) = ?
            GROUP BY type
            """,
            (f"{year:04d}", f"{month:02d}"),
        ).fetchall()

    income = expense = 0.0
    for row in rows:
        if row["type"] == "income":
            income = row["total"]
        else:
            expense = row["total"]

    return {"income": income, "expense": expense, "balance": income - expense}


def get_category_breakdown(year: int, month: int, record_type: str) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT c.name, COALESCE(SUM(r.amount), 0) AS total
            FROM categories c
            LEFT JOIN records r ON r.category_id = c.id
                AND r.type = ?
                AND strftime('%Y', r.record_date) = ?
                AND strftime('%m', r.record_date) = ?
            WHERE c.type = ?
            GROUP BY c.id
            HAVING total > 0
            ORDER BY total DESC
            """,
            (record_type, f"{year:04d}", f"{month:02d}", record_type),
        ).fetchall()
    return [row_to_dict(r) for r in rows]


def get_daily_trend(year: int, month: int) -> list[dict]:
    """Daily income/expense totals for a month."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                CAST(strftime('%d', record_date) AS INTEGER) AS day,
                type,
                COALESCE(SUM(amount), 0) AS total
            FROM records
            WHERE strftime('%Y', record_date) = ?
              AND strftime('%m', record_date) = ?
            GROUP BY day, type
            ORDER BY day
            """,
            (f"{year:04d}", f"{month:02d}"),
        ).fetchall()

    days_in_month = _days_in_month(year, month)
    daily: dict[int, dict] = {
        d: {"day": d, "income": 0.0, "expense": 0.0} for d in range(1, days_in_month + 1)
    }
    for row in rows:
        day = row["day"]
        daily[day][row["type"]] = row["total"]

    return list(daily.values())


def get_monthly_trend(year: int) -> list[dict]:
    """Monthly income/expense totals for a year."""
    monthly = [
        {"month": m, "income": 0.0, "expense": 0.0, "balance": 0.0}
        for m in range(1, 13)
    ]
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                CAST(strftime('%m', record_date) AS INTEGER) AS month,
                type,
                COALESCE(SUM(amount), 0) AS total
            FROM records
            WHERE strftime('%Y', record_date) = ?
            GROUP BY month, type
            ORDER BY month
            """,
            (f"{year:04d}",),
        ).fetchall()

    for row in rows:
        idx = row["month"] - 1
        monthly[idx][row["type"]] = row["total"]

    for item in monthly:
        item["balance"] = item["income"] - item["expense"]

    return monthly


def get_top_expenses(year: int, month: int, limit: int = 5) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT r.amount, r.note, r.record_date, c.name AS category_name
            FROM records r
            JOIN categories c ON r.category_id = c.id
            WHERE r.type = 'expense'
              AND strftime('%Y', r.record_date) = ?
              AND strftime('%m', r.record_date) = ?
            ORDER BY r.amount DESC
            LIMIT ?
            """,
            (f"{year:04d}", f"{month:02d}", limit),
        ).fetchall()
    return [row_to_dict(r) for r in rows]


def _days_in_month(year: int, month: int) -> int:
    if month == 12:
        next_month = date(year + 1, 1, 1)
    else:
        next_month = date(year, month + 1, 1)
    return (next_month - date(year, month, 1)).days
