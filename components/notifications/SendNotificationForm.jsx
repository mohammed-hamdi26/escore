"use client";

import { useState, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import {
  Send,
  Users,
  Radio,
  UserCheck,
  Filter,
  Loader2,
  CheckCircle,
  AlertCircle,
  Target,
  FileText,
  Image,
  Zap,
  Gamepad2,
  Trophy,
  UsersIcon,
  Search,
  X,
  Newspaper,
  Bell,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendNotificationAction } from "@/app/[locale]/_Lib/actions";

const targetTypes = [
  { id: "all", labelKey: "targetTypes.all", icon: Users, description: "targetTypes.allDesc", color: "blue", gradient: "from-blue-500 to-blue-600" },
  { id: "topic", labelKey: "targetTypes.topic", icon: Radio, description: "targetTypes.topicDesc", color: "purple", gradient: "from-purple-500 to-purple-600" },
  { id: "users", labelKey: "targetTypes.users", icon: UserCheck, description: "targetTypes.usersDesc", color: "emerald", gradient: "from-emerald-500 to-emerald-600" },
  { id: "segment", labelKey: "targetTypes.segment", icon: Filter, description: "targetTypes.segmentDesc", color: "orange", gradient: "from-orange-500 to-orange-600" },
];

const platforms = [
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
  { id: "web", label: "Web" },
];

const validationSchema = Yup.object({
  targetType: Yup.string().oneOf(["all", "topic", "users", "segment"]).required("Required"),
  topic: Yup.string().when("targetType", {
    is: "topic",
    then: (schema) => schema.required("Topic is required"),
  }),
  userIds: Yup.array().when("targetType", {
    is: "users",
    then: (schema) => schema.min(1, "Select at least one user"),
  }),
  title: Yup.string().required("Title is required").max(100, "Max 100 characters"),
  body: Yup.string().required("Body is required").max(500, "Max 500 characters"),
  imageUrl: Yup.string().url("Must be a valid URL").nullable(),
});

function SectionCard({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
        <div className="size-8 rounded-lg bg-green-primary/10 flex items-center justify-center">
          <Icon className="size-4 text-green-primary" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Helper to get image URL from light/dark object or string
function getImageUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.light || image.dark || null;
}

export default function SendNotificationForm({ games = [], teams = [], tournaments = [], users = [] }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [gameSearch, setGameSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [tournamentSearch, setTournamentSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const t = useTranslations("Notifications");

  // Generate topics from games, teams, tournaments with images
  const availableTopics = useMemo(() => {
    const topics = [
      // Predefined topics
      { id: "breaking_news", name: t("topics.breakingNews") || "Breaking News", type: "general", icon: Newspaper, image: null },
      { id: "general", name: t("topics.general") || "General Updates", type: "general", icon: Bell, image: null },
    ];

    // Add game topics with images
    games.forEach((game) => {
      topics.push({
        id: `game_${game.id}`,
        name: game.name,
        type: "game",
        icon: Gamepad2,
        image: getImageUrl(game.logo) || getImageUrl(game.icon),
      });
    });

    // Add team topics with images
    teams.forEach((team) => {
      topics.push({
        id: `team_${team.id}`,
        name: team.name,
        type: "team",
        icon: UsersIcon,
        image: getImageUrl(team.logo),
      });
    });

    // Add tournament topics with images
    tournaments.forEach((tournament) => {
      topics.push({
        id: `tournament_${tournament.id}`,
        name: tournament.name,
        type: "tournament",
        icon: Trophy,
        image: getImageUrl(tournament.logo),
      });
    });

    return topics;
  }, [games, teams, tournaments, t]);

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return availableTopics;
    const search = topicSearch.toLowerCase();
    return availableTopics.filter((topic) => topic.name?.toLowerCase().includes(search));
  }, [availableTopics, topicSearch]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const search = userSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.email?.toLowerCase().includes(search) ||
        user.username?.toLowerCase().includes(search) ||
        user.firstName?.toLowerCase().includes(search) ||
        user.lastName?.toLowerCase().includes(search)
    );
  }, [users, userSearch]);

  // Filter games based on search
  const filteredGames = useMemo(() => {
    if (!gameSearch.trim()) return games;
    const search = gameSearch.toLowerCase();
    return games.filter((game) => game.name?.toLowerCase().includes(search));
  }, [games, gameSearch]);

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!teamSearch.trim()) return teams;
    const search = teamSearch.toLowerCase();
    return teams.filter((team) => team.name?.toLowerCase().includes(search));
  }, [teams, teamSearch]);

  // Filter tournaments based on search
  const filteredTournaments = useMemo(() => {
    if (!tournamentSearch.trim()) return tournaments;
    const search = tournamentSearch.toLowerCase();
    return tournaments.filter((tournament) => tournament.name?.toLowerCase().includes(search));
  }, [tournaments, tournamentSearch]);

  const initialValues = {
    targetType: "all",
    topic: "",
    userIds: [],
    segmentFilters: {
      followsGame: [],
      followsTeam: [],
      followsTournament: [],
      platform: [],
      lastActiveWithin: "",
    },
    title: "",
    body: "",
    imageUrl: "",
    priority: "high",
    sendType: "now",
    scheduledAt: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError(null);
    setResult(null);

    try {
      let target;
      switch (values.targetType) {
        case "all":
          target = { type: "all" };
          break;
        case "topic":
          target = { type: "topic", topic: values.topic };
          break;
        case "users":
          target = { type: "users", userIds: values.userIds };
          break;
        case "segment":
          const filters = {};
          if (values.segmentFilters.followsGame.length > 0) {
            filters.followsGame = values.segmentFilters.followsGame;
          }
          if (values.segmentFilters.followsTeam.length > 0) {
            filters.followsTeam = values.segmentFilters.followsTeam;
          }
          if (values.segmentFilters.followsTournament.length > 0) {
            filters.followsTournament = values.segmentFilters.followsTournament;
          }
          if (values.segmentFilters.platform.length > 0) {
            filters.platform = values.segmentFilters.platform;
          }
          if (values.segmentFilters.lastActiveWithin) {
            filters.lastActiveWithin = parseInt(values.segmentFilters.lastActiveWithin);
          }
          target = { type: "segment", filters };
          break;
        default:
          throw new Error("Invalid target type");
      }

      const data = {
        target,
        notification: {
          title: values.title,
          body: values.body,
          ...(values.imageUrl && { imageUrl: values.imageUrl }),
        },
        options: {
          priority: values.priority,
        },
        ...(values.sendType === "schedule" && values.scheduledAt && {
          scheduledAt: new Date(values.scheduledAt).toISOString(),
        }),
      };

      const response = await sendNotificationAction(data);
      setResult(response.data);
    } catch (e) {
      setError(e.message || t("form.sendError") || "Failed to send notification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Target Type Selection - Enhanced Design */}
            <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-green-primary/5 via-transparent to-transparent">
                <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
                  <Target className="size-5 text-green-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("form.targetAudience") || "Target Audience"}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("form.selectTargetType") || "Choose who will receive this notification"}</p>
                </div>
              </div>

              {/* Target Type Tabs - Enhanced */}
              <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {targetTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = values.targetType === type.id;
                    const colorClasses = {
                      blue: {
                        selected: "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
                        icon: "bg-white/20",
                        hover: "hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30",
                        text: "text-blue-600 dark:text-blue-400",
                        iconColor: "text-blue-500",
                        iconBg: "bg-blue-500/10"
                      },
                      purple: {
                        selected: "bg-purple-500 text-white shadow-lg shadow-purple-500/25",
                        icon: "bg-white/20",
                        hover: "hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-200 dark:hover:border-purple-500/30",
                        text: "text-purple-600 dark:text-purple-400",
                        iconColor: "text-purple-500",
                        iconBg: "bg-purple-500/10"
                      },
                      emerald: {
                        selected: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
                        icon: "bg-white/20",
                        hover: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30",
                        text: "text-emerald-600 dark:text-emerald-400",
                        iconColor: "text-emerald-500",
                        iconBg: "bg-emerald-500/10"
                      },
                      orange: {
                        selected: "bg-orange-500 text-white shadow-lg shadow-orange-500/25",
                        icon: "bg-white/20",
                        hover: "hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-200 dark:hover:border-orange-500/30",
                        text: "text-orange-600 dark:text-orange-400",
                        iconColor: "text-orange-500",
                        iconBg: "bg-orange-500/10"
                      }
                    };
                    const colors = colorClasses[type.color];

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFieldValue("targetType", type.id)}
                        className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 border-2 ${
                          isSelected
                            ? `${colors.selected} border-transparent`
                            : `bg-white dark:bg-[#1a1d2e] border-gray-100 dark:border-white/5 ${colors.hover}`
                        }`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="size-4 text-white/90" />
                          </div>
                        )}

                        {/* Icon */}
                        <div className={`size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? colors.icon
                            : colors.iconBg
                        }`}>
                          <Icon className={`size-5 ${isSelected ? "text-white" : colors.iconColor}`} />
                        </div>

                        {/* Label */}
                        <span className={`text-sm font-semibold transition-colors ${
                          isSelected ? "text-white" : colors.text
                        }`}>
                          {t(type.labelKey) || type.labelKey}
                        </span>

                        {/* Description */}
                        <span className={`text-[11px] text-center leading-tight transition-colors ${
                          isSelected ? "text-white/70" : "text-gray-400 dark:text-gray-500"
                        }`}>
                          {t(type.description) || type.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                {/* All Users - Enhanced Design */}
                {values.targetType === "all" && (
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 p-6">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl" />

                    <div className="relative flex items-center gap-5">
                      <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Users className="size-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t("form.allUsersSelected") || "All Users Selected"}</h4>
                          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                            {t("form.broadcast") || "Broadcast"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t("form.allUsersDesc") || "Notification will be sent to all registered users"}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-xl border border-blue-200 dark:border-blue-500/20">
                        <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("form.ready") || "Ready"}</span>
                      </div>
                    </div>
                  </div>
                )}

              {/* Topic Selection */}
              {values.targetType === "topic" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("form.selectTopic") || "Select Topic"}
                    </label>
                    {values.topic && (
                      <button
                        type="button"
                        onClick={() => setFieldValue("topic", "")}
                        className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors"
                      >
                        {t("form.clearAll") || "Clear"}
                      </button>
                    )}
                  </div>

                  {/* Topic Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={topicSearch}
                      onChange={(e) => setTopicSearch(e.target.value)}
                      placeholder={t("form.searchTopics") || "Search topics..."}
                      className="w-full h-11 bg-gray-50 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/50 transition-all"
                    />
                    {topicSearch && (
                      <button
                        type="button"
                        onClick={() => setTopicSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#252a3d] transition-colors"
                      >
                        <X className="size-4 text-gray-400" />
                      </button>
                    )}
                  </div>

                  {/* Selected Topic Display */}
                  {values.topic && (
                    <div className="mb-4 p-3 bg-green-primary/5 border border-green-primary/20 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t("form.selectedTopic") || "Selected Topic"}:</p>
                      {(() => {
                        const selectedTopic = availableTopics.find((t) => t.id === values.topic);
                        const Icon = selectedTopic?.icon || Radio;
                        return (
                          <div className="flex items-center gap-3">
                            {selectedTopic?.image ? (
                              <img
                                src={selectedTopic.image}
                                alt={selectedTopic.name}
                                className="size-10 rounded-lg object-cover ring-2 ring-green-primary/30"
                              />
                            ) : (
                              <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center ring-2 ring-green-primary/30">
                                <Icon className="size-5 text-green-primary" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white">{selectedTopic?.name || values.topic}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{selectedTopic?.type || "topic"}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFieldValue("topic", "")}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <X className="size-4 text-red-500" />
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Topic Categories */}
                  <div className="space-y-5">
                    {/* General Topics */}
                    {filteredTopics.filter((topic) => topic.type === "general").length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {filteredTopics
                          .filter((topic) => topic.type === "general")
                          .map((topic) => {
                            const Icon = topic.icon;
                            const isSelected = values.topic === topic.id;
                            return (
                              <button
                                key={topic.id}
                                type="button"
                                onClick={() => setFieldValue("topic", topic.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                                  isSelected
                                    ? "bg-green-primary text-white shadow-md shadow-green-primary/20"
                                    : "bg-gray-100 dark:bg-[#1a1d2e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252a3d] border border-gray-200 dark:border-white/10"
                                }`}
                              >
                                <Icon className="size-5" />
                                {topic.name}
                              </button>
                            );
                            })}
                      </div>
                    )}

                    {/* Grid for Games, Teams, Tournaments */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Game Topics */}
                      {filteredTopics.filter((topic) => topic.type === "game").length > 0 && (
                        <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2">
                            <Gamepad2 className="size-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("form.gameTopics") || "Games"}</span>
                            <span className="ml-auto text-xs text-gray-400 bg-gray-200 dark:bg-[#252a3d] px-2 py-0.5 rounded-full">{filteredTopics.filter((t) => t.type === "game").length}</span>
                          </div>
                          <div className="max-h-52 overflow-y-auto p-2 space-y-1">
                            {filteredTopics
                              .filter((topic) => topic.type === "game")
                              .map((topic) => {
                                const isSelected = values.topic === topic.id;
                                return (
                                  <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => setFieldValue("topic", topic.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                                      isSelected
                                        ? "bg-purple-500/10 ring-1 ring-purple-500/30"
                                        : "hover:bg-white dark:hover:bg-[#252a3d]"
                                    }`}
                                  >
                                    {topic.image ? (
                                      <img
                                        src={topic.image}
                                        alt={topic.name}
                                        className={`size-8 rounded-lg object-cover ${isSelected ? "ring-2 ring-purple-500" : ""}`}
                                      />
                                    ) : (
                                      <div className={`size-8 rounded-lg bg-purple-500/10 flex items-center justify-center ${isSelected ? "ring-2 ring-purple-500" : ""}`}>
                                        <Gamepad2 className="size-4 text-purple-500" />
                                      </div>
                                    )}
                                    <span className={`font-medium text-sm ${isSelected ? "text-purple-600 dark:text-purple-400" : "text-gray-900 dark:text-white"}`}>
                                      {topic.name}
                                    </span>
                                    {isSelected && (
                                      <CheckCircle className="size-4 text-purple-500 ml-auto" />
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Team Topics */}
                      {filteredTopics.filter((topic) => topic.type === "team").length > 0 && (
                        <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2">
                            <UsersIcon className="size-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("form.teamTopics") || "Teams"}</span>
                            <span className="ml-auto text-xs text-gray-400 bg-gray-200 dark:bg-[#252a3d] px-2 py-0.5 rounded-full">{filteredTopics.filter((t) => t.type === "team").length}</span>
                          </div>
                          <div className="max-h-52 overflow-y-auto p-2 space-y-1">
                            {filteredTopics
                              .filter((topic) => topic.type === "team")
                              .map((topic) => {
                                const isSelected = values.topic === topic.id;
                                return (
                                  <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => setFieldValue("topic", topic.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                                      isSelected
                                        ? "bg-blue-500/10 ring-1 ring-blue-500/30"
                                        : "hover:bg-white dark:hover:bg-[#252a3d]"
                                    }`}
                                  >
                                    {topic.image ? (
                                      <img
                                        src={topic.image}
                                        alt={topic.name}
                                        className={`size-8 rounded-lg object-cover ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                                      />
                                    ) : (
                                      <div className={`size-8 rounded-lg bg-blue-500/10 flex items-center justify-center ${isSelected ? "ring-2 ring-blue-500" : ""}`}>
                                        <UsersIcon className="size-4 text-blue-500" />
                                      </div>
                                    )}
                                    <span className={`font-medium text-sm ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                                      {topic.name}
                                    </span>
                                    {isSelected && (
                                      <CheckCircle className="size-4 text-blue-500 ml-auto" />
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Tournament Topics */}
                      {filteredTopics.filter((topic) => topic.type === "tournament").length > 0 && (
                        <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2">
                            <Trophy className="size-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("form.tournamentTopics") || "Tournaments"}</span>
                            <span className="ml-auto text-xs text-gray-400 bg-gray-200 dark:bg-[#252a3d] px-2 py-0.5 rounded-full">{filteredTopics.filter((t) => t.type === "tournament").length}</span>
                          </div>
                          <div className="max-h-52 overflow-y-auto p-2 space-y-1">
                            {filteredTopics
                              .filter((topic) => topic.type === "tournament")
                              .map((topic) => {
                                const isSelected = values.topic === topic.id;
                                return (
                                  <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => setFieldValue("topic", topic.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                                      isSelected
                                        ? "bg-yellow-500/10 ring-1 ring-yellow-500/30"
                                        : "hover:bg-white dark:hover:bg-[#252a3d]"
                                    }`}
                                  >
                                    {topic.image ? (
                                      <img
                                        src={topic.image}
                                        alt={topic.name}
                                        className={`size-8 rounded-lg object-cover ${isSelected ? "ring-2 ring-yellow-500" : ""}`}
                                      />
                                    ) : (
                                      <div className={`size-8 rounded-lg bg-yellow-500/10 flex items-center justify-center ${isSelected ? "ring-2 ring-yellow-500" : ""}`}>
                                        <Trophy className="size-4 text-yellow-500" />
                                      </div>
                                    )}
                                    <span className={`font-medium text-sm ${isSelected ? "text-yellow-600 dark:text-yellow-400" : "text-gray-900 dark:text-white"}`}>
                                      {topic.name}
                                    </span>
                                    {isSelected && (
                                      <CheckCircle className="size-4 text-yellow-500 ml-auto" />
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* No Results */}
                    {filteredTopics.length === 0 && (
                      <div className="text-center py-8">
                        <Search className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">{t("form.noTopicsFound") || "No topics found"}</p>
                      </div>
                    )}
                  </div>

                  {errors.topic && touched.topic && (
                    <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {errors.topic}
                    </p>
                  )}
                </div>
              )}

              {/* Users Selection */}
              {values.targetType === "users" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("form.selectUsers") || "Select Users"}
                    </label>
                    {values.userIds.length > 0 && (
                      <span className="text-xs font-medium text-green-primary bg-green-primary/10 px-2 py-1 rounded-full">
                        {values.userIds.length} {t("form.selected") || "selected"}
                      </span>
                    )}
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={t("form.searchUsers") || "Search users by email, username, or name..."}
                      className="w-full h-11 bg-gray-50 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/50 transition-all"
                    />
                    {userSearch && (
                      <button
                        type="button"
                        onClick={() => setUserSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#252a3d] transition-colors"
                      >
                        <X className="size-4 text-gray-400" />
                      </button>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {users.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setFieldValue("userIds", filteredUsers.map((u) => u.id))}
                        className="text-xs font-medium text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 px-2 py-1 rounded-md transition-colors"
                      >
                        {t("form.selectAll") || "Select All"}
                      </button>
                      {values.userIds.length > 0 && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <button
                            type="button"
                            onClick={() => setFieldValue("userIds", [])}
                            className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors"
                          >
                            {t("form.clearAll") || "Clear All"}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Users List */}
                  <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto p-2">
                      {users.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("form.noUsersAvailable") || "No users available"}
                          </p>
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                          <Search className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("form.noUsersFound") || "No users found matching your search"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredUsers.map((user) => {
                            const isSelected = values.userIds.includes(user.id);
                            return (
                              <label
                                key={user.id}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-green-primary/10 ring-1 ring-green-primary/30"
                                    : "hover:bg-white dark:hover:bg-[#252a3d]"
                                }`}
                              >
                                <div className={`size-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "bg-green-primary border-green-primary"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}>
                                  {isSelected && (
                                    <CheckCircle className="size-3.5 text-white" />
                                  )}
                                </div>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFieldValue("userIds", [...values.userIds, user.id]);
                                    } else {
                                      setFieldValue("userIds", values.userIds.filter((id) => id !== user.id));
                                    }
                                  }}
                                  className="hidden"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 dark:text-white font-medium truncate">
                                    {user.firstName && user.lastName
                                      ? `${user.firstName} ${user.lastName}`
                                      : user.email}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                    {user.username && ` • @${user.username}`}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.userIds && touched.userIds && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {errors.userIds}
                    </p>
                  )}
                </div>
              )}

              {/* Segment Filters */}
              {values.targetType === "segment" && (
                <div className="space-y-5">
                  {/* Grid for Games, Teams, Tournaments */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Games Card */}
                    <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2 bg-purple-500/5">
                        <Gamepad2 className="size-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("form.followsGame") || "Games"}</span>
                        {values.segmentFilters.followsGame.length > 0 && (
                          <span className="ml-auto text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                            {values.segmentFilters.followsGame.length}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        {/* Search */}
                        <div className="relative mb-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={gameSearch}
                            onChange={(e) => setGameSearch(e.target.value)}
                            placeholder={t("form.searchGames") || "Search..."}
                            className="w-full h-9 bg-white dark:bg-[#252a3d] border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-8 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                          />
                          {gameSearch && (
                            <button type="button" onClick={() => setGameSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                              <X className="size-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                        {/* List */}
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredGames.length === 0 ? (
                            <p className="text-center py-4 text-gray-400 text-sm">{games.length === 0 ? t("form.noGamesAvailable") : t("form.noGamesFound")}</p>
                          ) : (
                            filteredGames.map((game) => {
                              const isSelected = values.segmentFilters.followsGame.includes(game.id);
                              const gameImage = getImageUrl(game.logo) || getImageUrl(game.icon);
                              return (
                                <label key={game.id} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-purple-500/10 ring-1 ring-purple-500/30" : "hover:bg-white dark:hover:bg-[#1a1d2e]"}`}>
                                  <input type="checkbox" checked={isSelected} onChange={(e) => {
                                    const current = values.segmentFilters.followsGame;
                                    setFieldValue("segmentFilters.followsGame", e.target.checked ? [...current, game.id] : current.filter((id) => id !== game.id));
                                  }} className="hidden" />
                                  <div className={`size-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-purple-500 border-purple-500" : "border-gray-300 dark:border-gray-600"}`}>
                                    {isSelected && <CheckCircle className="size-3 text-white" />}
                                  </div>
                                  {gameImage ? (
                                    <img src={gameImage} alt={game.name} className="size-6 rounded object-cover" />
                                  ) : (
                                    <div className="size-6 rounded bg-purple-500/10 flex items-center justify-center"><Gamepad2 className="size-3.5 text-purple-500" /></div>
                                  )}
                                  <span className="text-sm text-gray-900 dark:text-white truncate">{game.name}</span>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Teams Card */}
                    <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2 bg-blue-500/5">
                        <UsersIcon className="size-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("form.followsTeam") || "Teams"}</span>
                        {values.segmentFilters.followsTeam.length > 0 && (
                          <span className="ml-auto text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                            {values.segmentFilters.followsTeam.length}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        {/* Search */}
                        <div className="relative mb-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={teamSearch}
                            onChange={(e) => setTeamSearch(e.target.value)}
                            placeholder={t("form.searchTeams") || "Search..."}
                            className="w-full h-9 bg-white dark:bg-[#252a3d] border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-8 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                          />
                          {teamSearch && (
                            <button type="button" onClick={() => setTeamSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                              <X className="size-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                        {/* List */}
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredTeams.length === 0 ? (
                            <p className="text-center py-4 text-gray-400 text-sm">{teams.length === 0 ? t("form.noTeamsAvailable") : t("form.noTeamsFound")}</p>
                          ) : (
                            filteredTeams.map((team) => {
                              const isSelected = values.segmentFilters.followsTeam.includes(team.id);
                              const teamImage = getImageUrl(team.logo);
                              return (
                                <label key={team.id} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-blue-500/10 ring-1 ring-blue-500/30" : "hover:bg-white dark:hover:bg-[#1a1d2e]"}`}>
                                  <input type="checkbox" checked={isSelected} onChange={(e) => {
                                    const current = values.segmentFilters.followsTeam;
                                    setFieldValue("segmentFilters.followsTeam", e.target.checked ? [...current, team.id] : current.filter((id) => id !== team.id));
                                  }} className="hidden" />
                                  <div className={`size-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"}`}>
                                    {isSelected && <CheckCircle className="size-3 text-white" />}
                                  </div>
                                  {teamImage ? (
                                    <img src={teamImage} alt={team.name} className="size-6 rounded object-cover" />
                                  ) : (
                                    <div className="size-6 rounded bg-blue-500/10 flex items-center justify-center"><UsersIcon className="size-3.5 text-blue-500" /></div>
                                  )}
                                  <span className="text-sm text-gray-900 dark:text-white truncate">{team.name}</span>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tournaments Card */}
                    <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2 bg-yellow-500/5">
                        <Trophy className="size-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("form.followsTournament") || "Tournaments"}</span>
                        {values.segmentFilters.followsTournament.length > 0 && (
                          <span className="ml-auto text-xs font-medium text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            {values.segmentFilters.followsTournament.length}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        {/* Search */}
                        <div className="relative mb-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={tournamentSearch}
                            onChange={(e) => setTournamentSearch(e.target.value)}
                            placeholder={t("form.searchTournaments") || "Search..."}
                            className="w-full h-9 bg-white dark:bg-[#252a3d] border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-8 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
                          />
                          {tournamentSearch && (
                            <button type="button" onClick={() => setTournamentSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                              <X className="size-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                        {/* List */}
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredTournaments.length === 0 ? (
                            <p className="text-center py-4 text-gray-400 text-sm">{tournaments.length === 0 ? t("form.noTournamentsAvailable") : t("form.noTournamentsFound")}</p>
                          ) : (
                            filteredTournaments.map((tournament) => {
                              const isSelected = values.segmentFilters.followsTournament.includes(tournament.id);
                              const tournamentImage = getImageUrl(tournament.logo);
                              return (
                                <label key={tournament.id} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-yellow-500/10 ring-1 ring-yellow-500/30" : "hover:bg-white dark:hover:bg-[#1a1d2e]"}`}>
                                  <input type="checkbox" checked={isSelected} onChange={(e) => {
                                    const current = values.segmentFilters.followsTournament;
                                    setFieldValue("segmentFilters.followsTournament", e.target.checked ? [...current, tournament.id] : current.filter((id) => id !== tournament.id));
                                  }} className="hidden" />
                                  <div className={`size-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-yellow-500 border-yellow-500" : "border-gray-300 dark:border-gray-600"}`}>
                                    {isSelected && <CheckCircle className="size-3 text-white" />}
                                  </div>
                                  {tournamentImage ? (
                                    <img src={tournamentImage} alt={tournament.name} className="size-6 rounded object-cover" />
                                  ) : (
                                    <div className="size-6 rounded bg-yellow-500/10 flex items-center justify-center"><Trophy className="size-3.5 text-yellow-500" /></div>
                                  )}
                                  <span className="text-sm text-gray-900 dark:text-white truncate">{tournament.name}</span>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform & Last Active */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {t("form.platform") || "Platform"}
                      </label>
                      <div className="flex gap-3">
                        {platforms.map((platform) => (
                          <label
                            key={platform.id}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
                              values.segmentFilters.platform.includes(platform.id)
                                ? "bg-green-primary/10 border-2 border-green-primary text-green-primary"
                                : "bg-gray-100 dark:bg-[#1a1d2e] border-2 border-transparent text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={values.segmentFilters.platform.includes(platform.id)}
                              onChange={(e) => {
                                const current = values.segmentFilters.platform;
                                if (e.target.checked) {
                                  setFieldValue("segmentFilters.platform", [...current, platform.id]);
                                } else {
                                  setFieldValue("segmentFilters.platform", current.filter((id) => id !== platform.id));
                                }
                              }}
                              className="hidden"
                            />
                            <span className="text-sm font-medium">{platform.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {t("form.lastActiveWithin") || "Last Active Within (days)"}
                      </label>
                      <Field
                        name="segmentFilters.lastActiveWithin"
                        type="number"
                        min="1"
                        placeholder={t("form.daysPlaceholder") || "e.g., 7"}
                        className="w-full h-12 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Notification Content */}
            <SectionCard title={t("form.notificationContent") || "Notification Content"} icon={FileText}>
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("form.title") || "Title"} <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="title"
                    placeholder={t("form.titlePlaceholder") || "Notification title"}
                    className="w-full h-12 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
                  />
                  {errors.title && touched.title && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("form.body") || "Body"} <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="body"
                    rows={4}
                    placeholder={t("form.bodyPlaceholder") || "Notification message"}
                    className="w-full bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all resize-none"
                  />
                  {errors.body && touched.body && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {errors.body}
                    </p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Image className="size-4 text-gray-400" />
                    {t("form.imageUrl") || "Image URL"} <span className="text-gray-400 text-xs">({t("form.optional") || "optional"})</span>
                  </label>
                  <Field
                    name="imageUrl"
                    placeholder={t("form.imageUrlPlaceholder") || "https://example.com/image.jpg"}
                    className="w-full h-12 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
                  />
                  {errors.imageUrl && touched.imageUrl && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      {errors.imageUrl}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Zap className="size-4 text-yellow-500" />
                    {t("form.priority") || "Priority"}
                  </label>
                  <div className="flex gap-3">
                    {["high", "normal"].map((priority) => (
                      <label
                        key={priority}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg cursor-pointer transition-all ${
                          values.priority === priority
                            ? priority === "high"
                              ? "bg-orange-500/10 border-2 border-orange-500 text-orange-500"
                              : "bg-blue-500/10 border-2 border-blue-500 text-blue-500"
                            : "bg-gray-100 dark:bg-[#1a1d2e] border-2 border-transparent text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={values.priority === priority}
                          onChange={() => setFieldValue("priority", priority)}
                          className="hidden"
                        />
                        <span className="text-sm font-medium capitalize">{t(`form.${priority}`) || priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Clock className="size-4 text-indigo-500" />
                    {t("form.scheduling") || "Scheduling"}
                  </label>
                  <div className="flex gap-3 mb-3">
                    <label
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg cursor-pointer transition-all ${
                        values.sendType === "now"
                          ? "bg-green-primary/10 border-2 border-green-primary text-green-primary"
                          : "bg-gray-100 dark:bg-[#1a1d2e] border-2 border-transparent text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={values.sendType === "now"}
                        onChange={() => {
                          setFieldValue("sendType", "now");
                          setFieldValue("scheduledAt", "");
                        }}
                        className="hidden"
                      />
                      <Send className="size-4" />
                      <span className="text-sm font-medium">{t("form.sendNow") || "Send Now"}</span>
                    </label>
                    <label
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg cursor-pointer transition-all ${
                        values.sendType === "schedule"
                          ? "bg-indigo-500/10 border-2 border-indigo-500 text-indigo-500"
                          : "bg-gray-100 dark:bg-[#1a1d2e] border-2 border-transparent text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={values.sendType === "schedule"}
                        onChange={() => setFieldValue("sendType", "schedule")}
                        className="hidden"
                      />
                      <Calendar className="size-4" />
                      <span className="text-sm font-medium">{t("form.scheduleLater") || "Schedule Later"}</span>
                    </label>
                  </div>

                  {values.sendType === "schedule" && (
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-indigo-400 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={values.scheduledAt}
                        onChange={(e) => setFieldValue("scheduledAt", e.target.value)}
                        min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                        className="w-full h-12 bg-gray-50 dark:bg-[#1a1d2e] border-0 rounded-xl pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                      {values.sendType === "schedule" && !values.scheduledAt && (
                        <p className="text-amber-500 text-sm mt-2 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          {t("form.scheduleRequired") || "Please select a date and time"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Result/Error Messages */}
            {result && (
              <div className={`${result.scheduledAt ? "bg-indigo-500/10 border-indigo-500/20" : "bg-green-500/10 border-green-500/20"} border rounded-2xl p-5 flex items-start gap-4`}>
                <div className={`p-2 rounded-lg ${result.scheduledAt ? "bg-indigo-500/10" : "bg-green-500/10"}`}>
                  {result.scheduledAt ? (
                    <Calendar className="size-5 text-indigo-500" />
                  ) : (
                    <CheckCircle className="size-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className={`${result.scheduledAt ? "text-indigo-500" : "text-green-500"} font-semibold`}>
                    {result.scheduledAt
                      ? (t("form.scheduleSuccess") || "Notification scheduled successfully!")
                      : (t("form.sendSuccess") || "Notification sent successfully!")}
                  </p>
                  <p className={`${result.scheduledAt ? "text-indigo-400/80" : "text-green-400/80"} text-sm mt-1`}>
                    {result.scheduledAt ? (
                      <>
                        {t("form.scheduledFor") || "Scheduled for"}: {new Date(result.scheduledAt).toLocaleString()}
                      </>
                    ) : (
                      <>
                        {t("form.success") || "Success"}: {result.successCount || 0} | {t("form.failed") || "Failed"}: {result.failureCount || 0}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertCircle className="size-5 text-red-500" />
                </div>
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || (values.sendType === "schedule" && !values.scheduledAt)}
                className={`${
                  values.sendType === "schedule"
                    ? "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    : "bg-green-primary hover:bg-green-primary/90 shadow-green-primary/20 hover:shadow-green-primary/30"
                } text-white px-8 h-12 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    {values.sendType === "schedule"
                      ? (t("form.scheduling_btn") || "Scheduling...")
                      : (t("form.sending") || "Sending...")}
                  </>
                ) : values.sendType === "schedule" ? (
                  <>
                    <Calendar className="size-5" />
                    {t("form.scheduleNotification") || "Schedule Notification"}
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    {t("form.sendNotification") || "Send Notification"}
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
