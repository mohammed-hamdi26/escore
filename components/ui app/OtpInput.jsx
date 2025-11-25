"use client";
import { useId } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useFormik } from "formik";
import { Button } from "../ui/button";

import * as Yup from "yup";
import toast from "react-hot-toast";
import { verifyAccount } from "@/app/[locale]/_Lib/actions";

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d+$/, "Code must contain only numbers")
    .length(6, "Code must be 6 numbers")
    .required("Code is required"),
});

function OtpInput() {
  const id = useId();

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await verifyAccount(values.otp);
        toast.success("Account verified successfully!");
      } catch (error) {
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error(error.message);
        } else {
          toast.success("Account verified successfully!");
        }
      }
    },
  });

  console.log(formik.errors);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-3 w-full">
      {/* <Label className={"text-background"} htmlFor={id}>
        Input OTP outlined
      </Label> */}
      <InputOTP
        value={formik.values.otp}
        onChange={(value) => formik.setFieldValue("otp", value)}
        onBlur={() => formik.setFieldTouched("otp", true)}
        className={"w-full"}
        id={id}
        maxLength={6}
      >
        <InputOTPGroup className="w-full flex justify-between  *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:bg-green-primary *:data-[slot=input-otp-slot]:text-white *:data-[slot=input-otp-slot]:mr-0">
          <InputOTPSlot
            disabled={formik.isSubmitting}
            className={"size-10"}
            index={0}
          />
          <InputOTPSlot
            disabled={formik.isSubmitting}
            index={1}
            className={"size-10"}
          />
          <InputOTPSlot
            disabled={formik.isSubmitting}
            index={2}
            className={"size-10"}
          />
          <InputOTPSlot
            disabled={formik.isSubmitting}
            index={3}
            className={"size-10"}
          />
          <InputOTPSlot
            disabled={formik.isSubmitting}
            index={4}
            className={"size-10"}
          />
          <InputOTPSlot
            disabled={formik.isSubmitting}
            index={5}
            className={"size-10"}
          />
        </InputOTPGroup>
      </InputOTP>
      {formik.touched.otp && formik.errors.otp && (
        <p className="text-sm text-destructive">{formik.errors.otp}</p>
      )}
      <Button
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
        className={
          "w-full bg-green-primary hover:bg-green-primary/70 text-white cursor-pointer font-bold rounded-[10px] text-lg py-5.5 mt-4"
        }
      >
        Verify{" "}
      </Button>
    </form>
  );
}

export default OtpInput;
