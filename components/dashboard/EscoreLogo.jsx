import Image from "next/image";
import LogoImage from "../../public/images/logo.png";
function EscoreLogo({ className, width, height }) {
  return (
    <Image src={LogoImage} alt="escore logo" width={width} height={height} />
  );
}

export default EscoreLogo;
