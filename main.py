"""Legacy desktop entry point. Use app.py for the web version."""

import tkinter as tk
from datetime import date, datetime
from tkinter import messagebox, ttk

import database as db


class BookkeepingApp(tk.Tk):
    TYPE_LABELS = {"income": "收入", "expense": "支出"}

    def __init__(self) -> None:
        super().__init__()
        self.title("个人记账")
        self.geometry("900x620")
        self.minsize(800, 560)

        db.init_db()

        self._build_styles()
        self._build_ui()
        self._refresh_all()

    def _build_styles(self) -> None:
        style = ttk.Style(self)
        if "vista" in style.theme_names():
            style.theme_use("vista")
        style.configure("Title.TLabel", font=("Microsoft YaHei UI", 16, "bold"))
        style.configure("Summary.TLabel", font=("Microsoft YaHei UI", 11))
        style.configure("Income.TLabel", foreground="#1a7f37")
        style.configure("Expense.TLabel", foreground="#cf222e")
        style.configure("Balance.TLabel", font=("Microsoft YaHei UI", 12, "bold"))

    def _build_ui(self) -> None:
        container = ttk.Frame(self, padding=12)
        container.pack(fill=tk.BOTH, expand=True)

        header = ttk.Frame(container)
        header.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(header, text="个人记账", style="Title.TLabel").pack(side=tk.LEFT)

        self.summary_frame = ttk.LabelFrame(container, text="本月概览", padding=10)
        self.summary_frame.pack(fill=tk.X, pady=(0, 10))
        self._build_summary()

        body = ttk.PanedWindow(container, orient=tk.HORIZONTAL)
        body.pack(fill=tk.BOTH, expand=True)

        left = ttk.Frame(body, padding=(0, 0, 8, 0))
        body.add(left, weight=1)
        self._build_form(left)

        right = ttk.Frame(body, padding=(8, 0, 0, 0))
        body.add(right, weight=2)
        self._build_records(right)

    def _build_summary(self) -> None:
        row = ttk.Frame(self.summary_frame)
        row.pack(fill=tk.X)

        self.income_label = ttk.Label(row, text="收入：¥0.00", style="Income.TLabel")
        self.income_label.pack(side=tk.LEFT, padx=(0, 24))

        self.expense_label = ttk.Label(row, text="支出：¥0.00", style="Expense.TLabel")
        self.expense_label.pack(side=tk.LEFT, padx=(0, 24))

        self.balance_label = ttk.Label(row, text="结余：¥0.00", style="Balance.TLabel")
        self.balance_label.pack(side=tk.LEFT)

    def _build_form(self, parent: ttk.Frame) -> None:
        form = ttk.LabelFrame(parent, text="记一笔", padding=12)
        form.pack(fill=tk.BOTH, expand=True)

        ttk.Label(form, text="类型").grid(row=0, column=0, sticky=tk.W, pady=4)
        self.type_var = tk.StringVar(value="expense")
        type_frame = ttk.Frame(form)
        type_frame.grid(row=0, column=1, sticky=tk.W, pady=4)
        ttk.Radiobutton(
            type_frame, text="支出", value="expense", variable=self.type_var,
            command=self._on_type_change,
        ).pack(side=tk.LEFT, padx=(0, 12))
        ttk.Radiobutton(
            type_frame, text="收入", value="income", variable=self.type_var,
            command=self._on_type_change,
        ).pack(side=tk.LEFT)

        ttk.Label(form, text="金额").grid(row=1, column=0, sticky=tk.W, pady=4)
        self.amount_var = tk.StringVar()
        ttk.Entry(form, textvariable=self.amount_var, width=20).grid(
            row=1, column=1, sticky=tk.W, pady=4
        )

        ttk.Label(form, text="分类").grid(row=2, column=0, sticky=tk.W, pady=4)
        self.category_var = tk.StringVar()
        self.category_combo = ttk.Combobox(
            form, textvariable=self.category_var, state="readonly", width=18
        )
        self.category_combo.grid(row=2, column=1, sticky=tk.W, pady=4)

        ttk.Label(form, text="日期").grid(row=3, column=0, sticky=tk.W, pady=4)
        self.date_var = tk.StringVar(value=date.today().isoformat())
        ttk.Entry(form, textvariable=self.date_var, width=20).grid(
            row=3, column=1, sticky=tk.W, pady=4
        )

        ttk.Label(form, text="备注").grid(row=4, column=0, sticky=tk.NW, pady=4)
        self.note_text = tk.Text(form, width=22, height=4, font=("Microsoft YaHei UI", 9))
        self.note_text.grid(row=4, column=1, sticky=tk.W, pady=4)

        ttk.Button(form, text="保存记录", command=self._save_record).grid(
            row=5, column=1, sticky=tk.E, pady=(12, 0)
        )

        breakdown = ttk.LabelFrame(parent, text="分类统计（本月）", padding=10)
        breakdown.pack(fill=tk.BOTH, expand=True, pady=(10, 0))

        self.breakdown_text = tk.Text(
            breakdown, height=10, font=("Consolas", 10), state=tk.DISABLED, wrap=tk.WORD
        )
        self.breakdown_text.pack(fill=tk.BOTH, expand=True)

        self._load_categories()

    def _build_records(self, parent: ttk.Frame) -> None:
        toolbar = ttk.Frame(parent)
        toolbar.pack(fill=tk.X, pady=(0, 8))

        ttk.Label(toolbar, text="筛选：").pack(side=tk.LEFT)

        self.filter_year_var = tk.StringVar(value=str(date.today().year))
        ttk.Combobox(
            toolbar, textvariable=self.filter_year_var, width=6,
            values=[str(y) for y in range(date.today().year, date.today().year - 5, -1)],
            state="readonly",
        ).pack(side=tk.LEFT, padx=(0, 4))
        ttk.Label(toolbar, text="年").pack(side=tk.LEFT)

        self.filter_month_var = tk.StringVar(value=str(date.today().month))
        ttk.Combobox(
            toolbar, textvariable=self.filter_month_var, width=4,
            values=[str(m) for m in range(1, 13)], state="readonly",
        ).pack(side=tk.LEFT, padx=(8, 4))
        ttk.Label(toolbar, text="月").pack(side=tk.LEFT)

        self.filter_type_var = tk.StringVar(value="全部")
        ttk.Combobox(
            toolbar, textvariable=self.filter_type_var, width=8,
            values=["全部", "收入", "支出"], state="readonly",
        ).pack(side=tk.LEFT, padx=(12, 0))

        ttk.Button(toolbar, text="刷新", command=self._refresh_all).pack(side=tk.RIGHT)
        ttk.Button(toolbar, text="删除选中", command=self._delete_selected).pack(
            side=tk.RIGHT, padx=(0, 8)
        )

        columns = ("date", "type", "category", "amount", "note")
        self.tree = ttk.Treeview(
            parent, columns=columns, show="headings", selectmode="browse"
        )
        self.tree.heading("date", text="日期")
        self.tree.heading("type", text="类型")
        self.tree.heading("category", text="分类")
        self.tree.heading("amount", text="金额")
        self.tree.heading("note", text="备注")

        self.tree.column("date", width=100, anchor=tk.CENTER)
        self.tree.column("type", width=60, anchor=tk.CENTER)
        self.tree.column("category", width=90, anchor=tk.CENTER)
        self.tree.column("amount", width=90, anchor=tk.E)
        self.tree.column("note", width=200)

        scroll = ttk.Scrollbar(parent, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scroll.set)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scroll.pack(side=tk.RIGHT, fill=tk.Y)

        self.filter_year_var.trace_add("write", lambda *_: self._refresh_all())
        self.filter_month_var.trace_add("write", lambda *_: self._refresh_all())
        self.filter_type_var.trace_add("write", lambda *_: self._refresh_records())

    def _load_categories(self) -> None:
        record_type = self.type_var.get()
        categories = db.get_categories(record_type)
        names = [c["name"] for c in categories]
        self._category_map = {c["name"]: c["id"] for c in categories}
        self.category_combo["values"] = names
        if names:
            self.category_var.set(names[0])

    def _on_type_change(self) -> None:
        self._load_categories()

    def _parse_amount(self) -> float:
        text = self.amount_var.get().strip().replace(",", "")
        amount = float(text)
        if amount <= 0:
            raise ValueError("金额必须大于 0")
        return round(amount, 2)

    def _parse_date(self) -> date:
        return datetime.strptime(self.date_var.get().strip(), "%Y-%m-%d").date()

    def _save_record(self) -> None:
        try:
            amount = self._parse_amount()
            record_date = self._parse_date()
            category_name = self.category_var.get()
            if category_name not in self._category_map:
                raise ValueError("请选择分类")
            category_id = self._category_map[category_name]
            note = self.note_text.get("1.0", tk.END).strip()
            record_type = self.type_var.get()

            db.add_record(record_type, amount, category_id, record_date, note)
        except ValueError as exc:
            messagebox.showerror("输入错误", str(exc))
            return

        self.amount_var.set("")
        self.note_text.delete("1.0", tk.END)
        self._refresh_all()
        messagebox.showinfo("成功", "记录已保存")

    def _delete_selected(self) -> None:
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("提示", "请先选择一条记录")
            return
        if not messagebox.askyesno("确认", "确定删除选中的记录吗？"):
            return

        record_id = int(selected[0])
        db.delete_record(record_id)
        self._refresh_all()

    def _get_filter_params(self) -> tuple[int, int, str | None]:
        year = int(self.filter_year_var.get())
        month = int(self.filter_month_var.get())
        type_filter = self.filter_type_var.get()
        record_type = None
        if type_filter == "收入":
            record_type = "income"
        elif type_filter == "支出":
            record_type = "expense"
        return year, month, record_type

    def _refresh_summary(self) -> None:
        year, month, _ = self._get_filter_params()
        summary = db.get_summary(year, month)

        self.income_label.config(text=f"收入：¥{summary['income']:,.2f}")
        self.expense_label.config(text=f"支出：¥{summary['expense']:,.2f}")
        balance = summary["balance"]
        sign = "+" if balance >= 0 else ""
        self.balance_label.config(text=f"结余：{sign}¥{balance:,.2f}")

    def _refresh_breakdown(self) -> None:
        year, month, _ = self._get_filter_params()
        expense_rows = db.get_category_breakdown(year, month, "expense")
        income_rows = db.get_category_breakdown(year, month, "income")

        lines = ["【支出分类】"]
        if expense_rows:
            for row in expense_rows:
                lines.append(f"  {row['name']:<8} ¥{row['total']:,.2f}")
        else:
            lines.append("  （暂无）")

        lines.append("")
        lines.append("【收入分类】")
        if income_rows:
            for row in income_rows:
                lines.append(f"  {row['name']:<8} ¥{row['total']:,.2f}")
        else:
            lines.append("  （暂无）")

        self.breakdown_text.config(state=tk.NORMAL)
        self.breakdown_text.delete("1.0", tk.END)
        self.breakdown_text.insert("1.0", "\n".join(lines))
        self.breakdown_text.config(state=tk.DISABLED)

    def _refresh_records(self) -> None:
        for item in self.tree.get_children():
            self.tree.delete(item)

        year, month, record_type = self._get_filter_params()
        records = db.get_records(year, month, record_type)

        for row in records:
            amount_prefix = "+" if row["type"] == "income" else "-"
            self.tree.insert(
                "",
                tk.END,
                iid=str(row["id"]),
                values=(
                    row["record_date"],
                    self.TYPE_LABELS[row["type"]],
                    row["category_name"],
                    f"{amount_prefix}¥{row['amount']:,.2f}",
                    row["note"],
                ),
            )

    def _refresh_all(self) -> None:
        self._refresh_summary()
        self._refresh_breakdown()
        self._refresh_records()


def main() -> None:
    app = BookkeepingApp()
    app.mainloop()


if __name__ == "__main__":
    main()
