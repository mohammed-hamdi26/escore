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

const validationSchema = Yup.object({
  title: Yup.string().required("title is required"),
  image: Yup.string().url().required("image is required"),
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
function AwardsForm({ awardsType, players, teams, games, tournaments, id }) {
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      console.log(values);
      const awardsValues = {
        ...values,
        player: values.player ? { id: Number(values.player) } : null,
        team: values.team ? { id: Number(values.team) } : null,
        game: values.game ? { id: Number(values.game) } : null,
        tournament: values.tournament
          ? { id: Number(values.tournament) }
          : null,
      };

      console.log(awardsValues);
      try {
        await addAward(awardsValues);
        formik.resetForm();
        toast.success("Awards added successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    validationSchema,
  });
  console.log(awardsType);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <FormRow gap="gap-4">
        <InputApp
          label="Title"
          name="title"
          onChange={formik.handleChange}
          placeholder={"Title"}
          error={formik.touched.name && formik.errors.name}
          disabled={formik.isSubmitting}
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        />
      </FormRow>
      <FileInput
        label={"Image"}
        formik={formik}
        name="image"
        typeFile="image"
        disabled={formik.isSubmitting}
        placeholder={"Image Link"}
      />
      <FormRow gap="gap-4">
        <SelectInput
          label="Player"
          name={"player"}
          onChange={(value) => formik.setFieldValue("player", Number(value))}
          placeholder={"Player"}
          value={awardsType === "player" ? Number(id) : formik.values.player}
          disabled={formik.isSubmitting || awardsType === "player"}
          error={formik.touched.player && formik.errors.player}
          options={mappedArrayToSelectOptions(players, "firstName", "id")}
        />
        <SelectInput
          label="team"
          name={"team"}
          onChange={(value) => formik.setFieldValue("team", Number(value))}
          placeholder={"team"}
          value={awardsType === "team" ? Number(id) : formik.values.team}
          error={formik.errors.team}
          disabled={formik.isSubmitting || awardsType === "team"}
          options={mappedArrayToSelectOptions(teams, "name", "id")}
        />
      </FormRow>
      <FormRow gap="gap-4">
        <SelectInput
          label="game"
          name={"game"}
          onChange={(value) => formik.setFieldValue("game", Number(value))}
          placeholder={"games"}
          value={formik.values.game}
          error={formik.errors.game}
          options={mappedArrayToSelectOptions(games, "name", "id")}
        />
        <SelectInput
          label="tournament"
          name={"tournament"}
          onChange={(value) =>
            formik.setFieldValue("tournament", Number(value))
          }
          placeholder={"tournament"}
          value={formik.values.tournament}
          error={formik.errors.tournament}
          options={mappedArrayToSelectOptions(tournaments, "name", "id")}
        />
      </FormRow>

      <DatePicker
        formik={formik}
        name={"achievedDate"}
        placeholder={"Date"}
        label={"Achieved Date"}
      />

      <TextAreaInput
        name={"description"}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && formik.errors.description}
        label={"Description"}
        className={
          "border-0 focus:outline-none bg-dashboard-box dark:bg-[#0F1017]"
        }
        placeholder={"Description"}
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
          Add Award
        </Button>
      </div>
    </form>
  );
}

export default AwardsForm;
