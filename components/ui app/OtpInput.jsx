"use client";
import { useId, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useFormik } from "formik";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

import * as Yup from "yup";
import toast from "react-hot-toast";
import { verifyAccount, resendOTP } from "@/app/[locale]/_Lib/actions";

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d+$/, "Code must contain only numbers")
    .length(6, "Code must be 6 numbers")
    .required("Code is required"),
});

function OtpInput({ t }) {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Get email from sessionStorage
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("verifyEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        // No email found, redirect to register
        toast.error(t("Please register first"));
        router.push("/register/form");
      }
    }
  }, [router, t]);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!email) {
        toast.error(t("emailNotFound"));
        router.push("/register/form");
        return;
      }

      const result = await verifyAccount(email, values.otp);

      if (result.success) {
        toast.success(t("Account verified successfully!"));
        // Clear the stored email
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("verifyEmail");
        }
        router.push("/login");
      } else {
        toast.error(result.error || t("Verification failed"));
      }
    },
  });

  const handleResendOTP = async () => {
    if (!email) {
      toast.error(t("Email not found"));
      return;
    }

    setIsResending(true);
    const result = await resendOTP(email, "verify");
    if (result.success) {
      toast.success(t("Code resent to your email"));
    } else {
      toast.error(result.error || t("Failed to resend code"));
    }
    setIsResending(false);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-3 w-full">
      {email && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
          {t("Code sent to")}:{" "}
          <span className="font-medium text-green-primary">{email}</span>
        </p>
      )}
      <InputOTP
        value={formik.values.otp}
        onChange={(value) => formik.setFieldValue("otp", value)}
        onBlur={() => formik.setFieldTouched("otp", true)}
        className="w-full"
        id={id}
        maxLength={6}
      >
        <InputOTPGroup className="w-full flex justify-between *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-gray-300 *:data-[slot=input-otp-slot]:dark:border-gray-600 *:data-[slot=input-otp-slot]:bg-white *:data-[slot=input-otp-slot]:dark:bg-gray-700 *:data-[slot=input-otp-slot]:text-gray-900 *:data-[slot=input-otp-slot]:dark:text-white *:data-[slot=input-otp-slot]:mr-0">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot
              key={index}
              disabled={formik.isSubmitting}
              className="size-10"
              index={index}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {formik.touched.otp && formik.errors.otp && (
        <p className="text-sm text-destructive">{formik.errors.otp}</p>
      )}

      {/* Resend OTP */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={isResending}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
          />
          {isResending ? t("resending") : t("Resend Code")}
        </button>
      </div>

      <Button
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
        className="w-full bg-green-primary hover:bg-green-primary/70 text-white cursor-pointer font-bold rounded-[10px] text-lg py-5.5 mt-4 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {formik.isSubmitting ? t("verifying") : t("Verify")}
      </Button>
    </form>
  );
}

export default OtpInput;
