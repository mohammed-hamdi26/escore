function Table({ t, columns, children, grid_cols, showHeader = true }) {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-transparent dark:border-white/5">
      <table className="w-full">
        {showHeader && (
          <TableHeader>
            <tr className={`grid gap-6 px-6 ${grid_cols}`}>
              {columns.map((column) => (
                <TableHeaderCell key={column.id}>
                  {t ? t(column.header) : column.header}
                </TableHeaderCell>
              ))}
            </tr>
          </TableHeader>
        )}
        <TableBody>{children}</TableBody>
      </table>
      {!children && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <svg
            className="size-12 mb-3 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium">No data available</p>
        </div>
      )}
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <thead className="bg-muted/50 dark:bg-white/5 border-b border-border">
      {children}
    </thead>
  );
}

function TableHeaderCell({ children }) {
  return (
    <th className="py-4 text-start text-sm font-medium text-muted-foreground">
      {children}
    </th>
  );
}

function TableRow({ children, grid_cols, className = "", ...props }) {
  return (
    <tr
      className={`grid items-center gap-6 px-6 py-4 ${grid_cols} border-b border-border last:border-b-0 transition-colors hover:bg-muted/30 dark:hover:bg-white/5 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`text-sm text-foreground ${className}`} {...props}>
      {children}
    </td>
  );
}

Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
