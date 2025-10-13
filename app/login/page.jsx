import Logo from "@/components/Login/Logo";
import logoImageTop from "../../public/images/Login/Layer_1.png";
import logoImageBottom from "../../public/images/Login/Layer_2.png";
import LoginFrom from "@/components/Login/LoginFrom";
import BlurCircle from "@/components/Login/BlurCircle";
import UsersContainer from "@/components/Login/UsersContainer";

export default function page() {
  return (
    <div className="h-screen px-28 flex  items-center relative overflow-hidden w-full">
      <Logo src={logoImageTop} className="absolute top-0 left-10" />
      <Logo src={logoImageBottom} className="absolute -bottom-40 -left-30" />
      <BlurCircle position={"-bottom-[250px] left-1/2 -translate-x-1/2 "} />
      <BlurCircle position={"left-[300px]"} />
      <div className="flex items-center justify-between w-full relative">
        <div className="flex items-center gap-14">
          <UsersContainer />
          <h1 className="text-6xl font-bold z-10 ">
            Sign In to Go <br />
            to Dashboard
          </h1>
        </div>
        <LoginFrom />
      </div>
    </div>
  );
}
