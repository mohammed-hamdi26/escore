"use client";

import Image from "next/image";

import logoImage from "../../public/images/logo.png";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
import FormRow from "../ui app/FormRow";
import FileInput from "../ui app/FileInput";
import { Spinner } from "../ui/spinner";
import { Link } from "@/i18n/navigation";
function RegisterFrom({ formik, t }) {
  return (
    <div className="flex flex-[1] flex-col space-y-8 ">
      <div className="space-y-8 flex flex-col items-center justify-center ">
        <Image src={logoImage} alt="logo" width={250} height={40} />
        <Link
          className="text-gray-400 hover:text-gray-400/90 hover:underline transition-all duration-300 text-center"
          href="/login"
        >
          {t("Already have an account?")}
        </Link>
      </div>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <FormRow>
          <InputApp
            t={t}
            name={"firstName"}
            placeholder={t("First name")}
            type="text"
            error={formik.touched.firstName && formik.errors.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="max-w-[400px]"
          />
          <InputApp
            t={t}
            name={"lastName"}
            placeholder={t("Last name")}
            type="text"
            error={formik.touched.lastName && formik.errors.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="max-w-[400px]"
          />
        </FormRow>
        <FormRow>
          <InputApp
            t={t}
            placeholder={t("Your Email")}
            name="email"
            type="email"
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
        </FormRow>
        <FormRow>
          <FileInput
            t={t}
            disabled={formik.isSubmitting}
            formik={formik}
            name="imageUrl"
            placeholder={t("Image")}
            // flexGrow="flex-[0.5]"

            inputAuth={true}
            // error={formik.touched.imageUrl && formik.errors.imageUrl}
          />
        </FormRow>
        {/* <Link
          className="text-[#C7C7C7] hover:text-[#C7C7C7]/90 text-end max-w-[400px]"
          href="/forgot-password"
        >
          {t("Forgot Password ?")}
        </Link> */}
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="max-w-[500px] font-bold text-lg text-white bg-green-primary cursor-pointer hover:bg-green-primary/80 rounded-[10px] p-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? <Spinner /> : t("Register")}
        </Button>
      </form>
    </div>
  );
}

export default RegisterFrom;
