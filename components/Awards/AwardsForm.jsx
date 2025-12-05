"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import InputApp from "../ui app/InputApp";

import SelectInput from "../ui app/SelectInput";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { Button } from "../ui/button";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import DatePicker from "../ui app/DatePicker";
import TextAreaInput from "../ui app/TextAreaInput";
import { addAward, editAward } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";

const validationSchema = Yup.object({
  name: Yup.string().required("name is required"),
  imageLight: Yup.string().required("image is required"),
  // description: Yup.string().required("description is required"),
  // achievedDate: Yup.date().required("achievedDate is required"),
});
function AwardsForm({ awardsType, award, games, tournaments, id, t, setOpen }) {
  const formik = useFormik({
    initialValues: {
      name: award ? award.name : "",
      imageLight: award ? award.image.light : "",
      imageDark: award ? award.image.iconDark : "",
      // description: "",
      // achievedDate: new Date(),

      game: award ? award.game.id : "",
    },
    onSubmit: async (values) => {
      const awardsValues = award
        ? { id: award.id, ...values }
        : {
            ...values,
            image: {
              light: values.imageLight,
              iconDark: values.imageDark,
            },
          };
      console.log(awardsValues);
      try {
        if (award) {
          await editAward(awardsType, id, awardsValues);
        } else {
          await addAward(awardsType, id, awardsValues);
        }
        formik.resetForm();
        toast.success(
          award
            ? t("Awards updated successfully")
            : t("Awards added successfully")
        );
        setOpen(false);
      } catch (error) {
        toast.error(
          award ? t("Error in Awards updated") : t("Error in Awards added")
        );
      }
    },
    validationSchema,
  });

  console.log(games);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <FormRow gap="gap-4">
        <InputApp
          value={formik.values.name}
          formik={formik}
          label={t("name")}
          name="name"
          onChange={formik.handleChange}
          placeholder={t("namePlaceholder")}
          error={
            formik.touched.name && formik.errors.name && t(formik.errors.name)
          }
          disabled={formik.isSubmitting}
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        />
      </FormRow>
      <FileInput
        label={t("image")}
        formik={formik}
        name="imageLight"
        typeFile="image"
        disabled={formik.isSubmitting}
        placeholder={t("imagePlaceholder")}
      />

      <FormRow gap="gap-4">
        <SelectInput
          formik={formik}
          label={t("game")}
          name={"game"}
          onChange={(value) => {
            console.log(value);
            formik.setFieldValue("game", value);
          }}
          placeholder={"gamePlaceholder"}
          value={formik?.values?.game || null}
          error={formik.errors.game}
          options={mappedArrayToSelectOptions(games, "name", "id")}
        />
      </FormRow>
      {/* <SelectInput
          formik={formik}
          label={t("tournament")}
          name={"tournament"}
          onChange={(value) =>
            formik.setFieldValue("tournament", Number(value))
          }
          placeholder={t("tournamentPlaceholder")}
          value={formik?.values?.tournament || null}
          error={formik.errors.tournament}
          options={mappedArrayToSelectOptions(tournaments, "name", "id")}
        />
      </FormRow> */}

      {/* <DatePicker
        disabled={formik.isSubmitting}
        disabledDate={{}}
        formik={formik}
        name={"achievedDate"}
        placeholder={t("achievedDatePlaceholder")}
        label={t("achievedDate")}
      />

      <TextAreaInput
        name={"description"}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.description &&
          formik.errors.description &&
          t(formik.errors.description)
        }
        label={t("description")}
        className={
          "border-0 focus:outline-none bg-dashboard-box dark:bg-[#0F1017]"
        }
        placeholder={t("descriptionPlaceholder")}
        value={formik.values.description}
        disabled={formik.isSubmitting}
      /> */}

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : award ? (
            t("Edit Award")
          ) : (
            t("Add Award")
          )}
        </Button>
      </div>
    </form>
  );
}

export default AwardsForm;
