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
import InputApp from "../ui app/InputApp";
import toast from "react-hot-toast";
const validationSchema = Yup.object({
  transferDate: Yup.date().required("Transfer date is required"),
  fee: Yup.number().required("Transfer fee is required"),
  player: Yup.string().required("Player is required"),
  fromTeam: Yup.string().required("From team is required"),
  toTeam: Yup.string().required("To team is required"),
});
function TransfersForm({
  formType = "add",
  gamesOptions,
  playersOptions,
  teamsOptions,
  transfer,
  submit,
}) {
  const t = useTranslations("TransfersForm");
  const formik = useFormik({
    initialValues: {
      transferDate: transfer?.transferDate || "",
      fee: transfer?.fee || "",
      player: transfer?.player.id || "",
      fromTeam: transfer?.fromTeam?.id || "",
      toTeam: transfer?.toTeam?.id || "",
      description: transfer?.description || "",
      game: transfer?.game?.id || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const dataValues = transfer ? { id: transfer.id, ...values } : values;
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? "Transfer added successfully"
            : "Transfer updated successfully"
        );
      } catch (error) {
        toast.error("An error occurred");
      }
    },
  });

  console.log("formik values", formik.errors);
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
              playersOptions,
              "nickname",
              "id"
            )}
            error={
              formik.touched.player &&
              formik.errors.player &&
              t(formik.errors.player)
            }
            onChange={(formValue) => {
              formik.setFieldValue("player", formValue);
            }}
          />
          <SelectInput
            name={"game"}
            label={t("game")}
            formik={formik}
            placeholder={t("selectGamePlaceholder")}
            options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
            error={
              formik.touched.game && formik.errors.game && t(formik.errors.game)
            }
            onChange={(formValue) => {
              formik.setFieldValue("game", formValue);
            }}
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
          <InputApp
            name={"fee"}
            label={t("fee")}
            formik={formik}
            placeholder={t("feePlaceholder")}
            type={"number"}
            error={
              formik.touched.fee && formik.errors.fee && t(formik.errors.fee)
            }
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fee}
            t={t}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <SelectInput
            name={"fromTeam"}
            label={t("from Team")}
            formik={formik}
            placeholder={t("selectFromTeamPlaceholder")}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter((team) => team.id !== formik.values.toTeam),
              "name",
              "id"
            )}
            onChange={(value) => {
              formik.setFieldValue("fromTeam", value);
            }}
          />
          <SelectInput
            name={"toTeam"}
            label={t("to Team")}
            formik={formik}
            placeholder={t("selectToTeamPlaceholder")}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter((team) => team.id !== formik.values.fromTeam),
              "name",
              "id"
            )}
            onChange={(value) => {
              formik.setFieldValue("toTeam", value);
            }}
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
