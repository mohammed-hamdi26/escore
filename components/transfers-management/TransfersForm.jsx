"use client";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import * as Yup from "yup";
import FormSection from "../ui app/FormSection";
import SelectInput from "../ui app/SelectInput";
import DatePicker from "../ui app/DatePicker";
import FormRow from "../ui app/FormRow";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import InputApp from "../ui app/InputApp";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import toast from "react-hot-toast";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "SAR", label: "SAR" },
  { value: "AED", label: "AED" },
];

function TransfersForm({
  formType = "add",
  gamesOptions = [],
  playersOptions = [],
  teamsOptions = [],
  transfer,
  submit,
}) {
  const t = useTranslations("TransfersManagement");
  const router = useRouter();

  const validationSchema = Yup.object({
    player: Yup.string().required(t("Player is required")),
    fromTeam: Yup.string().nullable(),
    toTeam: Yup.string().nullable(),
    fee: Yup.number().min(0, t("Fee must be positive")).nullable(),
    contractLength: Yup.number()
      .min(1, t("Contract length must be at least 1 month"))
      .max(120, t("Contract length cannot exceed 120 months"))
      .nullable(),
  }).test(
    "at-least-one-team",
    t("At least one team (From or To) is required"),
    function (values) {
      return values.fromTeam || values.toTeam;
    }
  );

  const formik = useFormik({
    initialValues: {
      player: transfer?.player?.id || transfer?.player?._id || "",
      game: transfer?.game?.id || transfer?.game?._id || "",
      fromTeam: transfer?.fromTeam?.id || transfer?.fromTeam?._id || "",
      toTeam: transfer?.toTeam?.id || transfer?.toTeam?._id || "",
      fee: transfer?.fee || "",
      currency: transfer?.currency || "USD",
      contractLength: transfer?.contractLength || "",
      transferDate: transfer?.transferDate
        ? transfer.transferDate.split("T")[0]
        : "",
      source: transfer?.source || "",
      notes: transfer?.notes || "",
      isFeatured: transfer?.isFeatured || false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Clean up data
        const dataValues = {
          ...values,
          fee: values.fee ? Number(values.fee) : undefined,
          contractLength: values.contractLength
            ? Number(values.contractLength)
            : undefined,
          fromTeam: values.fromTeam || undefined,
          toTeam: values.toTeam || undefined,
          game: values.game || undefined,
          transferDate: values.transferDate || undefined,
          source: values.source || undefined,
          notes: values.notes || undefined,
        };

        if (transfer) {
          dataValues.id = transfer.id || transfer._id;
        }

        const result = await submit(dataValues);

        if (result?.success) {
          toast.success(
            formType === "add"
              ? t("Transfer added successfully")
              : t("Transfer updated successfully")
          );
          if (formType === "add") {
            formik.resetForm();
            router.push("/dashboard/transfers-management/edit");
          }
        } else {
          toast.error(result?.error || t("An error occurred"));
        }
      } catch (error) {
        toast.error(t("An error occurred"));
      }
    },
  });

  // Auto-set fromTeam when player is selected
  const handlePlayerChange = (playerId) => {
    formik.setFieldValue("player", playerId);
    const player = playersOptions.find(
      (p) => p.id === playerId || p._id === playerId
    );
    if (player?.team) {
      formik.setFieldValue(
        "fromTeam",
        player.team.id || player.team._id || player.team
      );
    }
    if (player?.game) {
      formik.setFieldValue(
        "game",
        player.game.id || player.game._id || player.game
      );
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <FormSection title={t("Basic Information")}>
        <FormRow>
          <SelectInput
            name="player"
            label={t("Player")}
            formik={formik}
            placeholder={t("Select Player")}
            options={mappedArrayToSelectOptions(
              playersOptions,
              "nickname",
              "id"
            )}
            error={formik.touched.player && formik.errors.player}
            onChange={handlePlayerChange}
            required
          />
          <SelectInput
            name="game"
            label={t("Game")}
            formik={formik}
            placeholder={t("Select Game")}
            options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
            error={formik.touched.game && formik.errors.game}
            onChange={(value) => formik.setFieldValue("game", value)}
          />
        </FormRow>
      </FormSection>

      {/* Teams */}
      <FormSection title={t("Teams")}>
        <FormRow>
          <SelectInput
            name="fromTeam"
            label={t("From Team")}
            formik={formik}
            placeholder={t("Select From Team")}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter(
                (team) => (team.id || team._id) !== formik.values.toTeam
              ),
              "name",
              "id"
            )}
            error={formik.touched.fromTeam && formik.errors.fromTeam}
            onChange={(value) => formik.setFieldValue("fromTeam", value)}
          />
          <SelectInput
            name="toTeam"
            label={t("To Team")}
            formik={formik}
            placeholder={t("Select To Team")}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter(
                (team) => (team.id || team._id) !== formik.values.fromTeam
              ),
              "name",
              "id"
            )}
            error={formik.touched.toTeam && formik.errors.toTeam}
            onChange={(value) => formik.setFieldValue("toTeam", value)}
          />
        </FormRow>
        {formik.errors["at-least-one-team"] && (
          <p className="text-red-500 text-sm mt-2">
            {t("At least one team (From or To) is required")}
          </p>
        )}
      </FormSection>

      {/* Financial Details */}
      <FormSection title={t("Financial Details")}>
        <FormRow>
          <InputApp
            name="fee"
            label={t("Transfer Fee")}
            formik={formik}
            placeholder={t("Enter Fee")}
            type="number"
            error={formik.touched.fee && formik.errors.fee}
            className="border-0 focus:outline-none"
            backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
            textColor="text-[#677185]"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fee}
          />
          <SelectInput
            name="currency"
            label={t("Currency")}
            formik={formik}
            placeholder={t("Select Currency")}
            options={CURRENCY_OPTIONS}
            onChange={(value) => formik.setFieldValue("currency", value)}
          />
          <InputApp
            name="contractLength"
            label={t("Contract Length (months)")}
            formik={formik}
            placeholder={t("Enter Contract Length")}
            type="number"
            error={
              formik.touched.contractLength && formik.errors.contractLength
            }
            className="border-0 focus:outline-none"
            backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
            textColor="text-[#677185]"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contractLength}
          />
        </FormRow>
      </FormSection>

      {/* Dates */}
      <FormSection title={t("Dates")}>
        <FormRow>
          <DatePicker
            formik={formik}
            name="transferDate"
            label={t("Transfer Date")}
            disabled={formik.isSubmitting}
            placeholder={t("Select Transfer Date")}
          />
        </FormRow>
      </FormSection>

      {/* Additional Information */}
      <FormSection title={t("Additional Information")}>
        <FormRow>
          <InputApp
            name="source"
            label={t("Source")}
            formik={formik}
            placeholder={t("enterSource")}
            className="border-0 focus:outline-none"
            backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
            textColor="text-[#677185]"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.source}
          />
        </FormRow>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Notes")}
          </Label>
          <Textarea
            name="notes"
            placeholder={t("enterNotes")}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            className="min-h-[100px] bg-dashboard-box dark:bg-[#0F1017] border-0"
          />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <Switch
            id="isFeatured"
            checked={formik.values.isFeatured}
            onCheckedChange={(checked) =>
              formik.setFieldValue("isFeatured", checked)
            }
            disabled={formik.isSubmitting}
          />
          <Label
            htmlFor="isFeatured"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("Featured Transfer")}
          </Label>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          className={"text-black dark:text-white"}
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={formik.isSubmitting}
        >
          {t("Cancel")}
        </Button>
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="text-white text-center min-w-[120px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            t("Add Transfer")
          ) : (
            t("Save Changes")
          )}
        </Button>
      </div>
    </form>
  );
}

export default TransfersForm;
