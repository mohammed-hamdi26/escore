function FormRow({ children, cols = 2 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[cols] || gridCols[2]} gap-4 md:gap-6`}>
      {children}
    </div>
  );
}

export default FormRow;
