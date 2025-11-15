function FormRow({ children }) {
  return (
    <div className="flex flex-col  md:flex-row md:justify-between md:items-center gap-24">
      {children}
    </div>
  );
}

export default FormRow;
