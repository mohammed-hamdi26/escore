"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import logoImage from "@/public/images/logo.png";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "../_Lib/actions";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

function ForgetPasswordPage() {
  const t = useTranslations("ForgetPassword");
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await forgotPassword(values.email);
        setIsSuccess(true);
        toast.success(t("emailSent"));
      } catch (error) {
        toast.error(error.message || t("error"));
      }
    },
  });

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto space-y-8 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("checkEmail")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("emailSentDescription")}
          </p>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-2 text-green-primary hover:text-green-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto space-y-8">
      <div className="space-y-6 flex flex-col items-center">
        <Image src={logoImage} alt="logo" width={250} height={40} />
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full">
        <InputApp
          t={t}
          placeholder={t("emailPlaceholder")}
          name="email"
          type="email"
          error={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="w-full"
        />

        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="w-full font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? t("sending") : t("sendResetLink")}
        </Button>

        <div className="flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToLogin")}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgetPasswordPage;
