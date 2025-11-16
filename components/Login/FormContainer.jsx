"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoginFrom from "./LoginFrom";
import UsersContainer from "./UsersContainer";
import { login } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
const validationSchema = Yup.object({
  username: Yup.string().required("username is required"),
  // email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("password is required"),
  // role: Yup.string().required("Required"),
});

function FormContainer() {
  const formik = useFormik({
    initialValues: {
      username: "",

      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.log(values);
      try {
        await login(values);
        toast.success("Login successful");
      } catch (error) {
        // // console.log(error);
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full relative">
      <div className="flex flex-col items-center gap-14">
        {/* <UsersContainer formik={formik} /> */}
        <h1 className="hidden md:block text-6xl font-bold z-10 ">
          Sign In to Go <br />
          to Dashboard
        </h1>
      </div>
      <LoginFrom formik={formik} />
    </div>
  );
}

export default FormContainer;
