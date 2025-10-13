"use client";
import Champion from "@/components/icons/Champion";
import GamesManagement from "@/components/icons/GamesManagement";
import TeamsManagement from "@/components/icons/TeamsManagement";
import { CalendarDays, Loader } from "lucide-react";

import FormRow from "@/components/ui app/FormRow";
import FormSection from "@/components/ui app/FormSection";
import InputApp from "@/components/ui app/InputApp";
import SelectInput from "@/components/ui app/SelectInput";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import DatePicker from "../ui app/DatePicker";
const validateSchema = Yup.object({
  champion: Yup.string().required("Required"),
  game: Yup.string().required("Required"),
  team1: Yup.string().required("Required"),
  team2: Yup.string().required("Required"),
  match_state: Yup.string().required("Required"),
});
function AddMatchesFrom() {
  const formik = useFormik({
    initialValues: {
      champion: "",
      game: "",
      team1: "",
      team2: "",
      match_state: "",
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 ">
      <FormSection>
        <InputApp
          onChange={formik.handleChange}
          label={"Champion"}
          name={"champion"}
          type={"text"}
          placeholder={"Write Champion Name"}
          className="border-0 focus:outline-none "
          backGroundColor={"bg-[#0F1017]"}
          textColor="text-[#677185]"
          icon={<Champion color={"text-[#677185]"} />}
          error={
            formik?.errors?.champion && formik?.touched?.champion
              ? formik.errors.champion
              : ""
          }
          onBlur={formik.handleBlur}
        />
        <InputApp
          label={"Game"}
          name={"game"}
          type={"text"}
          placeholder={"Write Game Name"}
          className="border-0 focus:outline-none "
          backGroundColor={"bg-[#0F1017]"}
          textColor="text-[#677185]"
          icon={
            <GamesManagement
              height="35"
              width="35"
              className={"fill-[#677185] "}
              color={"text-[#677185]"}
            />
          }
          error={
            formik?.errors?.game && formik?.touched?.game
              ? formik?.errors?.game
              : ""
          }
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <FormRow>
          <InputApp
            label={"Team 1"}
            name={"team1"}
            type={"text"}
            placeholder={"Write Team Name"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <TeamsManagement
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
            error={
              formik?.errors?.team1 && formik?.touched?.team1
                ? formik?.errors?.team1
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <InputApp
            label={"Team 2"}
            name={"team2"}
            type={"text"}
            placeholder={"Write Game Name"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <TeamsManagement
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
            error={
              formik?.errors?.team2 && formik?.touched?.team2
                ? formik?.errors?.team2
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <DatePicker formik={formik} label={"Match Date"} />
        </FormRow>
      </FormSection>
      <FormSection>
        <SelectInput
          name={"match_state"}
          icon={<Loader className="text-[#677185]" height={35} width={35} />}
          label={"Match State"}
          options={[
            { value: "ended", label: "ended" },
            { value: "upcoming", label: "upcoming" },
          ]}
          placeholder={"Select Match status ( ended - Upcoming )"}
          error={
            formik?.errors?.match_state && formik?.touched?.match_state
              ? formik?.errors?.match_state
              : ""
          }
          onBlur={(open) => {
            if (!open) formik.setFieldTouched("match_state", true);
          }}
          onChange={(value) => {
            formik.setFieldValue("match_state", value);
          }}
        />
      </FormSection>

      <Button
        className={
          " text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
        }
      >
        Submit
      </Button>
    </form>
  );
}

export default AddMatchesFrom;
