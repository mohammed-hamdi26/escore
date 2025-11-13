"use client";

import { deleteLanguage } from "@/app/[locale]/_Lib/languageAPI";
import { Button } from "@/components/ui/button";

function DeleteLanguageButton({ code, onDelete }) {
  const handleDelete = async () => {
    const success = await deleteLanguage(code);
    if (success) {
      onDelete();
    }
  };

  return (
    <Button
      variant={"destructive"}
      className="rounded-full min-w-[100px] cursor-pointer"
      onClick={()=>handleDelete(code)}
    >
      Delete
    </Button>
  );
}

export default DeleteLanguageButton;
