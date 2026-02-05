"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import UserForm from "./UserForm";
import { useState } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import {
  UserPlus,
  Key,
  Mail,
  Copy,
  Check,
  PartyPopper,
} from "lucide-react";
import toast from "react-hot-toast";

function UserContainer() {
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState(null);
  const [copied, setCopied] = useState({ email: false, password: false });
  const t = useTranslations("UserForm");

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    toast.success(t("Copied to clipboard") || "Copied!");
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setRes(null);
    setCopied({ email: false, password: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
          <UserPlus className="size-5 text-green-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("Add New User") || "Add New User"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Create a new user account with custom permissions") || "Create a new user account with custom permissions"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-6">
        <UserForm setRes={setRes} setOpen={setOpen} formType={"add"} />
      </div>

      {/* Success Modal */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#0f1118] border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
              <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <PartyPopper className="size-5 text-green-500" />
              </div>
              {t("User Created Successfully") || "User Created Successfully"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("saveCredentialsWarning") || "Save these credentials. The password won't be shown again."}
            </p>

            {/* Email */}
            <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Mail className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {t("Email") || "Email"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {res?.email}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => copyToClipboard(res?.email, "email")}
                >
                  {copied.email ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <Key className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {t("Temporary Password") || "Temporary Password"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-lg font-mono font-bold text-yellow-800 dark:text-yellow-300">
                  {res?.password}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 hover:bg-yellow-100 dark:hover:bg-yellow-500/20"
                  onClick={() => copyToClipboard(res?.password, "password")}
                >
                  {copied.password ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-xs text-red-600 dark:text-red-400">
                {t("passwordAutoGeneratedWarning") || "This password is auto-generated and cannot be recovered. Make sure to save it securely."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleClose}
              className="flex-1 bg-green-primary hover:bg-green-primary/90 text-white"
            >
              {t("Done") || "Done"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserContainer;
