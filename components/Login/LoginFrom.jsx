"use client";

import Image from "next/image";
import Link from "next/link";
import logoImage from "../../public/images/logo.png";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
function LoginFrom({ formik, t }) {
  return (
    <div className="flex flex-[0.5] flex-col space-y-8 ">
      <div className="space-y-8 flex flex-col items-center justify-center ">
        <Image src={logoImage} alt="logo" width={250} height={40} />
        {/* <Link
          href="/register/form"
          className="text-gray-400 hover:text-gray-400/90 hover:underline transition-all duration-300"
        >
          {t("Don't have an account?")}
        </Link> */}
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        {/* <InputApp
          placeholder={"Your Email"}
          name="email"
          type="email"
          error={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          className="max-w-[400px]"
        /> */}
        <InputApp
          t={t}
          placeholder={t("email")}
          name="email"
          type="text"
          error={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="max-w-[400px]"
        />
        <InputApp
          t={t}
          placeholder={t("Password")}
          name="password"
          type="password"
          error={formik.touched.password && formik.errors.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="max-w-[400px]"
        />
        {/* <Link
          className="text-[#C7C7C7] hover:text-[#C7C7C7]/90 text-end max-w-[400px]"
          href="/forgot-password"
        >
          {t("Forgot Password ?")}
        </Link> */}
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="max-w-[400px] font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t("Login")}
        </Button>
      </form>
    </div>
  );
}

export default LoginFrom;
