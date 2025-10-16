import { Sidebar, SidebarHeader, SidebarProvider } from "../ui/sidebar";

import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";
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
      <HeaderSideNavBar />
      <NavItems />
    </nav>
  );
}

export default SideNavBar;
