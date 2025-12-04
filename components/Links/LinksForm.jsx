"use client";

import { addLink, editLinks, updateLink } from "@/app/[locale]/_Lib/actions";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import FileInput from "../ui app/FileInput";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/spinner";
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  url: Yup.string().url().required("URL is required"),
});

function LinksForm({
  players,
  teams,
  id,
  linksType = "players",
  link,
  setOpen,
}) {
  console.log(setOpen);
  const t = useTranslations("Links");

  const formik = useFormik({
    initialValues: {
      name: link?.name || "",
      icon: link?.image?.light || "",
      iconDark: link?.image?.iconDark || "",
      url: link?.url || "",
    },
    onSubmit: async (values) => {
      const linkData = link ? { id: link.id, ...values } : values;
      linkData.image = { light: values.icon, iconDark: values.iconDark };
      try {
        linksType === "players"
          ? await editLinks("players", id, linkData)
          : await editLinks("teams", id, linkData);
        !link && formik.resetForm();
        toast.success(
          link ? t("Link updated successfully") : t("Link added successfully")
        );
        setOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <InputApp
        label={t("Name")}
        name="name"
        onChange={formik.handleChange}
        placeholder={t("Name")}
        error={formik.touched.name && formik.errors.name}
        disabled={formik.isSubmitting}
        className={`p-0 border-0 focus:outline-none `}
        backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
        textColor="text-[#677185]"
        value={formik.values.name}
      />

      <FileInput
        formik={formik}
        name="icon"
        // typeFile="icon"
        disabled={formik.isSubmitting}
        flexGrow="flex-1"
        placeholder={t("URL Icon")}
        label={t("Icon")}
      />
      <InputApp
        label={t("URL")}
        name="url"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={t("URL Link")}
        error={
          formik?.errors?.url && formik?.touched?.url && t(formik?.errors?.url)
        }
        disabled={formik.isSubmitting}
        className={`p-0 border-0 focus:outline-none `}
        backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
        textColor="text-[#677185]"
        value={formik.values.url}
      />

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
          ) : link ? (
            t("Update Link")
          ) : (
            t("Add Link")
          )}
        </Button>
      </div>
    </form>
  );
}

export default LinksForm;
