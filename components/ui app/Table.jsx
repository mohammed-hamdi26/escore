function Table({ columns, children, grid_cols, showHeader = true }) {
  return (
    <>
      <table className="w-full">
        {showHeader && (
          <TableHeader>
            <TableRow
              className={`px-16 grid gap-8 ${grid_cols} bg-[#F5F6F8] dark:bg-[#384E9733] rounded-full`}
            >
              {columns.map((column) => (
                <TableHeaderRow
                  className="py-4 text-sm text-start text-[#677185] dark:text-white"
                  key={column.id}
                >
                  {column.header}
                </TableHeaderRow>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>{children && children}</TableBody>
      </table>
      {!children && (
        <p className="text-center py-4 text-2xl font-bold text-black dark:text-white ">
          No data
        </p>
      )}
    </>
  );
}

function TableHeader({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}
function TableHeaderRow({ children, ...props }) {
  return <th {...props}>{children}</th>;
}
function TableRow({ children, grid_cols, ...props }) {
  return (
    <tr
      className={`px-16 py-4 grid items-center gap-8 ${grid_cols} text-[#677185] dark:text-white  border-b border-[#313A5F] `}
      {...props}
    >
      {children}
    </tr>
  );
}
function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}
function TableCell({ children, grid_cols, ...props }) {
  return <td {...props}>{children}</td>;
}
Table.Row = TableRow;
Table.Cell = TableCell;
export default Table;
