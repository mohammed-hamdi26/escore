import { useState } from "react";
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

function DialogLinks({ t, trigger, dialogTitle, link }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{dialogTitle}</DialogTitle>
        {/* <DialogDescription></DialogDescription> */}

        <LinkForm setOpen={setOpen} t={t} link={link} />
      </DialogContent>
    </Dialog>
  );
}

export default DialogLinks;
