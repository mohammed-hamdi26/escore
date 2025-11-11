function FormRow({ children }) {
  return (
    <div className="flex flex-col  md:flex-row justify-between gap-24">
      {children}
    </div>
  );
}

export default FormRow;
