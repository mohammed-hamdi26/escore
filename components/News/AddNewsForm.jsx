"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import Title from "../icons/Title";
import Writer from "../icons/Writer";
import DatePicker from "../ui app/DatePicker";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import TextAreaInput from "../ui app/TextAreaInput";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  writer: yup.string().required("Required"),
  description: yup.string().required("Required"),
  date: yup.string().required("Required"),
  //   image: yup.string().required("Required"),
  time: yup.string().required("Required"),
});
function AddNewsForm() {
  const initialValues = {
    title: "",
    writer: "",
    description: "",
    date: "",
    image: "",
    time: "",
  };
  const formik = useFormik({
    initialValues,
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
            name={"title"}
            onChange={formik.handleChange}
            label={"Title"}
            type={"text"}
            placeholder={"Enter Title"}
            className="border-0 focus:outline-none    "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Title color={"text-[#677185]"} />}
            error={formik.touched.title && formik.errors.title}
            onBlur={formik.handleBlur}
          />
          <InputApp
            name={"writer"}
            onChange={formik.handleChange}
            label={"Title"}
            type={"text"}
            placeholder={"Enter The Writer Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Writer color={"text-[#677185]"} />}
            error={formik.touched.writer && formik.errors.writer}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <TextAreaInput
            name={"description"}
            label={"Description"}
            placeholder={"Enter Description"}
            className="border-0 focus:outline-none "
            icon={
              <Description
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <DatePicker
            formik={formik}
            name={"date"}
            label={"Date"}
            type={"text"}
            placeholder={"Enter Description"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <Date className={"fill-[#677185]"} color={"text-[#677185]"} />
            }
          />
        </FormRow>
      </FormSection>
    </form>
  );
}

export default AddNewsForm;
