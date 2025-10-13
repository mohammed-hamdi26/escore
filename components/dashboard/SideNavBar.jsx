import Image from "next/image";
import { Sidebar, SidebarHeader, SidebarProvider } from "../ui/sidebar";

import avatar from "@/public/images/dashboard/avatar.jpg";
const links = [
  {
    title: "Settings",
    href: "/settings",
    icon: "",
  },
  {
    title: "Logout",
    href: "/logout",
    icon: "",
  },
];
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
  return (
    <nav
      className={
        "bg-linear-to-b from-[#00000005] to-[#24397b14]  py-16 w-[270px] border border-white rounded-2xl "
      }
    >
      <SideNavHeader />
    </nav>
  );
}

function SideNavHeader() {
  <div className="flex justify-center gap-4 ">
    <div className="size-12 overflow-hidden rounded-full relative">
      <Image alt="avatar" src={avatar} fill className="object-cover" />{" "}
    </div>
    <div className="text-white capitalize">
      <h3 className="text-lg ">ahmed</h3>
      <p className="text-sm text-[#667085]">admin</p>
    </div>
  </div>;
}
export default SideNavBar;
