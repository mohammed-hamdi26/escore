"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import logoImage from "@/public/images/logo.png";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, Mail, CheckCircle, KeyRound, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword, resetPassword, resendOTP } from "../_Lib/actions";

const emailValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const resetValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d+$/, "Code must contain only numbers")
    .length(6, "Code must be 6 numbers")
    .required("Code is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

function ForgetPasswordPage() {
  const t = useTranslations("ForgetPassword");
  const [step, setStep] = useState(1); // 1: email, 2: OTP + password, 3: success
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Email form
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      const result = await forgotPassword(values.email);
      if (result.success) {
        setEmail(values.email);
        setStep(2);
        toast.success(t("otpSent"));
      } else {
        toast.error(result.error || t("error"));
      }
    },
  });

  // Reset password form
  const resetFormik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetValidationSchema,
    onSubmit: async (values) => {
      const result = await resetPassword(email, values.otp, values.newPassword);
      if (result.success) {
        setStep(3);
        toast.success(t("passwordResetSuccess"));
      } else {
        toast.error(result.error || t("resetError"));
      }
    },
  });

  const handleResendOTP = async () => {
    setIsResending(true);
    const result = await resendOTP(email, "reset");
    if (result.success) {
      toast.success(t("otpResent"));
    } else {
      toast.error(result.error || t("resendError"));
    }
    setIsResending(false);
  };

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto space-y-8 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("successTitle")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("successDescription")}
          </p>
        </div>
        <Link
          href="/login"
          className="w-full font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-4 text-center transition-colors"
        >
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  // Step 2: OTP + New Password
  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto space-y-8">
        <div className="space-y-6 flex flex-col items-center">
          <Image src={logoImage} alt="logo" width={250} height={40} />
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("enterOtpTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("otpSentTo")} <span className="font-medium text-green-primary">{email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={resetFormik.handleSubmit} className="flex flex-col gap-5 w-full">
          {/* OTP Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">{t("otpLabel")}</label>
            <InputOTP
              value={resetFormik.values.otp}
              onChange={(value) => resetFormik.setFieldValue("otp", value)}
              onBlur={() => resetFormik.setFieldTouched("otp", true)}
              className="w-full"
              maxLength={6}
            >
              <InputOTPGroup className="w-full flex justify-between *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-gray-300 *:data-[slot=input-otp-slot]:dark:border-gray-600 *:data-[slot=input-otp-slot]:bg-white *:data-[slot=input-otp-slot]:dark:bg-gray-800 *:data-[slot=input-otp-slot]:text-gray-900 *:data-[slot=input-otp-slot]:dark:text-white">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    disabled={resetFormik.isSubmitting}
                    className="size-12"
                    index={index}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {resetFormik.touched.otp && resetFormik.errors.otp && (
              <p className="text-sm text-red-500">{resetFormik.errors.otp}</p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? t("resending") : t("resendOtp")}
            </button>
          </div>

          {/* New Password */}
          <InputApp
            t={t}
            placeholder={t("newPasswordPlaceholder")}
            name="newPassword"
            type="password"
            error={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
            onChange={resetFormik.handleChange}
            onBlur={resetFormik.handleBlur}
            value={resetFormik.values.newPassword}
            className="w-full"
          />

          {/* Confirm Password */}
          <InputApp
            t={t}
            placeholder={t("confirmPasswordPlaceholder")}
            name="confirmPassword"
            type="password"
            error={resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword}
            onChange={resetFormik.handleChange}
            onBlur={resetFormik.handleBlur}
            value={resetFormik.values.confirmPassword}
            className="w-full"
          />

          <Button
            disabled={resetFormik.isSubmitting || !resetFormik.isValid}
            type="submit"
            className="w-full font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {resetFormik.isSubmitting ? t("resetting") : t("resetPassword")}
          </Button>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("changeEmail")}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 1: Email Input
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto space-y-8">
      <div className="space-y-6 flex flex-col items-center">
        <Image src={logoImage} alt="logo" width={250} height={40} />
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </div>
      </div>

      <form onSubmit={emailFormik.handleSubmit} className="flex flex-col gap-5 w-full">
        <InputApp
          t={t}
          placeholder={t("emailPlaceholder")}
          name="email"
          type="email"
          error={emailFormik.touched.email && emailFormik.errors.email}
          onChange={emailFormik.handleChange}
          onBlur={emailFormik.handleBlur}
          value={emailFormik.values.email}
          className="w-full"
        />

        <Button
          disabled={emailFormik.isSubmitting || !emailFormik.isValid}
          type="submit"
          className="w-full font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {emailFormik.isSubmitting ? t("sending") : t("sendOtp")}
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
