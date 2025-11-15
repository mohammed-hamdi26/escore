function FormRow({ children, gap = "gap-24" }) {
  return (
    <div
      className={`flex flex-col  md:flex-row md:justify-between md:items-center ${gap}`}
    >
      {children}
    </div>
  );
}

export default FormRow;
