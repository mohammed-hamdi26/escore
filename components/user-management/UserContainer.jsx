"use client";

import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import UserForm from "./UserForm";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function UserContainer() {
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState(null);
  console.log(res);
  return (
    <div>
      <Dialog className open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/* <DialogHeader>
            <DialogTitle>user details</DialogTitle>
            <DialogDescription>klsdjsfl;k</DialogDescription>
          </DialogHeader> */}
          <div className="flex justify-center items-center flex-col gap-2">
            <p>email: {res?.email}</p>
            <p>pass: {res?.password}</p>
          </div>
        </DialogContent>
      </Dialog>
      <UserForm setRes={setRes} setOpen={setOpen} formType={"add"} />
    </div>
  );
}

export default UserContainer;
