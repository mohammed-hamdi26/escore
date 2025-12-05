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
import ComboboxInput from "../ui app/ComboBoxInput";

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

  location: yup.string().required("location is required"),

  prizePool: yup
    .number()
    .min(0, "Prize pool must be positive")
    .required("Prize pool is required"),

  status: yup
    .string()
    .oneOf(["upcoming", "ongoing", "completed", "cancelled"], "Invalid status")
    .required("Status is required"),

  logoLight: yup
    .string()
    // .url("Invalid logo URL")
    .required("Logo is required"),

  gamesData: yup
    .array()
    .test("games", "Games is required", (value) => value.length > 0),
  // logoDark: yup
  //   .string()
  //   // .url("Invalid dark logo URL")
  //   .required("Dark logo is required"),

  knockoutImageLight: yup
    .string()
    // .url("Invalid knockout image URL")
    .required("Knockout image is required"),
  // knockoutImageDark: yup
  //   .string()
  //   // .url("Invalid dark knockout image URL")
  //   .required("Dark knockout image is required"),

  // winningPoints: yup
  //   .number()
  //   .min(0, "Winning points must be 0 or more")
  //   .required("Winning points are required"),

  // losingPoints: yup
  //   .number()
  //   .min(0, "Losing points must be 0 or more")
  //   .required("Losing points are required"),

  // drawPoints: yup
  //   .number()
  //   .min(0, "Draw points must be 0 or more")
  //   .required("Draw points are required"),

  // description: yup.string().required("Description is required"),
});

export default function TournamentsForm({
  tournament,
  submit,
  formType = "add",
  countries = [],
  gameOptions = [],
}) {
  const t = useTranslations("TournamentForm");

  const formik = useFormik({
    initialValues: {
      name: tournament?.name || "",
      organizer: tournament?.organizer || "",
      startDate: tournament?.startDate || "",
      endDate: tournament?.endDate || "",
      location: tournament?.location || "",
      prizePool: tournament?.prizePool || "",
      status: tournament?.status || "upcoming",
      logoLight: tournament?.logo.light || "",
      country: tournament?.country?.code || "",
      gamesData: tournament?.games || [],

      logoDark: tournament?.logo.dark || "",
      // winningPoints: tournament?.winningPoints || "",
      // losingPoints: tournament?.losingPoints || "",
      // drawPoints: tournament?.drawPoints || "",
      // description: tournament?.description || "",
      knockoutImageLight: tournament?.bracketImage?.light || "",
      knockoutImageDark: tournament?.bracketImage?.dark || "",
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = tournament ? { id: tournament.id, ...values } : values;
        const selectedCountry = countries.find(
          (c) => c.value === dataValues.country
        );

        dataValues.country = {
          name: selectedCountry?.label,
          code: selectedCountry?.value,
          flag: selectedCountry?.value,
        };

        dataValues.logo = {
          light: dataValues.logoLight,
          dark: dataValues.logoDark,
        };
        dataValues.bracketImage = {
          light: dataValues.knockoutImageLight,
          dark: dataValues.knockoutImageDark,
        };

        dataValues.slug = dataValues?.name.replace(/\s+/g, "-").toLowerCase();
        dataValues.games = dataValues?.gamesData.map((g) => g.id || g.value);

        console.log("dataValues", dataValues);

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
  console.log("formik errors", formik.errors);
  console.log("formik errors", formik.values);

  const statusOptions = [
    { value: "upcoming", label: t("Upcoming") },
    { value: "ongoing", label: t("Ongoing") },
    { value: "completed", label: t("Completed") },
    { value: "cancelled", label: t("Cancelled") },
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
            label={t("location")}
            name={"location"}
            type={"text"}
            placeholder={t("Enter Name of location")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.location && formik?.touched?.location
                ? formik?.errors?.location
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.location}
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
          <SelectInput
            name={"country"}
            label={t("Country")}
            formik={formik}
            options={mappedArrayToSelectOptions(countries, "label", "value")}
            onChange={(value) => {
              formik.setFieldValue("country", value);
            }}
            value={formik.values.country}
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
          <ComboboxInput
            formik={formik}
            label={t("Games")}
            name={"gamesData"}
            options={mappedArrayToSelectOptions(gameOptions, "name", "id")}
            placeholder={t("Select Game")}
            initialData={mappedArrayToSelectOptions(
              formik.values.gamesData,
              "name",
              "id"
            )}
          />
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
          {/* <InputApp
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
          /> */}
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <FileInput
            t={t}
            formik={formik}
            label={t("Logo")}
            name={"logoLight"}
            placeholder={t("Upload Tournament Logo")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={
              formik.touched.logoLight &&
              formik.errors.logoLight &&
              t(formik.errors.logoLight)
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
            error={
              formik.touched.logoDark &&
              formik.errors.logoDark &&
              t(formik.errors.logoDark)
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
            error={
              formik.touched.knockoutImageDark &&
              formik.errors.knockoutImageDark &&
              t(formik.errors.knockoutImageDark)
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
