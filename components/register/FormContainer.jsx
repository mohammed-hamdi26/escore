"use client";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import * as Yup from "yup";
import RegisterFrom from "./RegisterForm";
import { register } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/navigation";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    )
    .required("Password is required"),
});

function FormContainer() {
  const t = useTranslations("Register");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const result = await register(values);

      if (result.success) {
        toast.success(t("The Code is Send To Your Email"));
        // Store email for verification page
        if (typeof window !== "undefined") {
          sessionStorage.setItem("verifyEmail", values.email);
        }
        router.push("/register/code-verification");
      } else {
        toast.error(result.error || t("Registration failed"));
      }
    },
  });

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row items-center justify-between w-full relative">
      <div className="flex flex-col md:flex-row items-center gap-14">
        <h1 className="hidden md:block md:w-[400px] text-green-primary dark:text-white lg:w-[600px] text-6xl font-bold z-10">
          {t("Register to Go to Dashboard")}
        </h1>
      </div>
      <RegisterFrom t={t} formik={formik} />
    </div>
  );
}

export default FormContainer;
