import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LinksContainer from "./LinksContainer";
import LinksForm from "./LinksForm";

function LinksPageContainer({
  players,
  teams,
  id,
  links,
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
            Add new link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add new link</DialogTitle>
          <LinksForm
            id={id}
            teams={teams}
            players={players}
            linksType={linkType}
          />
        </DialogContent>
      </Dialog>
      <LinksContainer links={links} />
    </div>
  );
}

export default LinksPageContainer;
