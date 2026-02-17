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
  Lock,
  Sparkles,
  Zap,
  Crown,
  BookOpen,
  RotateCcw,
  Wand2,
  Building2,
  CalendarDays,
  CircleUserRound,
} from "lucide-react";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, "First name can only contain letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, "Last name can only contain letters"),
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
    { label: "Club", value: "AddClubPermission", translationKey: "Club", icon: Building2, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Event", value: "AddEventPermission", translationKey: "Event", icon: CalendarDays, color: "text-violet-500", bgColor: "bg-violet-500/10" },
    { label: "User", value: "AddUserPermission", translationKey: "User", icon: UserCog, color: "text-slate-500", bgColor: "bg-slate-500/10" },
    { label: "Avatar", value: "AddAvatarPermission", translationKey: "Avatar", icon: CircleUserRound, color: "text-teal-500", bgColor: "bg-teal-500/10" },
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

  const [permissionError, setPermissionError] = useState("");

  // Check if at least one permission is selected
  const hasAnyPermission = (values) => {
    return permissions.some((perm) => values[perm.value] === true);
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
      // Validate permissions for add mode
      if (formType === "add" && !hasAnyPermission(values)) {
        setPermissionError(t("At least one permission must be selected"));
        toast.error(t("At least one permission must be selected"));
        return;
      }
      setPermissionError("");

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
    if (checked) {
      // Auto-enable "read" when permission is enabled
      formik.setFieldValue("actions" + permValue, ["read"]);
      // Clear permission error when user selects a permission
      setPermissionError("");
    } else {
      formik.setFieldValue("actions" + permValue, []);
    }
  };

  const handleActionToggle = (permValue, actionValue, checked) => {
    // Prevent disabling "read" action - it's mandatory
    if (actionValue === "read" && !checked) {
      return;
    }

    const currentActions = formik.values["actions" + permValue] || [];
    if (checked) {
      // Always ensure "read" is included
      const newActions = [...currentActions, actionValue];
      if (!newActions.includes("read")) {
        newActions.push("read");
      }
      formik.setFieldValue("actions" + permValue, newActions);
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
    // Keep "read" as it's mandatory
    formik.setFieldValue("actions" + permValue, ["read"]);
  };

  // Quick Actions handlers
  const handleFullAccess = () => {
    setPermissionError("");
    permissions.forEach((perm) => {
      formik.setFieldValue(perm.value, true);
      formik.setFieldValue("actions" + perm.value, ["create", "read", "update", "delete"]);
    });
  };

  const handleReadOnlyAccess = () => {
    setPermissionError("");
    permissions.forEach((perm) => {
      formik.setFieldValue(perm.value, true);
      formik.setFieldValue("actions" + perm.value, ["read"]);
    });
  };

  const handleContentCreatorAccess = () => {
    setPermissionError("");
    // Content creator preset: News, Match, Player, Team, Tournament, Transfer, Game, Standing, Club, Event with create/read/update
    const contentPerms = ["AddNewsPermission", "AddMatchPermission", "AddPlayerPermission", "AddTeamPermission", "AddTournamentPermission", "AddTransferPermission", "AddGamePermission", "AddStandingPermission", "AddClubPermission", "AddEventPermission"];
    permissions.forEach((perm) => {
      if (contentPerms.includes(perm.value)) {
        formik.setFieldValue(perm.value, true);
        formik.setFieldValue("actions" + perm.value, ["create", "read", "update"]);
      } else {
        formik.setFieldValue(perm.value, false);
        formik.setFieldValue("actions" + perm.value, []);
      }
    });
  };

  const handleSupportAccess = () => {
    setPermissionError("");
    // Support preset: Settings and Support with all actions
    const supportPerms = ["AddSettingsPermission", "AddSupportPermission"];
    permissions.forEach((perm) => {
      if (supportPerms.includes(perm.value)) {
        formik.setFieldValue(perm.value, true);
        formik.setFieldValue("actions" + perm.value, ["create", "read", "update", "delete"]);
      } else {
        formik.setFieldValue(perm.value, false);
        formik.setFieldValue("actions" + perm.value, []);
      }
    });
  };

  const handleClearAllPermissions = () => {
    permissions.forEach((perm) => {
      formik.setFieldValue(perm.value, false);
      formik.setFieldValue("actions" + perm.value, []);
    });
  };

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* User Info Section */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
        {/* Header with gradient accent */}
        <div className="relative px-6 py-5 border-b border-gray-200 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-primary/5 via-transparent to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-green-primary to-green-primary/70 flex items-center justify-center shadow-lg shadow-green-primary/20">
              <User className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("User Information")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("Basic details about the user")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar Preview */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-white/5">
            <div className="relative group">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 flex items-center justify-center ring-4 ring-gray-100 dark:ring-white/10 transition-all group-hover:ring-green-primary/30">
                <span className="text-green-primary font-bold text-2xl uppercase">
                  {formik.values.firstName?.[0] || formik.values.lastName?.[0] || "?"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white dark:ring-[#0f1118]">
                <UserPlus className="size-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formik.values.firstName || formik.values.lastName
                  ? `${formik.values.firstName} ${formik.values.lastName}`.trim()
                  : t("New User")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("Preview of user profile")}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("First Name")}
                  <span className="text-red-500">*</span>
                </Label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "ring-2 ring-red-500/50"
                    : "focus-within:ring-2 focus-within:ring-green-primary/50"
                }`}>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t("Enter first name")}
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-colors"
                  />
                </div>
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500">
                    <span className="size-1.5 rounded-full bg-red-500" />
                    {t("First name is required")}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Last Name")}
                  <span className="text-red-500">*</span>
                </Label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "ring-2 ring-red-500/50"
                    : "focus-within:ring-2 focus-within:ring-green-primary/50"
                }`}>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t("Enter last name")}
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-colors"
                  />
                </div>
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500">
                    <span className="size-1.5 rounded-full bg-red-500" />
                    {t("Last name is required")}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Field - Only in edit mode */}
            {formType === "edit" && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="size-4 text-gray-400" />
                  {t("Phone")}
                </Label>
                <div className="relative rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-green-primary/50">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t("Enter phone")}
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role & Status Section - Only in edit mode */}
      {formType === "edit" && (
        <FormSection
          title={t("Role & Status")}
          icon={<UserCog className="size-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-gray-600 dark:text-[#677185] text-sm">{t("Role")}</Label>
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
                          : "border-gray-200 dark:border-[#1a1f2e] bg-gray-50 dark:bg-[#0F1017] hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <RoleIcon className={`size-5 ${option.color}`} />
                      <span className={`text-sm font-medium ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-[#677185]"}`}>
                        {t(option.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Status */}
            <div className="space-y-3">
              <Label className="text-gray-600 dark:text-[#677185] text-sm">{t("Verification Status")}</Label>
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
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formik.values.isVerified ? t("Verified") : t("Unverified")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#677185]">
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
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
        {/* Header with gradient accent */}
        <div className="relative px-6 py-5 border-b border-gray-200 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Shield className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("Permissions")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("Select modules and actions for this user")}
                </p>
              </div>
            </div>
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                {permissions.filter(p => formik.values[p.value]).length} / {permissions.length} {t("active")}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Wand2 className="size-4" />
              <span className="font-medium">{t("Quick Actions")}:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Full Access */}
              <button
                type="button"
                onClick={handleFullAccess}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-600 dark:text-amber-400 text-sm font-medium transition-all duration-200"
              >
                <Crown className="size-4 group-hover:scale-110 transition-transform" />
                {t("Full Access")}
              </button>

              {/* Read Only */}
              <button
                type="button"
                onClick={handleReadOnlyAccess}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-600 dark:text-blue-400 text-sm font-medium transition-all duration-200"
              >
                <BookOpen className="size-4 group-hover:scale-110 transition-transform" />
                {t("Read Only")}
              </button>

              {/* Content Creator */}
              <button
                type="button"
                onClick={handleContentCreatorAccess}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-600 dark:text-purple-400 text-sm font-medium transition-all duration-200"
              >
                <Newspaper className="size-4 group-hover:scale-110 transition-transform" />
                {t("Content Creator")}
              </button>

              {/* Support */}
              <button
                type="button"
                onClick={handleSupportAccess}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 hover:from-cyan-500/20 hover:to-cyan-600/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 text-sm font-medium transition-all duration-200"
              >
                <HeadphonesIcon className="size-4 group-hover:scale-110 transition-transform" />
                {t("Support")}
              </button>

              {/* Clear All */}
              <button
                type="button"
                onClick={handleClearAllPermissions}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-600/10 hover:from-red-500/10 hover:to-red-600/10 border border-gray-500/20 hover:border-red-500/30 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-sm font-medium transition-all duration-200"
              >
                <RotateCcw className="size-4 group-hover:rotate-[-45deg] transition-transform" />
                {t("Clear All")}
              </button>
            </div>
          </div>
        </div>

        {/* Permission Error Message */}
        {permissionError && (
          <div className="mx-6 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <Shield className="size-4 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium text-sm">
                {permissionError}
              </p>
            </div>
          </div>
        )}

        {/* Permissions Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {permissions.map((item) => {
              const IconComponent = item.icon;
              const isEnabled = formik.values[item.value] === true;
              const selectedActions = formik.values["actions" + item.value] || [];

              return (
                <div
                  key={item.value}
                  className={`group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isEnabled
                      ? "border-green-500/50 bg-gradient-to-br from-green-500/5 to-transparent shadow-lg shadow-green-500/5"
                      : "border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0F1017] hover:border-gray-300 dark:hover:border-white/10"
                  }`}
                >
                  {/* Glow effect when enabled */}
                  {isEnabled && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent pointer-events-none" />
                  )}

                  {/* Permission Header */}
                  <div className="relative p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`relative p-2.5 rounded-xl ${item.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className={`size-5 ${item.color}`} />
                        {isEnabled && (
                          <div className="absolute -top-1 -right-1 size-3 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white dark:ring-[#0f1118]">
                            <CheckCircle className="size-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-white font-semibold cursor-pointer text-base">
                          {t(item.translationKey)}
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {isEnabled ? (
                            <span className="flex items-center gap-1">
                              <Sparkles className="size-3 text-green-500" />
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {selectedActions.length} {t("actions")}
                              </span>
                            </span>
                          ) : (
                            t("Click to enable")
                          )}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        handlePermissionToggle(item.value, checked)
                      }
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  {/* Actions */}
                  {isEnabled && (
                    <div className="relative px-4 pb-4 pt-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t("Actions")}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSelectAllActions(item.value)}
                            className="px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-md transition-colors"
                          >
                            {t("All")}
                          </button>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <button
                            type="button"
                            onClick={() => handleDeselectAllActions(item.value)}
                            className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-500/10 rounded-md transition-colors"
                          >
                            {t("Reset")}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {actions.map((action) => {
                          const ActionIcon = action.icon;
                          const isChecked = selectedActions.includes(action.value);
                          const isReadAction = action.value === "read";

                          return (
                            <label
                              key={action.value}
                              className={`relative flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                                isReadAction
                                  ? "bg-blue-500/10 border border-blue-500/30 cursor-not-allowed"
                                  : isChecked
                                    ? "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm"
                                    : "hover:bg-white dark:hover:bg-white/5 border border-transparent"
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handleActionToggle(item.value, action.value, checked)
                                }
                                disabled={isReadAction}
                                className={`${
                                  isReadAction
                                    ? "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 opacity-70"
                                    : "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                }`}
                              />
                              <ActionIcon className={`size-4 ${isReadAction ? "text-blue-500" : action.color}`} />
                              <span className={`text-sm font-medium capitalize ${
                                isReadAction
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-200"
                              }`}>
                                {t(action.label)}
                              </span>
                              {isReadAction && (
                                <Lock className="size-3 text-blue-500 ml-auto" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                      {/* Info hint */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <Lock className="size-3" />
                        <span>{t("Read permission is required and cannot be disabled")}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={formik.isSubmitting || (formType === "add" && !hasAnyPermission(formik.values))}
          className="bg-green-primary hover:bg-green-primary/80 text-white min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
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
        {formType === "add" && !hasAnyPermission(formik.values) && (
          <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Shield className="size-3.5" />
            {t("At least one permission must be selected")}
          </p>
        )}
      </div>
    </form>
  );
}

export default UserForm;
