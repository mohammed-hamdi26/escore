"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LinkForm from "./LinkForm";

function DialogLinks({ t, trigger, dialogTitle, link, setLinks }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <LinkForm setOpen={setOpen} t={t} link={link} setLinks={setLinks} />
      </DialogContent>
    </Dialog>
  );
}

export default DialogLinks;
