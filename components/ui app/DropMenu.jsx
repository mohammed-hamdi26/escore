import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function DropMenu({ menuTrigger, menuContent = [] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{menuTrigger}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-34">
        <DropdownMenuGroup>
          {menuContent.map((item, index) => (
            <DropdownMenuItem key={item.id}> {item.menuItem}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropMenu;
