import BlurCircle from "@/components/Login/BlurCircle";
import FormContainer from "@/components/Login/FormContainer";
import Logo from "@/components/Login/Logo";
import logoImageTop from "@/public/images/Login/Layer_1.png";
import logoImageBottom from "@/public/images/Login/Layer_2.png";

export default function page() {
  return (
    <div className="h-screen px-28 flex  items-center relative overflow-hidden w-full">
      <Logo src={logoImageTop} className="absolute top-0 left-10" />
      <Logo src={logoImageBottom} className="absolute -bottom-40 -left-30" />
      <BlurCircle position={"-bottom-[250px] left-1/2 -translate-x-1/2 "} />
      <BlurCircle position={"left-[300px]"} />
      <FormContainer />
    </div>
  );
}
