"use client";

import { useTranslations } from "next-intl";
import OtpInput from "../ui app/OtpInput";

function OtpContainer() {
  const t = useTranslations("Register");

  return (
    <div className="flex w-full justify-center z-10">
      <div className="bg-white dark:bg-gray-800 lg:w-1/4 sm:w-1/2 w-[95%] mx-auto px-4 py-10 rounded-lg shadow-lg space-y-6 flex justify-center flex-col items-center">
        <div className="w-full text-center">
          <h1 className="text-3xl text-gray-900 dark:text-white font-bold">
            {t("Verify code")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-semibold mt-2">
            {t("An authentication code has been sent to your email.")}
          </p>
        </div>
        <OtpInput t={t} />
      </div>
    </div>
  );
}

export default OtpContainer;
