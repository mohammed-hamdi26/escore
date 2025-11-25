import BlurCircle from "@/components/Login/BlurCircle";
import Logo from "@/components/Login/Logo";
import FormContainer from "@/components/register/FormContainer";
import OtpContainer from "@/components/register/OtpContainer";
import logoImageTop from "@/public/images/Login/Layer_1.png";
import logoImageBottom from "@/public/images/Login/Layer_2.png";
function page({ children, params }) {
  return (
    <div
      className={`h-screen md:px-28 flex
        items-center  relative overflow-hidden w-full`}
    >
      <Logo src={logoImageTop} className="absolute top-0 left-10" />
      <Logo src={logoImageBottom} className="absolute -bottom-40 -left-30" />
      <BlurCircle
        position={
          "left-0 -bottom-1/2 -translate-y-1/2 -translate-x-1/2  md:-bottom-[250px] md:left-1/2 md:-translate-y-0   "
        }
      />
      <BlurCircle
        position={
          "-right-1/2 -translate-x-1/2 -top-1/2 translate-y-1/2 md:left-[300px] md:top-0 md:-translate-y-0"
        }
      />
      {children}
    </div>
  );
}

export default page;
