import Link from "next/link";

function NavItem({ icon, label, href }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-2  rounded-full  ">
        <span className="px-2.5 py-2.5 rounded-lg bg-[#262C3D33] ">{icon}</span>{" "}
        <p className="text-lg font-semibold ">{label}</p>
      </Link>
    </li>
  );
}

export default NavItem;
