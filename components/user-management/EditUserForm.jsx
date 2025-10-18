"use client";
import * as yup from "yup";
import { useFormik } from "formik";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import InputApp from "../ui app/InputApp";
import UserCardIcon from "../icons/UserCardIcon";
import EmailIcon from "../icons/EmailIcon";
import PasswordIcon from "../icons/PasswordIcon";
const validationSchema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup.string().required("Required"),
});
function EditUserForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
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
            placeholder={"Edit User Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
          />

          <InputApp
            onChange={formik.handleChange}
            label={"Email"}
            name={"email"}
            type={"email"}
            placeholder={"Edit Email"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <EmailIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.email && formik.errors.email}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <InputApp
            onChange={formik.handleChange}
            label={"Password"}
            name={"password"}
            type={"password"}
            placeholder={"Edit Password"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <PasswordIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.password && formik.errors.password}
            onBlur={formik.handleBlur}
          />
          <div className="flex-1"></div>
        </FormRow>
      </FormSection>
    </form>
  );
}

export default EditUserForm;
