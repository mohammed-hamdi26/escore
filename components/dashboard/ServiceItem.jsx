import { Link } from "@/i18n/navigation";

function ServiceItem({ title, icon, href, description }) {
  return (
    <Link
      href={href}
      className="bg-dashboard-box dark:bg-linear-to-b dark:from-[#00000005] dark:to-[#24397b14] rounded-2xl hover:bg-green-primary transition-colors duration-300 cursor-pointer group px-8 py-12"
    >
      {icon}
      <h3 className="text-lg my-2.5  text-header-box group-hover:text-white transition-colors duration-300 ">
        {title}
      </h3>
      <p className="text-sm text-[#A7A8AB] transition-colors duration-300  group-hover:text-white">
        {description}
      </p>
    </Link>
  );
}

export default ServiceItem;
