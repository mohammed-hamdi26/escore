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
import { addAward } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";

const validationSchema = Yup.object({
  title: Yup.string().required("title is required"),
  image: Yup.string().required("image is required"),
  description: Yup.string().required("description is required"),
  achievedDate: Yup.date().required("achievedDate is required"),
});
const initialValues = {
  title: "",
  image: "",
  description: "",
  achievedDate: new Date(),
  player: null,
  team: null,
  game: null,
  tournament: null,
};
function AwardsForm({ awardsType, players, teams, games, tournaments, id, t }) {
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const awardsValues = {
        ...values,
        player: values.player ? { id: Number(values.player) } : null,
        team: values.team ? { id: Number(values.team) } : null,
        game: values.game ? { id: Number(values.game) } : null,
        tournament: values.tournament
          ? { id: Number(values.tournament) }
          : null,
      };

      try {
        await addAward(awardsValues);
        formik.resetForm();
        toast.success(t("Awards added successfully"));
      } catch (error) {
        toast.error(error.message);
      }
    },
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <FormRow gap="gap-4">
        <InputApp
          value={formik.values.title}
          formik={formik}
          label={t("title")}
          name="title"
          onChange={formik.handleChange}
          placeholder={t("titlePlaceholder")}
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
        name="image"
        typeFile="image"
        disabled={formik.isSubmitting}
        placeholder={t("imagePlaceholder")}
      />

      <FormRow gap="gap-4">
        <SelectInput
          formik={formik}
          label={t("game")}
          name={"game"}
          onChange={(value) => formik.setFieldValue("game", Number(value))}
          placeholder={"gamePlaceholder"}
          value={formik?.values?.game || null}
          error={formik.errors.game}
          options={mappedArrayToSelectOptions(games, "name", "id")}
        />
        <SelectInput
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
      </FormRow>

      <DatePicker
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
      />

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting ? <Spinner /> : t("Add Award")}
        </Button>
      </div>
    </form>
  );
}

export default AwardsForm;
