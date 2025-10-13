"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import InputApp from "../ui app/InputApp";
import logoImage from "../../public/images/logo.png";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
function LoginFrom() {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className="flex flex-[0.5] flex-col ">
      <Image
        src={logoImage}
        alt="logo"
        width={250}
        height={40}
        className="mb-12"
      />
      <form className="flex flex-col gap-5">
        <InputApp
          placeholder={"Your Email"}
          name="email"
          type="email"
          onChange={formik.handleChange}
          className="max-w-[400px]"
        />
        <InputApp
          placeholder={"Password"}
          name="password"
          type="password"
          onChange={formik.handleChange}
          className="max-w-[400px]"
        />
        <Link
          className="text-[#C7C7C7] hover:text-[#C7C7C7]/90 text-end max-w-[400px]"
          href="/forgot-password"
        >
          Forgot Password ?
        </Link>
        <Button className="max-w-[400px] bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6">
          Sign In
        </Button>
      </form>
    </div>
  );
}

export default LoginFrom;
