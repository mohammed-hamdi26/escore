import Image from "next/image";
import LogoImage from "../../public/images/logo.png";

function EscoreLogo({ className = "", width = 120, height = 48 }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Image
        src={LogoImage}
        alt="Escore Logo"
        width={width}
        height={height}
        className="object-contain transition-transform duration-200 hover:scale-105"
        priority
      />
    </div>
  );
}

export default EscoreLogo;
