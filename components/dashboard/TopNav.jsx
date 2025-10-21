import BackPage from "../ui app/BackPage";
import ToggleThemeMode from "../ui app/ToggleThemeMode";
import EscoreLogo from "./EscoreLogo";

function TopNav() {
  return (
    <div className="flex items-center justify-between gap-[190px] mb-8">
      <EscoreLogo width={100} height={50} />
      <div className="flex items-center  justify-between flex-1 ">
        <BackPage />
        <ToggleThemeMode />
      </div>
    </div>
  );
}

export default TopNav;
