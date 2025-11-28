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
const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string().required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});
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
        // Call your change password action here
        await changePassword(passwordValues);
        toast.success(t("Password changed successfully"));
        formik.resetForm();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });
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
