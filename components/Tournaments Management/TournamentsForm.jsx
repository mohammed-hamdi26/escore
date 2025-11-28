"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import InputApp from "../ui app/InputApp";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import { Button } from "../ui/button";
import TextAreaInput from "../ui app/TextAreaInput";
import DatePicker from "../ui app/DatePicker";
import Date from "../icons/Date";
import SelectInput from "../ui app/SelectInput";
import FileInput from "../ui app/FileInput";
import ImageIcon from "../icons/ImageIcon";
import toast from "react-hot-toast";
import { useTranslations } from "use-intl";
import MarkDown from "../ui app/MarkDown";
import { min } from "date-fns";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";

const validateSchema = yup.object({
  name: yup.string().required("Tournament name is required"),

  organizer: yup.string().required("Organizer is required"),

  startDate: yup
    .date()
    .typeError("Invalid start date")
    .required("Start date is required"),

  endDate: yup
    .date()
    .typeError("Invalid end date")
    // .min(yup.ref("startDate"), "End date cannot be before start date")
    .required("End date is required"),

  venue: yup.string().required("Venue is required"),

  prizePool: yup
    .number()
    .min(0, "Prize pool must be positive")
    .required("Prize pool is required"),

  status: yup
    .string()
    .oneOf(["UPCOMING", "ONGOING", "FINISHED"], "Invalid status")
    .required("Status is required"),

  logo: yup
    .string()
    // .url("Invalid logo URL")
    .required("Logo is required"),

  logoDark: yup
    .string()
    // .url("Invalid dark logo URL")
    .required("Dark logo is required"),

  knockoutImageLight: yup
    .string()
    // .url("Invalid knockout image URL")
    .required("Knockout image is required"),
  // knockoutImageDark: yup
  //   .string()
  //   // .url("Invalid dark knockout image URL")
  //   .required("Dark knockout image is required"),

  winningPoints: yup
    .number()
    .min(0, "Winning points must be 0 or more")
    .required("Winning points are required"),

  losingPoints: yup
    .number()
    .min(0, "Losing points must be 0 or more")
    .required("Losing points are required"),

  drawPoints: yup
    .number()
    .min(0, "Draw points must be 0 or more")
    .required("Draw points are required"),

  // description: yup.string().required("Description is required"),
});

export default function TournamentsForm({
  tournament,
  submit,
  formType = "add",
}) {
  const t = useTranslations("TournamentForm");
  const formik = useFormik({
    initialValues: {
      name: tournament?.name || "",
      organizer: tournament?.organizer || "",
      startDate: tournament?.startDate || "",
      endDate: tournament?.endDate || "",
      venue: tournament?.venue || "",
      prizePool: tournament?.prizePool || "",
      status: tournament?.status || "UPCOMING",
      logo: tournament?.logo || "",
      logoDark: tournament?.logoDark || "",
      winningPoints: tournament?.winningPoints || "",
      losingPoints: tournament?.losingPoints || "",
      drawPoints: tournament?.drawPoints || "",
      // description: tournament?.description || "",
      knockoutImageLight: tournament?.knockoutImageLight || "",
      knockoutImageDark: tournament?.knockoutImageDark || "",
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      let dataValues = tournament ? { id: tournament.id, ...values } : values;
      dataValues.country = null;

      try {
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? t("The Tournament Added")
            : t("The Tournament Edited")
        );
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  //

  const statusOptions = [
    { value: "UPCOMING", label: t("Upcoming") },
    { value: "ONGOING", label: t("Ongoing") },
    { value: "FINISHED", label: t("Finished") },
  ];
  console.log("formik errors", formik.values);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 ">
      <FormSection>
        <FormRow>
          <InputApp
            t={t}
            label={t("Name")}
            name={"name"}
            type={"text"}
            placeholder={t("Enter Name of Tournament")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.name && formik?.touched?.name
                ? formik?.errors?.name
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <InputApp
            t={t}
            label={t("Organizer")}
            name={"organizer"}
            type={"text"}
            placeholder={t("Enter Name of Organizer")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.organizer && formik?.touched?.organizer
                ? formik?.errors?.organizer
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.organizer}
          />
        </FormRow>
        <FormRow>
          <InputApp
            t={t}
            label={t("venue")}
            name={"venue"}
            type={"text"}
            placeholder={t("Enter Name of venue")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.venue && formik?.touched?.venue
                ? formik?.errors?.venue
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.venue}
          />
          <SelectInput
            formik={formik}
            options={mappedArrayToSelectOptions(
              statusOptions,
              "label",
              "value"
            )}
            onChange={(value) => formik.setFieldValue("status", value)}
            value={formik.values.status}
            label={t("Status")}
            name={"status"}
            placeholder={t("Select Status")}
            error={
              formik?.errors?.status && formik?.touched?.status
                ? formik?.errors?.status
                : ""
            }
            onBlur={() => formik.setFieldTouched("status", true)}
          />
        </FormRow>

        {/* <MarkDown
          label={t("Description")}
          formik={formik}
          name={"description"}
          placeholder={t("Enter Description")}
        /> */}
        {/* <TextAreaInput
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
          label={t("Description")}
          placeholder={t("Enter Description")}
          className="border-0 focus:outline-none"
          error={formik.touched.description && formik.errors.description}
          onBlur={formik.handleBlur}
          t={t}
        /> */}
      </FormSection>

      <FormSection>
        <FormRow>
          <DatePicker
            disabled={formik.isSubmitting}
            disabledDate={{}}
            t={t}
            placeholder={t("Enter Start Date")}
            formik={formik}
            label={t("Start Date")}
            name={"startDate"}
            icon={
              <Date
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
          />
          <DatePicker
            disabled={
              (formik.values.startDate ? false : true) || formik.isSubmitting
            }
            disabledDate={{ before: formik?.values?.startDate }}
            t={t}
            placeholder={t("Enter End Date")}
            formik={formik}
            label={t("End Date")}
            name={"endDate"}
            icon={
              <Date
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            label={t("Prize Pool")}
            name={"prizePool"}
            type={"number"}
            placeholder={t("Enter Prize Pool")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.prizePool && formik?.touched?.prizePool
                ? formik?.errors?.prizePool
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.prizePool}
            t={t}
          />
          <InputApp
            label={t("Winning Points")}
            name={"winningPoints"}
            type={"number"}
            placeholder={t("Enter Winning Points")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.winningPoints && formik?.touched?.winningPoints
                ? formik?.errors?.winningPoints
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.winningPoints}
            t={t}
          />
        </FormRow>
        <FormRow>
          <InputApp
            label={t("Losing Points")}
            name={"losingPoints"}
            type={"number"}
            placeholder={t("Enter Losing Points")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.losingPoints && formik?.touched?.losingPoints
                ? formik?.errors?.losingPoints
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.losingPoints}
            t={t}
          />
          <InputApp
            label={t("Draw Points")}
            name={"drawPoints"}
            type={"number"}
            placeholder={t("Enter Draw Points")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.drawPoints && formik?.touched?.drawPoints
                ? formik?.errors?.drawPoints
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.drawPoints}
            t={t}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <FileInput
            t={t}
            formik={formik}
            label={t("Logo")}
            name={"logo"}
            placeholder={t("Upload Tournament Logo")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={
              formik.touched.logo && formik.errors.logo && t(formik.errors.logo)
            }
          />
          <FileInput
            t={t}
            formik={formik}
            label={t("Logo (Dark)")}
            name={"logoDark"}
            placeholder={t("Upload Tournament Dark Logo")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
          />
        </FormRow>
        <FormRow>
          <FileInput
            t={t}
            formik={formik}
            label={t("knockout image")}
            name={"knockoutImageLight"}
            placeholder={t("Upload Knockout Light Image")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={
              formik.touched.knockoutImageLight &&
              formik.errors.knockoutImageLight &&
              t(formik.errors.knockoutImageLight)
            }
          />

          <FileInput
            t={t}
            formik={formik}
            label={t("knockout image (Dark)")}
            name={"knockoutImageDark"}
            placeholder={t("Upload Knockout Dark Image")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
          />
        </FormRow>
      </FormSection>

      <div className="flex justify-end">
        <Button
          disabled={!formik.isValid || formik.isSubmitting}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting
            ? formType === "add"
              ? "Adding..."
              : "Editing..."
            : formType === "add"
            ? t("Add")
            : t("Edit")}
        </Button>
      </div>
    </form>
  );
}
