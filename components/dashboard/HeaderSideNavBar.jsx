import Image from "next/image";
import avatar from "@/public/images/dashboard/avatar.jpg";

function HeaderSideNavBar() {
  return (
    <div className="flex justify-center gap-4 mb-10 ">
      <div className="size-12 overflow-hidden rounded-full relative">
        <Image alt="avatar" src={avatar} fill className="object-cover" />{" "}
      </div>
      <div className="text-white capitalize">
        <h3 className="text-lg ">ahmed</h3>
        <p className="text-sm text-[#667085]">admin</p>
      </div>
    </div>
  );
}

export default HeaderSideNavBar;
