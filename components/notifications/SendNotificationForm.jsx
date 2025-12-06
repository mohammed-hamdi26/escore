"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Send, Users, Radio, UserCheck, Filter, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendNotificationAction } from "@/app/[locale]/_Lib/actions";

const targetTypes = [
  { id: "all", label: "All Users", icon: Users, description: "Send to all registered users" },
  { id: "topic", label: "Topic", icon: Radio, description: "Send to a specific topic" },
  { id: "users", label: "Specific Users", icon: UserCheck, description: "Select specific users" },
  { id: "segment", label: "Segment", icon: Filter, description: "Filter by criteria" },
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

export default function SendNotificationForm({ games = [], teams = [], tournaments = [], users = [] }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError(null);
    setResult(null);

    try {
      // Build target based on type
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
      };

      const response = await sendNotificationAction(data);
      setResult(response.data);
      // resetForm();
    } catch (e) {
      setError(e.message || "Failed to send notification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8">
            {/* Target Type Selection */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Target Audience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {targetTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = values.targetType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFieldValue("targetType", type.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-green-primary bg-green-primary/10"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-green-primary" : "text-gray-400"}`} />
                      <p className={`font-medium ${isSelected ? "text-white" : "text-gray-300"}`}>{type.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Input */}
            {values.targetType === "topic" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic Name</label>
                <Field
                  name="topic"
                  placeholder="e.g., game_123, team_456, breaking_news"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary"
                />
                {errors.topic && touched.topic && (
                  <p className="text-red-400 text-sm mt-1">{errors.topic}</p>
                )}
              </div>
            )}

            {/* Users Selection */}
            {values.targetType === "users" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Users</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-gray-500">No users available</p>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user) => (
                        <label key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={values.userIds.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue("userIds", [...values.userIds, user.id]);
                              } else {
                                setFieldValue("userIds", values.userIds.filter((id) => id !== user.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-primary focus:ring-green-primary"
                          />
                          <span className="text-white">{user.email}</span>
                          {user.username && <span className="text-gray-500">(@{user.username})</span>}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.userIds && touched.userIds && (
                  <p className="text-red-400 text-sm mt-1">{errors.userIds}</p>
                )}
              </div>
            )}

            {/* Segment Filters */}
            {values.targetType === "segment" && (
              <div className="space-y-6 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-md font-semibold text-white">Segment Filters</h3>

                {/* Games */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Follows Game</label>
                  <div className="flex flex-wrap gap-2">
                    {games.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => {
                          const current = values.segmentFilters.followsGame;
                          if (current.includes(game.id)) {
                            setFieldValue("segmentFilters.followsGame", current.filter((id) => id !== game.id));
                          } else {
                            setFieldValue("segmentFilters.followsGame", [...current, game.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          values.segmentFilters.followsGame.includes(game.id)
                            ? "bg-green-primary text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {game.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Teams */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Follows Team</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => {
                          const current = values.segmentFilters.followsTeam;
                          if (current.includes(team.id)) {
                            setFieldValue("segmentFilters.followsTeam", current.filter((id) => id !== team.id));
                          } else {
                            setFieldValue("segmentFilters.followsTeam", [...current, team.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          values.segmentFilters.followsTeam.includes(team.id)
                            ? "bg-green-primary text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tournaments */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Follows Tournament</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {tournaments.map((tournament) => (
                      <button
                        key={tournament.id}
                        type="button"
                        onClick={() => {
                          const current = values.segmentFilters.followsTournament;
                          if (current.includes(tournament.id)) {
                            setFieldValue("segmentFilters.followsTournament", current.filter((id) => id !== tournament.id));
                          } else {
                            setFieldValue("segmentFilters.followsTournament", [...current, tournament.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          values.segmentFilters.followsTournament.includes(tournament.id)
                            ? "bg-green-primary text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {tournament.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                  <div className="flex gap-4">
                    {platforms.map((platform) => (
                      <label key={platform.id} className="flex items-center gap-2 cursor-pointer">
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
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-primary focus:ring-green-primary"
                        />
                        <span className="text-gray-300">{platform.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Last Active Within */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Active Within (days)</label>
                  <Field
                    name="segmentFilters.lastActiveWithin"
                    type="number"
                    min="1"
                    placeholder="e.g., 7"
                    className="w-40 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary"
                  />
                </div>
              </div>
            )}

            {/* Notification Content */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Notification Content</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <Field
                  name="title"
                  placeholder="Notification title"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary"
                />
                {errors.title && touched.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Body *</label>
                <Field
                  as="textarea"
                  name="body"
                  rows={4}
                  placeholder="Notification message"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary resize-none"
                />
                {errors.body && touched.body && (
                  <p className="text-red-400 text-sm mt-1">{errors.body}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
                <Field
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary"
                />
                {errors.imageUrl && touched.imageUrl && (
                  <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <div className="flex gap-4">
                  {["high", "normal"].map((priority) => (
                    <label key={priority} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={values.priority === priority}
                        onChange={() => setFieldValue("priority", priority)}
                        className="w-4 h-4 border-gray-600 bg-gray-700 text-green-primary focus:ring-green-primary"
                      />
                      <span className="text-gray-300 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Result/Error Messages */}
            {result && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-400 font-medium">Notification sent successfully!</p>
                  <p className="text-green-300/70 text-sm mt-1">
                    Success: {result.successCount || 0} | Failed: {result.failureCount || 0}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-primary hover:bg-green-primary/80 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Notification
                </>
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
