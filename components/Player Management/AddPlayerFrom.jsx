"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import AgeIcon from "../icons/AgeIcon";
import CountryIcon from "../icons/CountryIcon";
import GamesManagement from "../icons/GamesManagement";
import Player from "../icons/Player";
import TeamsManagement from "../icons/TeamsManagement";
import UserCardIcon from "../icons/UserCardIcon";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import { Button } from "../ui/button";

const validateSchema = Yup.object({
  name: Yup.string().required("Required"),
  age: Yup.number().moreThan(0).required("Required"),
  country: Yup.string().required("Required"),
  team: Yup.string().required("Required"),
  game: Yup.string().required("Required"),
  player_picture: Yup.string().required("Required"),
});

function AddPlayerFrom() {
  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      country: "",
      team: "",
      game: "",
      player_picture: "",
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 ">
      <FormSection>
        <FormRow>
          <InputApp
            onChange={formik.handleChange}
            label={"Name"}
            name={"name"}
            type={"text"}
            placeholder={"Enter Player Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.name && formik?.touched?.name
                ? formik.errors.name
                : ""
            }
            onBlur={formik.handleBlur}
          />
          <InputApp
            onChange={formik.handleChange}
            label={"Age"}
            name={"age"}
            type={"text"}
            placeholder={"Enter Player Age"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <AgeIcon className="fill-[#677185]" color={"text-[#677185]"} />
            }
            error={
              formik?.errors?.age && formik?.touched?.age
                ? formik.errors.age
                : ""
            }
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <SelectInput
            options={[]}
            name={"country"}
            label={"Country"}
            placeholder={"Select Country"}
            icon={
              <CountryIcon
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
          />
          <SelectInput
            options={[]}
            name={"team"}
            label={"Team"}
            placeholder={"Select Team Player Belong To"}
            icon={
              <TeamsManagement
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <SelectInput
            options={[]}
            name={"game"}
            label={"game"}
            placeholder={"Select Game"}
            icon={
              <GamesManagement
                width="40"
                height="40"
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
          />
          <InputApp
            name={"player_picture"}
            label={"Player Picture"}
            placeholder={"Select Team Player Belong To"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <Player
                width="40"
                height="40"
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
            error={
              formik?.errors?.player_picture && formik?.touched?.player_picture
                ? formik.errors.player_picture
                : ""
            }
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <div className="flex justify-end">
        <Button
          type="submit"
          className={
            " text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default AddPlayerFrom;
