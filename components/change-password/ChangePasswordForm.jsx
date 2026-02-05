"use client";

import { useFormik } from "formik";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import InputApp from "../ui app/InputApp";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { changePassword } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { Info, Check, X } from "lucide-react";

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

function PasswordRequirement({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`}>
      {met ? <Check className="size-3.5" /> : <X className="size-3.5" />}
      <span>{text}</span>
    </div>
  );
}

function ChangePasswordForm() {
  const t = useTranslations("ChangePassword");
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const passwordValues = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      try {
        await changePassword(passwordValues);
        toast.success(t("Password changed successfully"));
        formik.resetForm();
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message || t("Failed to change password");
        toast.error(errorMessage);
      }
    },
  });

  // Password validation checks
  const password = formik.values.newPassword;
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <FormSection>
        <FormRow>
          <InputApp
            label={t("Current Password")}
            type="password"
            name="currentPassword"
            error={
              formik.touched.currentPassword &&
              formik.errors.currentPassword &&
              t(formik.errors.currentPassword)
            }
            placeholder={t("Current Password")}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            {...formik.getFieldProps("currentPassword")}
          />
          <div className="flex-1 space-y-3">
            <InputApp
              label={t("New Password")}
              type="password"
              name="newPassword"
              error={
                formik.touched.newPassword &&
                formik.errors.newPassword &&
                t(formik.errors.newPassword)
              }
              placeholder={t("New Password")}
              className="border-0 focus:outline-none"
              backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
              textColor="text-[#677185]"
              {...formik.getFieldProps("newPassword")}
            />
            {/* Password Requirements */}
            {password && (
              <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                  <Info className="size-3.5" />
                  {t("Password Requirements")}
                </div>
                <PasswordRequirement met={hasMinLength} text={t("At least 8 characters")} />
                <PasswordRequirement met={hasUppercase} text={t("At least one uppercase letter")} />
                <PasswordRequirement met={hasLowercase} text={t("At least one lowercase letter")} />
                <PasswordRequirement met={hasNumber} text={t("At least one number")} />
              </div>
            )}
          </div>
        </FormRow>
        <InputApp
          label={t("Confirm Password")}
          type="password"
          name="confirmPassword"
          error={
            formik.touched.confirmPassword &&
            formik.errors.confirmPassword &&
            t(formik.errors.confirmPassword)
          }
          placeholder={t("Confirm Password")}
          className="border-0 focus:outline-none"
          backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
          textColor="text-[#677185]"
          {...formik.getFieldProps("confirmPassword")}
        />
        <div className="flex justify-end ">
          <Button
            disabled={formik.isSubmitting || !formik.isValid}
            type="submit"
            className="text-white cursor-pointer bg-green-primary hover:bg-green/70"
          >
            {formik.isSubmitting ? <Spinner /> : t("Change Password")}
          </Button>
        </div>
      </FormSection>
    </form>
  );
}

export default ChangePasswordForm;
