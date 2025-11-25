"use client";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import UsersContainer from "../Login/UsersContainer";
import * as Yup from "yup";
import RegisterFrom from "./RegisterForm";
import { register } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { redirect } from "@/i18n/navigation";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("password is required"),
  // role: Yup.string().required("Required"),
});
function FormContainer() {
  const t = useTranslations("Register");
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      authorities: ["ROLE_ADMIN"],
      imageUrl: "",
      email: "",
      password: "",
      langKey: "username",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const registerData = { ...values, login: values.email };

        await register(registerData);
        toast.success(t("The Code is Send To Your Email"));
      } catch (error) {
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error(error.message);
        } else {
          toast.success(t("The Code is Send To Your Email"));
        }
      }
    },
  });
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row items-center justify-between w-full relative">
      <div className="flex flex-col md:flex-row items-center gap-14">
        <UsersContainer t={t} formik={formik} />
        <h1 className="hidden md:block md:w-[400px]  lg:w-[600px]  text-6xl font-bold z-10 ">
          {t("Register to Go to Dashboard")}
        </h1>
      </div>
      <RegisterFrom t={t} formik={formik} />
    </div>
  );
}

export default FormContainer;
