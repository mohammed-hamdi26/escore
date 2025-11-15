"use client";

import { addLink } from "@/app/[locale]/_Lib/actions";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import FileInput from "../ui app/FileInput";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import { Button } from "../ui/button";
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().url().required("Icon is required"),
  url: Yup.string().url().required("URL is required"),
});
const initialValues = {
  name: "",
  icon: "",
  url: "",
  player: null,
  team: null,
};

function LinksForm({ players, teams, id, linksType = "player" }) {
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const linkData = values;
      linksType === "player"
        ? (linkData.player = { id: Number(id) })
        : (linkData.team = { id: Number(id) });
      try {
        await addLink(linkData);
        formik.resetForm();
        toast.success("Link added successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    validationSchema,
  });
  console.log(formik.errors);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <InputApp
        label="Name"
        name="name"
        onChange={formik.handleChange}
        placeholder={"Name"}
        error={formik.touched.name && formik.errors.name}
        disabled={formik.isSubmitting}
      />

      <FileInput
        formik={formik}
        name="icon"
        typeFile="icon"
        disabled={formik.isSubmitting}
        flexGrow="flex-0"
      />
      <InputApp
        label="URL"
        name="url"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={"URL"}
        error={
          formik?.errors?.url && formik?.touched?.url && formik?.errors?.url
        }
        disabled={formik.isSubmitting}
      />
      <SelectInput
        label="Player"
        name={linksType === "player" ? "player" : "team"}
        onChange={formik.handleChange}
        placeholder={"Player"}
        value={Number(id)}
        error={formik.touched.player && formik.errors.player}
        options={mappedArrayToSelectOptions(
          linksType === "player" ? players : teams,
          linksType === "player" ? "firstName" : "name",
          "id"
        )}
        disabled={true}
      />

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          Add Link
        </Button>
      </div>
    </form>
  );
}

export default LinksForm;
