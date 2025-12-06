"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import UserCardIcon from "../icons/UserCardIcon";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import toast from "react-hot-toast";
import { addUser } from "@/app/[locale]/_Lib/actions";
import { useTranslations } from "next-intl";
import {
  User,
  Phone,
  Shield,
  Gamepad2,
  Users,
  Trophy,
  Newspaper,
  ArrowRightLeft,
  BarChart3,
  Settings,
  HeadphonesIcon,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Save,
  UserPlus,
  CheckCircle,
  UserCog,
  Swords,
} from "lucide-react";

const validationSchema = yup.object({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
});

const roleOptions = [
  { value: "user", label: "User", color: "text-gray-400", icon: User },
  { value: "admin", label: "Admin", color: "text-red-400", icon: Shield },
  { value: "content", label: "Content Creator", color: "text-purple-400", icon: Newspaper },
  { value: "support", label: "Support", color: "text-cyan-400", icon: HeadphonesIcon },
];

function UserForm({
  formType = "add",
  submit = addUser,
  user,
  setRes,
  setOpen,
}) {
  const t = useTranslations("UserForm");

  const permissions = [
    { label: "Match", value: "AddMatchPermission", translationKey: "Match", icon: Swords, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
    { label: "Game", value: "AddGamePermission", translationKey: "Game", icon: Gamepad2, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { label: "Player", value: "AddPlayerPermission", translationKey: "Player", icon: User, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Team", value: "AddTeamPermission", translationKey: "Team", icon: Users, color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Tournament", value: "AddTournamentPermission", translationKey: "Tournament", icon: Trophy, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { label: "News", value: "AddNewsPermission", translationKey: "News", icon: Newspaper, color: "text-pink-500", bgColor: "bg-pink-500/10" },
    { label: "Transfer", value: "AddTransferPermission", translationKey: "Transfer", icon: ArrowRightLeft, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { label: "Standing", value: "AddStandingPermission", translationKey: "Standing", icon: BarChart3, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
    { label: "Settings", value: "AddSettingsPermission", translationKey: "Settings", icon: Settings, color: "text-gray-500", bgColor: "bg-gray-500/10" },
    { label: "Support", value: "AddSupportPermission", translationKey: "Support", icon: HeadphonesIcon, color: "text-red-500", bgColor: "bg-red-500/10" },
  ];

  const actions = [
    { label: "create", value: "create", icon: Plus, color: "text-green-500" },
    { label: "read", value: "read", icon: Eye, color: "text-blue-500" },
    { label: "update", value: "update", icon: Pencil, color: "text-yellow-500" },
    { label: "delete", value: "delete", icon: Trash2, color: "text-red-500" },
  ];

  // Build initial values for permissions from user data (edit mode)
  const getInitialPermissionValues = () => {
    const values = {};
    if (user?.permissions && Array.isArray(user.permissions)) {
      permissions.forEach((perm) => {
        const userPerm = user.permissions.find((p) => p.entity === perm.label);
        if (userPerm) {
          values[perm.value] = true;
          values["actions" + perm.value] = userPerm.actions || [];
        } else {
          values[perm.value] = false;
          values["actions" + perm.value] = [];
        }
      });
    } else {
      permissions.forEach((perm) => {
        values[perm.value] = false;
        values["actions" + perm.value] = [];
      });
    }
    return values;
  };

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      role: user?.role || "user",
      isVerified: user?.isVerified ?? true,
      ...getInitialPermissionValues(),
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = user ? { ...user, ...values } : { ...values };
        let permissionsUser = [];

        for (let i = 0; i < permissions.length; i++) {
          if (dataValues?.[permissions[i].value] === true) {
            const permissionsData = {
              entity: permissions[i].label,
              actions: dataValues?.["actions" + permissions[i].value] || [],
            };
            if (permissionsData.actions.length > 0) {
              permissionsUser.push(permissionsData);
            }
          }
        }

        dataValues = {
          ...dataValues,
          permissions: permissionsUser,
        };

        const res = await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? t("User added successfully")
            : t("User updated successfully")
        );
        setRes(res);
        setOpen(true);
      } catch (error) {
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error(t("An error occurred"));
        } else {
          toast.success(
            formType === "add"
              ? t("User added successfully")
              : t("User updated successfully")
          );
        }
      }
    },
  });

  const handlePermissionToggle = (permValue, checked) => {
    formik.setFieldValue(permValue, checked);
    if (!checked) {
      formik.setFieldValue("actions" + permValue, []);
    }
  };

  const handleActionToggle = (permValue, actionValue, checked) => {
    const currentActions = formik.values["actions" + permValue] || [];
    if (checked) {
      formik.setFieldValue("actions" + permValue, [...currentActions, actionValue]);
    } else {
      formik.setFieldValue(
        "actions" + permValue,
        currentActions.filter((a) => a !== actionValue)
      );
    }
  };

  const handleSelectAllActions = (permValue) => {
    const allActions = actions.map((a) => a.value);
    formik.setFieldValue("actions" + permValue, allActions);
  };

  const handleDeselectAllActions = (permValue) => {
    formik.setFieldValue("actions" + permValue, []);
  };

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* User Info Section */}
      <FormSection
        title={t("User Information")}
        icon={<User className="size-5" />}
      >
        <FormRow>
          <InputApp
            onChange={formik.handleChange}
            label={t("First Name")}
            name={"firstName"}
            type={"text"}
            placeholder={t("Enter first name")}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik.touched.firstName &&
              formik.errors.firstName &&
              t("First name is required")
            }
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            required
          />

          <InputApp
            onChange={formik.handleChange}
            label={t("Last Name")}
            name={"lastName"}
            type={"text"}
            placeholder={t("Enter last name")}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<User className="size-5 text-[#677185]" />}
            error={
              formik.touched.lastName &&
              formik.errors.lastName &&
              t("Last name is required")
            }
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            required
          />
        </FormRow>
        {formType === "edit" && (
          <FormRow>
            <InputApp
              onChange={formik.handleChange}
              label={t("Phone")}
              name={"phone"}
              type={"text"}
              placeholder={t("Enter phone")}
              className="border-0 focus:outline-none"
              backGroundColor={"bg-dashboard-box dark:bg-[#0F1017]"}
              textColor="text-[#677185]"
              icon={<Phone className="size-5 text-[#677185]" />}
              error={formik.touched.phone && formik.errors.phone}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
          </FormRow>
        )}
      </FormSection>

      {/* Role & Status Section - Only in edit mode */}
      {formType === "edit" && (
        <FormSection
          title={t("Role & Status")}
          icon={<UserCog className="size-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-[#677185] text-sm">{t("Role")}</Label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => {
                  const RoleIcon = option.icon;
                  const isSelected = formik.values.role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => formik.setFieldValue("role", option.value)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-[#1a1f2e] bg-[#0F1017] hover:border-gray-600"
                      }`}
                    >
                      <RoleIcon className={`size-5 ${option.color}`} />
                      <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#677185]"}`}>
                        {t(option.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Status */}
            <div className="space-y-3">
              <Label className="text-[#677185] text-sm">{t("Verification Status")}</Label>
              <div
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  formik.values.isVerified
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-yellow-500/50 bg-yellow-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className={`size-6 ${
                      formik.values.isVerified ? "text-green-500" : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <p className="text-white font-medium">
                      {formik.values.isVerified ? t("Verified") : t("Unverified")}
                    </p>
                    <p className="text-xs text-[#677185]">
                      {formik.values.isVerified
                        ? t("Email has been verified")
                        : t("Email not verified yet")}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formik.values.isVerified}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isVerified", checked)
                  }
                />
              </div>
            </div>
          </div>
        </FormSection>
      )}

      {/* Permissions Section */}
      <FormSection
        title={t("Permissions")}
        icon={<Shield className="size-5" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((item) => {
            const IconComponent = item.icon;
            const isEnabled = formik.values[item.value] === true;
            const selectedActions = formik.values["actions" + item.value] || [];

            return (
              <div
                key={item.value}
                className={`rounded-xl border-2 transition-all duration-200 ${
                  isEnabled
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-[#1a1f2e] bg-[#0F1017]"
                }`}
              >
                {/* Permission Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <IconComponent className={`size-5 ${item.color}`} />
                    </div>
                    <div>
                      <Label className="text-white font-medium cursor-pointer">
                        {t(item.translationKey)}
                      </Label>
                      <p className="text-xs text-[#677185]">
                        {isEnabled
                          ? `${selectedActions.length} ${t("actions selected")}`
                          : t("Disabled")}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      handlePermissionToggle(item.value, checked)
                    }
                  />
                </div>

                {/* Actions */}
                {isEnabled && (
                  <div className="px-4 pb-4 border-t border-[#1a1f2e] pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-[#677185] uppercase tracking-wide">
                        {t("Actions")}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllActions(item.value)}
                          className="text-xs text-green-500 hover:text-green-400 transition-colors"
                        >
                          {t("All")}
                        </button>
                        <span className="text-[#677185]">|</span>
                        <button
                          type="button"
                          onClick={() => handleDeselectAllActions(item.value)}
                          className="text-xs text-red-500 hover:text-red-400 transition-colors"
                        >
                          {t("None")}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {actions.map((action) => {
                        const ActionIcon = action.icon;
                        const isChecked = selectedActions.includes(action.value);

                        return (
                          <label
                            key={action.value}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                              isChecked
                                ? "bg-[#1a1f2e] border border-[#2a2f3e]"
                                : "hover:bg-[#1a1f2e]/50"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleActionToggle(item.value, action.value, checked)
                              }
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                            <ActionIcon className={`size-3.5 ${action.color}`} />
                            <span className="text-sm text-white capitalize">
                              {t(action.label)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-green-primary hover:bg-green-primary/80 text-white min-w-[140px] disabled:opacity-50"
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            <>
              <UserPlus className="size-4 mr-2" />
              {t("Submit")}
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              {t("Edit")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
