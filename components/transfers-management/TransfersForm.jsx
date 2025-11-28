"use client";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import * as Yup from "yup";
import FormSection from "../ui app/FormSection";
import SelectInputCombox from "../ui app/SelectInputCombox";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import SelectInput from "../ui app/SelectInput";
import DatePicker from "../ui app/DatePicker";
import MarkDown from "../ui app/MarkDown";
import FormRow from "../ui app/FormRow";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
const validationSchema = Yup.object({
  transferDate: Yup.date().required("Transfer date is required"),
  transferFee: Yup.number().required("Transfer fee is required"),
  player: Yup.object().required("Player is required"),
  fromTeam: Yup.string().required("From team is required"),
  toTeam: Yup.string().required("To team is required"),
});
function TransfersForm({ formType = "add" }) {
  const t = useTranslations("TransfersForm");
  const formik = useFormik({
    initialValues: {
      transferDate: "",
      transferFee: "",
      player: "",
      fromTeam: "",
      toTeam: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form values", values);
    },
  });

  console.log("formik values", formik.values);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <FormSection>
        <FormRow>
          <SelectInput
            name={"player"}
            label={t("player")}
            formik={formik}
            placeholder={t("selectPlayerPlaceholder")}
            options={mappedArrayToSelectOptions(
              [{ id: 1, name: "test" }],
              "name",
              "id"
            )}
            error={
              formik.touched.player &&
              formik.errors.player &&
              t(formik.errors.player)
            }
          />
          <DatePicker
            formik={formik}
            name="transferDate"
            label={t("transfer Date")}
            disabled={formik.isSubmitting}
            placeholder={t("selectDatePlaceholder")}
            disabledDate={{}}
          />
        </FormRow>
        <MarkDown
          formik={formik}
          placeholder={t("descriptionPlaceholder")}
          name="description"
          label={t("description")}
          error={
            formik.touched.description &&
            formik.errors.description &&
            t(formik.errors.description)
          }
        />
      </FormSection>
      <FormSection>
        <FormRow>
          <SelectInput
            name={"fromTeam"}
            label={t("from Team")}
            formik={formik}
            placeholder={t("selectFromTeamPlaceholder")}
            options={mappedArrayToSelectOptions(
              [{ id: 1, name: "team A" }],
              "name",
              "id"
            )}
          />
          <SelectInput
            name={"toTeam"}
            label={t("to Team")}
            formik={formik}
            placeholder={t("selectToTeamPlaceholder")}
            options={mappedArrayToSelectOptions(
              [{ id: 1, name: "team B" }],
              "name",
              "id"
            )}
          />
        </FormRow>
      </FormSection>

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
          ) : formType === "add" ? (
            t("Add Transfer")
          ) : (
            t("Edit Transfer")
          )}
        </Button>
      </div>
    </form>
  );
}

export default TransfersForm;
