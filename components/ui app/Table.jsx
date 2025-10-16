function Table({ columns, data, children, grid_cols }) {
  return (
    <table className="w-full">
      <TableHeader>
        <TableRow
          className={`px-16 grid gap-8 ${grid_cols} bg-[#384E9733] rounded-full`}
        >
          {columns.map((column) => (
            <TableHeaderRow className="py-4 text-sm text-start" key={column.id}>
              {column.header}
            </TableHeaderRow>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            className={`px-16 py-2 grid gap-8 ${grid_cols}  border-b border-[#313A5F] `}
            key={index}
          >
            {Object.values(row).map((value) => (
              <TableCell
                className=" text-start py-4 text-sm     "
                key={value.id}
              >
                {value}
              </TableCell>
            ))}
            <TableCell className=" flex justify-end items-center gap-4    ">
              {children}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </table>
  );
}

function TableHeader({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}
function TableHeaderRow({ children, ...props }) {
  return <th {...props}>{children}</th>;
}
function TableRow({ children, ...props }) {
  return <tr {...props}>{children}</tr>;
}
function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}
function TableCell({ children, ...props }) {
  return <td {...props}>{children}</td>;
}

export default Table;
