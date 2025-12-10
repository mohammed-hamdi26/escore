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

function DialogLinks({ t, trigger, dialogTitle, link, onSuccess }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-dashboard-box dark:bg-[#0F1017] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">{dialogTitle}</DialogTitle>
        </DialogHeader>
        <LinkForm
          setOpen={setOpen}
          t={t}
          link={link}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

export default DialogLinks;
