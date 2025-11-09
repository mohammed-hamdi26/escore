import { Button } from "../ui/button";

function FilterItem({ onClick, children }) {
  return (
    <Button
      className={
        "rounded-full bg-dashboard-box/60 text-[#10131D] hover:bg-dashboard-box dark:bg-[#10131D] dark:hover:bg-[#1A1D24] dark:text-white cursor-pointer"
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default FilterItem;
