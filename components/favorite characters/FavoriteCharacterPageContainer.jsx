import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import FavoriteCharacterForm from "./FavoriteCharacterForm";

function FavoriteCharacterPageContainer({
  id,
  players,
  games,
  linkType = "player",
}) {
  return (
    <div className="space-y-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={
              "bg-green-primary text-white cursor-pointer hover:bg-green-primary/70"
            }
          >
            Add new Favorite Character
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add new Favorite Character</DialogTitle>
          <FavoriteCharacterForm
            games={games}
            id={id}
            players={players}
            linksType={linkType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FavoriteCharacterPageContainer;
