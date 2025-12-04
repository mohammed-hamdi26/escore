import Image from "next/image";
import avatar from "@/public/images/dashboard/avatar.jpg";

function HeaderSideNavBar({ user, t }) {
  return (
    <div className="flex justify-center gap-4 mb-10 ">
      <div className="size-12 overflow-hidden rounded-full relative">
        {(user?.avatar?.light || user?.avatar?.dark) && (
          <img
            alt="avatar"
            src={user?.avatar?.light || user?.avatar?.dark}
            fill
            className="object-cover object-center"
          />
        )}{" "}
      </div>
      <div className="text-white capitalize">
        <h3 className="text-lg text-[#677185] dark:text-white font-bold ">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-[#667085]">{t("admin")}</p>
      </div>
    </div>
  );
}

export default HeaderSideNavBar;
