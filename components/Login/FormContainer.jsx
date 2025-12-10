"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoginFrom from "./LoginFrom";
import UsersContainer from "./UsersContainer";
import { login } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Link, redirect } from "@/i18n/navigation";
const validationSchema = Yup.object({
  // : Yup.string().required("username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required"),
  password: Yup.string().required("password is required"),
  // role: Yup.string().required("Required"),
});

function FormContainer() {
  const t = useTranslations("Login");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
        toast.success(t("Login successful"));
      } catch (error) {
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error(t("May be username or password is incorrect"));
        } else {
          toast.success(t("Login successful"));
        }
      }
    },
  });

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row items-center justify-between w-full relative">
      <div className="flex flex-col md:flex-row items-center gap-14">
        {/* <UsersContainer t={t} formik={formik} /> */}

        <h1 className="hidden md:block md:w-[400px] text-green-primary dark:text-white lg:w-[600px]  text-6xl font-bold z-10 ">
          {t("Sign In to Go to Dashboard")}
        </h1>
      </div>
      <LoginFrom t={t} formik={formik} />
    </div>
  );
}

export default FormContainer;
