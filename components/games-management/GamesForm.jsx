"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import GamesManagement from "../icons/GamesManagement";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
import Description from "../icons/Description";
import ImageIcon from "../icons/ImageIcon";
import News from "../icons/News";
import UserCardIcon from "../icons/UserCardIcon";

import toast from "react-hot-toast";
import ListInput from "../ui app/ListInput";
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  icon: yup.string().required("Icon is required"),
  iconDark: yup.string().required("Icon (Dark) is required"),
  description: yup.string().required("Description is required"),
  // players: yup.array().required("Players is required"),
  // news: yup.array().required("News is required"),
  // teams: yup.array().required("Teams is required"),
  // tournaments: yup.array().required("Tournaments is required"),
});
function GamesForm({
  data,
  submitFunction,
  successMessage,
  errorMessage,
  typeForm = "add",
}) {
  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      icon: data?.icon || "",
      iconDark: data?.iconDark || "",
      description: data?.description || "",
      players: data?.players || [],
      news: data?.news || [],
      teams: data?.teams || [],
      tournaments: data?.tournaments || [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let dataValues = data ? { id: data.id, ...values } : values;
      dataValues = {
        ...dataValues,
        players: dataValues.players.map((player) => {
          return { id: JSON.parse(player).value };
        }),
        news: dataValues.news.map((news) => {
          return { id: JSON.parse(news).value };
        }),
        teams: dataValues.teams.map((team) => {
          return { id: JSON.parse(team).value };
        }),
        tournaments: dataValues.tournaments.map((tournament) => {
          return { id: JSON.parse(tournament).value };
        }),
      };
      console.log(dataValues);
      try {
        const res = await submitFunction(dataValues);
        console.log(res);
        toast.success(successMessage);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <form className="space-y-8 " onSubmit={formik.handleSubmit}>
      <FormSection>
        <FormRow>
          <InputApp
            value={formik.values.name}
            onChange={formik.handleChange}
            label={"Game Name"}
            name={"name"}
            type={"text"}
            placeholder={"Enter Game Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <GamesManagement
                width="40"
                height="40"
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
          />
          <InputApp
            value={formik.values.description}
            onChange={formik.handleChange}
            label={"Description"}
            name={"description"}
            type={"text"}
            placeholder={"Enter Description"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <Description
                width="40"
                height="40"
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.description && formik.errors.description}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <InputApp
            value={formik.values.icon}
            onChange={formik.handleChange}
            label={"Icon"}
            name={"icon"}
            type={"text"}
            placeholder={"upload icon"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                width="40"
                height="40"
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.icon && formik.errors.icon}
            onBlur={formik.handleBlur}
          />
          <InputApp
            value={formik.values.iconDark}
            onChange={formik.handleChange}
            label={"Icon (dark)"}
            name={"iconDark"}
            type={"text"}
            placeholder={"upload icon (dark)"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                width="40"
                height="40"
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.iconDark && formik.errors.iconDark}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <ListInput
            label={"Players"}
            name={"players"}
            options={[
              { value: 1, name: "Player 1" },
              { value: 2, name: "Player 2" },
            ]}
            formik={formik}
            placeholder={"Players"}
          />
          <ListInput
            label={"Teams"}
            name={"teams"}
            options={[
              { value: 1, name: "Team 1" },
              { value: 2, name: "Team 2" },
            ]}
            formik={formik}
            placeholder={"Teams"}
          />
          <ListInput
            label={"Tournaments"}
            name={"tournaments"}
            options={[
              { value: 1, name: "Tournament 1" },
              { value: 2, name: "Tournament 2" },
            ]}
            formik={formik}
            placeholder={"Tournaments"}
          />
        </FormRow>
      </FormSection>
      <div className="flex justify-end">
        <Button
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {typeForm === "add" ? "Add" : "Edit"}
        </Button>
      </div>
    </form>
  );
}

export default GamesForm;
