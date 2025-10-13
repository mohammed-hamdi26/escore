import Image from "next/image";
function Logo({ className, src, width, height }) {
  return (
    <Image
      className={className}
      src={src}
      alt="escore logo"
      width={839}
      height={585}
    />
  );
}

export default Logo;
