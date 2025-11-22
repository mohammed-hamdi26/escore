"use client";

import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { ErrorIcon } from "react-hot-toast";
import BoxPoints from "@/components/icons/BoxPoints";
import { Link } from "@/i18n/navigation";

export default function Error({ error, reset }) {
  const t = useTranslations("Error");
  return (
    <main className="flex justify-center items-center flex-col gap-6 h-dvh relative overflow-hidden">
      <Circle className="-top-[50px]  -left-[50px]" />
      <Circle className="-top-[50px]  -right-[50px]" />
      <h1 className="text-3xl font-semibold flex gap-2 items-center">
        <CircleX /> {t("Something went wrong!")}
      </h1>
      <p className="text-lg">{error.message}</p>
      <BoxPoints
        position={" bottom-4 left-4 "}
        className={"fill-green-primary"}
      />
      <BoxPoints
        position={" right-10 bottom-[200px] "}
        className={"fill-green-primary"}
      />
      <div className="flex items-center gap-4">
        <Link href="/" className="cursor-pointer">
          <Button className="bg-green-primary text-white  font-bold px-6 py-6 text-lg">
            {t("Home")}
          </Button>
        </Link>
        <Button
          className="bg-green-primary text-white  font-bold px-6 py-6 text-lg"
          onClick={() => reset()}
        >
          {t("Try again")}
        </Button>
      </div>
    </main>
  );
}

function Circle({ className }) {
  return (
    <div
      className={
        className +
        " rounded-full outline-[30px] outline-green-primary size-40 absolute"
      }
    ></div>
  );
}
