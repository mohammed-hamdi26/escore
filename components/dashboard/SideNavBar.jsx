"use client";
import { useTranslations } from "next-intl";
import { Sidebar, SidebarHeader, SidebarProvider } from "../ui/sidebar";

import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

// function SideNavBar() {
//   return (
//     <SidebarProvider>
//       <Sidebar
//         className={
//           "bg-linear-to-b from-[#00000005] to-[#24397b14]  relative outline-0 py-16"
//         }
//       >
//         <SidebarHeader>
//           <div className=" mx-auto  flex ">
//             <div className="size-11 overflow-hidden rounded-full relative">
//               <Image alt="avatar" src={avatar} fill className="object-cover" />{" "}
//             </div>
//             <div className="text-white">
//               <h3>ahmed</h3>
//               <p>admin</p>
//             </div>
//           </div>
//         </SidebarHeader>
//       </Sidebar>
//     </SidebarProvider>
//   );
// }

function SideNavBar() {
  const t = useTranslations("nav");
  return (
    <div className="  w-[270px] ">
      <nav
        className={
          " bg-dashboard-box dark:bg-linear-to-b dark:from-[#00000005] dark:to-[#24397b14] flex flex-col justify-center   py-16 w-[270px]  rounded-2xl min-h-[calc(100vh-155px)]  "
        }
      >
        <HeaderSideNavBar t={t} />
        <NavItems t={t} />
      </nav>
    </div>
  );
}

export default SideNavBar;
