"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputApp from "../ui app/InputApp";

import SelectInput from "../ui app/SelectInput";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { Button } from "../ui/button";
import FileInput from "../ui app/FileInput";
import {
  addFavoriteCharacter,
  editFavoriteCharacter,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  game: Yup.string().required("Game Name is required"),
});
function FavoriteCharacterForm({
  id,
  character,

  games,
  favoriteCharacterFor = "players",
  t,
  setOpen,
}) {
  const formik = useFormik({
    initialValues: {
      name: character ? character.name : "",
      icon: character ? character.icon : "",
      game: character ? character.game.id : "",
    },
    onSubmit: async (values) => {
      const favoriteCharacterData = character
        ? { id: character.id, ...values }
        : values;

      try {
        if (character) {
          await editFavoriteCharacter(
            favoriteCharacterFor,
            id,
            favoriteCharacterData
          );
        } else {
          await addFavoriteCharacter(
            favoriteCharacterFor,
            id,
            favoriteCharacterData
          );
        }
        formik.resetForm();
        toast.success(
          character
            ? t("Favorite character updated successfully")
            : t("Favorite character added successfully")
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
        value={formik.values.name}
        onBlur={formik.handleBlur}
        label={t("Name")}
        name="name"
        onChange={formik.handleChange}
        placeholder={t("Name")}
        error={
          formik.touched.name && formik.errors.name && t(formik.errors.name)
        }
        disabled={formik.isSubmitting}
      />

      <FileInput
        value={formik.values.icon}
        label={t("Icon")}
        typeFile="image"
        placeholder={t("Icon")}
        formik={formik}
        name="icon"
        disabled={formik.isSubmitting}
        flexGrow="flex-1"
        error={
          formik.touched.icon && formik.errors.icon && t(formik.errors.icon)
        }
      />

      <SelectInput
        label={t("Game Name")}
        name={"game"}
        formik={formik}
        onChange={(value) => formik.setFieldValue("game", value)}
        placeholder={t("Game Name")}
        value={formik.values.game}
        error={formik.touched.player && formik.errors.player}
        options={mappedArrayToSelectOptions(games, "name", "id")}
        disabled={formik.isSubmitting}
      />
      {/* <SelectInput
        label="Player"
        name={favoriteCharacterFor === "player" ? "player" : "team"}
        onChange={(value) =>
          formik.setFieldValue(favoriteCharacterFor, Number(value))
        }
        placeholder={"Player"}
        value={formik.values.player}
        error={formik.touched.player && formik.errors.player}
        options={mappedArrayToSelectOptions(
          favoriteCharacterFor === "player" ? players : teams,
          favoriteCharacterFor === "player" ? "firstName" : "name",
          "id"
        )}
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
          {formik.isSubmitting ? <Spinner /> : t("Add Favorite Character")}
        </Button>
      </div>
    </form>
  );
}

export default FavoriteCharacterForm;
