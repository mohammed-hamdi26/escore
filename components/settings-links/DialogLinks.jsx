import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LinkForm from "./LinkForm";

function DialogLinks({ t }) {
  return (
    <Dialog>
      <DialogTrigger
        className={
          "text-white text-center w-fit min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-colors duration-300"
        }
      >
        {t("Add New Link")}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("Add New Link")}</DialogTitle>
        {/* <DialogDescription></DialogDescription> */}

        <LinkForm t={t} />
      </DialogContent>
    </Dialog>
  );
}

export default DialogLinks;
