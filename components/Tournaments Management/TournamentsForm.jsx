"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import Date from "../icons/Date";
import ImageIcon from "../icons/ImageIcon";
import DatePicker from "../ui app/DatePicker";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import TextAreaInput from "../ui app/TextAreaInput";
import { Button } from "../ui/button";

const validateSchema = yup.object({
  name: yup.string().required("Tournament name is required"),

  organizer: yup.string().required("Organizer is required"),

  startDate: yup
    .date()
    .typeError("Invalid start date")
    .required("Start date is required"),

  endDate: yup
    .date()
    // .typeError("Invalid end date")
    // .(yup.ref("startDate"), "End date cannot be before start date")
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

  logo: yup.string().url("Invalid logo URL").required("Logo is required"),

  logoDark: yup
    .string()
    .url("Invalid dark logo URL")
    .required("Dark logo is required"),

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

  description: yup.string().required("Description is required"),
});

export default function TournamentsForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      organizer: "",
      startDate: "",
      endDate: "",
      venue: "",
      prizePool: 0,
      status: "UPCOMING",
      logo: "",
      logoDark: "",
      winningPoints: 0,
      losingPoints: 0,
      drawPoints: 0,
      description: "",
    },
    validationSchema: validateSchema,
    onSubmit: values => {
      // console.log(values);
    },
  });

  // console.log(formik.errors);

  const statusOptions = [
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "FINISHED", label: "Finished" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 ">
      <FormSection>
        <FormRow>
          <InputApp
            label={"Name"}
            name={"name"}
            type={"text"}
            placeholder={"Enter Name of Tournament"}
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
            label={"Organizer"}
            name={"organizer"}
            type={"text"}
            placeholder={"Enter Name of Organizer"}
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
            label={"venue"}
            name={"venue"}
            type={"text"}
            placeholder={"Enter Name of venue"}
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
            options={statusOptions}
            onChange={value => formik.setFieldValue("status", value)}
            value={formik.values.status}
            label={"Status"}
            name={"status"}
            placeholder={"Select Status"}
            error={
              formik?.errors?.status && formik?.touched?.status
                ? formik?.errors?.status
                : ""
            }
            onBlur={() => formik.setFieldTouched("status", true)}
          />
        </FormRow>

        <TextAreaInput
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
          label={"Description"}
          placeholder={"Enter Description"}
          className="border-0 focus:outline-none"
          error={formik.touched.description && formik.errors.description}
          onBlur={formik.handleBlur}
        />
      </FormSection>

      <FormSection>
        <FormRow>
          <DatePicker
            placeholder={"Enter Start Date"}
            formik={formik}
            label={"Start Date"}
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
            placeholder={"Enter End Date"}
            formik={formik}
            label={"End Date"}
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
            label={"Prize Pool"}
            name={"prizePool"}
            type={"number"}
            placeholder={"Enter Prize Pool"}
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
          />
          <InputApp
            label={"Winning Points"}
            name={"winningPoints"}
            type={"number"}
            placeholder={"Enter Winning Points"}
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
          />
        </FormRow>
        <FormRow>
          <InputApp
            label={"Losing Points"}
            name={"losingPoints"}
            type={"number"}
            placeholder={"Enter Losing Points"}
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
          />
          <InputApp
            label={"Draw Points"}
            name={"drawPoints"}
            type={"number"}
            placeholder={"Enter Draw Points"}
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
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <FileInput
            formik={formik}
            label={"Logo"}
            name={"logo"}
            placeholder={"Upload Tournament Logo"}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
          />
          <FileInput
            formik={formik}
            label={"Logo (Dark)"}
            name={"logoDark"}
            placeholder={"Upload Tournament Dark Logo"}
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
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
