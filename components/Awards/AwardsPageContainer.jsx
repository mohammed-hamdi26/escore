import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import AwardsForm from "./AwardsForm";

function AwardsPageContainer({
  awardsType = "player",
  players,
  teams,
  tournaments,
  games,
  id,
}) {
  return (
    <div className="space-y-8   ">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={
              "bg-green-primary text-white cursor-pointer hover:bg-green-primary/70"
            }
          >
            Add new Award
          </Button>
        </DialogTrigger>
        <DialogContent className={" max-h-[80vh] overflow-y-auto"}>
          <DialogTitle>Add new Award</DialogTitle>
          <AwardsForm
            id={id}
            tournaments={tournaments}
            teams={teams}
            games={games}
            players={players}
            awardsType={awardsType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AwardsPageContainer;
