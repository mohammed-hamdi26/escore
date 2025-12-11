"use client";

import Image from "next/image";

import logoImage from "../../public/images/logo.png";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Link } from "@/i18n/navigation";
import { Shield } from "lucide-react";

function RegisterFrom({ formik, t }) {
  return (
    <div className="flex  flex-1 lg:flex-[0.7] max-w-[600px] flex-col space-y-8">
      <div className="space-y-8 flex flex-col items-center justify-center">
        <Image src={logoImage} alt="logo" width={250} height={40} />
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <InputApp
          t={t}
          name="firstName"
          placeholder={t("First name")}
          type="text"
          error={formik.touched.firstName && formik.errors.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className=""
        />
        <InputApp
          t={t}
          name="lastName"
          placeholder={t("Last name")}
          type="text"
          error={formik.touched.lastName && formik.errors.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className=""
        />
        <InputApp
          t={t}
          placeholder={t("Your Email")}
          name="email"
          type="email"
          error={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className=""
        />
        <InputApp
          t={t}
          placeholder={t("Password")}
          name="password"
          type="password"
          error={formik.touched.password && formik.errors.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className=""
        />
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className=" font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? <Spinner /> : t("Register")}
        </Button>

        {/* Login Link */}
        <div className="flex justify-center ">
          <Link
            href="/login"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-primary transition-colors duration-300"
          >
            {t("Already have an account?")}
          </Link>
        </div>

        {/* Privacy Policy Link */}
        <div className="flex justify-center ">
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

export default RegisterFrom;
