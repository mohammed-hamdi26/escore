import Image from "next/image";
function Logo({ className, src, width = "839", height = "585" }) {
  return (
    <Image
      className={className}
      src={src}
      alt="escore logo"
      width={width}
      height={height}
    />
  );
}

export default Logo;
