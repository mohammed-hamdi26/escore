"use client";
import { useFormik } from "formik";
import { TreePalm } from "lucide-react";
import toast from "react-hot-toast";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import ImageIcon from "../icons/ImageIcon";
import TeamsManagement from "../icons/TeamsManagement";
import UserCardIcon from "../icons/UserCardIcon";
import DatePicker from "../ui app/DatePicker";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import TextAreaInput from "../ui app/TextAreaInput";
import { Button } from "../ui/button";
import CountryIcon from "../icons/CountryIcon";
import { useTranslations } from "use-intl";

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  country: yup.string().required("Required"),
  region: yup.string().required("Required"),
  logo: yup.string().required("Required"),
  logoDark: yup.string().required("Required"),
  description: yup.string().required("Required"),
  foundedDate: yup.string().required("Required"),
});

function TeamFrom({
  team,
  submit,
  successMessage = "Team added successfully",
  countries,
  formType = "add",
}) {
  const t = useTranslations("TeamForm");
  const formik = useFormik({
    initialValues: {
      name: team?.name || "",
      country: team?.country || "",
      region: team?.region || "",
      logo: team?.logo || "",
      logoDark: team?.logoDark || "",
      description: team?.description || "",
      foundedDate: team?.foundedDate || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let dataValues = team ? { id: team.id, ...values } : values;
      console.log(dataValues);
      try {
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(successMessage);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });

  return (
    <form className="space-y-8 " onSubmit={formik.handleSubmit}>
      <FormSection>
        <FormRow>
          <InputApp
            value={formik?.values?.name}
            onChange={formik.handleChange}
            label={t("Name")}
            name={"name"}
            type={"text"}
            placeholder={t("Enter Team Name")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
          />

          <SelectInput
            value={formik?.values?.country}
            icon={
              <CountryIcon
                className="fill-[#677185]"
                color={"text-[#677185]"}
                height="44"
                width="44"
              />
            }
            options={countries?.countries || []}
            name={"country"}
            label={t("Country")}
            placeholder={t("Select Country")}
            error={formik.touched.country && formik.errors.country}
            // onBlur={formik.handleBlur}
            onChange={(value) => formik.setFieldValue("country", value)}
          />
          <InputApp
            value={formik?.values?.region}
            onChange={formik.handleChange}
            label={t("Region")}
            name={"region"}
            type={"text"}
            placeholder={t("Enter Region Name")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <TreePalm height="35" width="35" className="text-[#677185]" />
            }
            error={formik.touched.region && formik.errors.region}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <InputApp
            value={formik?.values?.logo}
            onChange={formik.handleChange}
            label={t("logo")}
            name={"logo"}
            type={""}
            placeholder={t("Upload Team Logo")}
            className="p-0 border-0 focus:outline-none  "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.logo && formik.errors.logo}
            onBlur={formik.handleBlur}
          />
          <InputApp
            value={formik?.values?.logoDark}
            onChange={formik.handleChange}
            label={t("logo (Dark)")}
            name={"logoDark"}
            type={""}
            placeholder={t("Upload Dark Team Logo")}
            className="p-0 border-0 focus:outline-none  "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.logoDark && formik.errors.logoDark}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <DatePicker
          value={formik?.values?.foundedDate}
          formik={formik}
          name={"foundedDate"}
          label={t("Founded Date")}
          type={"text"}
          placeholder={t("Select Founded Date")}
          className="border-0 focus:outline-none "
          icon={
            <Date
              height="35"
              width="35"
              className="text-[#677185] fill-[#677185]"
            />
          }
        />
        <TextAreaInput
          value={formik?.values?.description}
          name={"description"}
          label={t("Description")}
          placeholder={t("Enter Team Description")}
          className="border-0 focus:outline-none "
          icon={
            <Description
              className={"fill-[#677185]"}
              color={"text-[#677185]"}
            />
          }
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : ""
          }
          onBlur={() => {
            formik.setFieldTouched("description", true);
          }}
          onChange={(e) => {
            formik.setFieldValue("description", e.target.value);
          }}
        />
      </FormSection>
      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting
            ? "Submitting..."
            : formType === "add"
            ? "Submit"
            : "Edit"}
        </Button>
      </div>
    </form>
  );
}

export default TeamFrom;
