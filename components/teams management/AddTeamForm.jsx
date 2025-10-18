"use client";
import * as yup from "yup";
import { useFormik } from "formik";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import InputApp from "../ui app/InputApp";
import UserCardIcon from "../icons/UserCardIcon";
import CountryIcon from "../icons/CountryIcon";
import TeamsManagement from "../icons/TeamsManagement";
import { Button } from "../ui/button";

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  country: yup.string().required("Required"),
  logo: yup.string().required("Required"),
});

function AddTeamForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      country: "",
      logo: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <form className="space-y-8 " onSubmit={formik.handleSubmit}>
      <FormSection>
        <FormRow>
          <InputApp
            onChange={formik.handleChange}
            label={"Name"}
            name={"name"}
            type={"text"}
            placeholder={"Enter Team Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
          />

          <InputApp
            onChange={formik.handleChange}
            label={"country"}
            name={"country"}
            type={"text"}
            placeholder={"Enter Country Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <CountryIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.country && formik.errors.country}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <InputApp
            onChange={formik.handleChange}
            label={"logo"}
            name={"logo"}
            type={""}
            placeholder={"Upload Team Logo"}
            className="p-0 border-0 focus:outline-none  "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <TeamsManagement
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
          />
          <div className="flex-1"></div>
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

export default AddTeamForm;
