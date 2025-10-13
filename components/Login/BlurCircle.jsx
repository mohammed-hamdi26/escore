function BlurCircle({ position }) {
  return (
    <div
      className={`absolute size-[417px] bg-green-primary rounded-full blur-[100px] ${position}  `}
    ></div>
  );
}

export default BlurCircle;
