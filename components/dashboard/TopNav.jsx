import { Link } from "@/i18n/navigation";
import BackPage from "../ui app/BackPage";
import ToggleThemeMode from "../ui app/ToggleThemeMode";
import EscoreLogo from "./EscoreLogo";
import LocaleChange from "../ui app/LocaleChange";

function TopNav() {
  return (
    <div className="flex items-center justify-between gap-[190px] mb-8">
      <Link href="/dashboard">
        <EscoreLogo width={100} height={50} />
      </Link>
      <div className="flex items-center  justify-between flex-1 ">
        <BackPage />
        <div className={`flex in-ltr:ml-auto rtl:mr-auto items-center gap-6`}>
          <ToggleThemeMode />
          <LocaleChange />
        </div>
      </div>
    </div>
  );
}

export default TopNav;
