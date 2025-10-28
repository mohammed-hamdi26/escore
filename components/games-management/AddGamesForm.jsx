"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import GamesManagement from "../icons/GamesManagement";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
const validationSchema = yup.object({
  game: yup.string().required("Required"),
});
function AddGamesForm() {
  const formik = useFormik({
    initialValues: {
      game: "",
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
            label={"Game"}
            name={"game"}
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
            error={formik.touched.game && formik.errors.game}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>
      <div className="flex justify-end">
        <Button
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default AddGamesForm;
