"use client";
import { useFormik } from "formik";
import LoginFrom from "./LoginFrom";
import UsersContainer from "./UsersContainer";
import * as Yup from "yup";
const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  // email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
});

function FormContainer() {
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "admin",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        // await login(values);
        // toast.success("Login successful");
      } catch (error) {
        // console.log(error);
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="flex items-center gap-14">
        <UsersContainer formik={formik} />
        <h1 className="text-6xl font-bold z-10 ">
          Sign In to Go <br />
          to Dashboard
        </h1>
      </div>
      <LoginFrom formik={formik} />
    </div>
  );
}

export default FormContainer;
