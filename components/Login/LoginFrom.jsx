"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import logoImage from "../../public/images/logo.png";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
import { Shield } from "lucide-react";

function LoginFrom({ formik, t }) {
  return (
    <div className="flex flex-[0.5] flex-col space-y-8 ">
      <div className="space-y-8 flex flex-col items-center justify-center ">
        <Image src={logoImage} alt="logo" width={250} height={40} />
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
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
        <Link
          className="text-gray-500 dark:text-[#C7C7C7] hover:text-green-primary dark:hover:text-[#C7C7C7]/90 text-end max-w-[400px] text-sm transition-colors"
          href="/forget-password"
        >
          {t("Forgot Password ?")}
        </Link>
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="max-w-[400px] font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t("Login")}
        </Button>

        {/* Register Link */}
        <div className="flex justify-center max-w-[400px]">
          <Link
            href="/register/form"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-primary transition-colors duration-300"
          >
            {t("Don't have an account?")}
          </Link>
        </div>

        {/* Privacy Policy Link */}
        <div className="flex justify-center max-w-[400px]">
          <Link
            href="/privacy-policy"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-primary transition-colors duration-300"
          >
            <Shield className="w-4 h-4" />
            {t("privacyPolicy")}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginFrom;
