"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Variable,
} from "lucide-react";
import {
  createTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

const TEMPLATE_TYPES = ["custom", "match", "news", "tournament", "transfer"];

const typeColors = {
  custom: "text-gray-500 bg-gray-500/10",
  match: "text-red-500 bg-red-500/10",
  news: "text-purple-500 bg-purple-500/10",
  tournament: "text-emerald-500 bg-emerald-500/10",
  transfer: "text-cyan-500 bg-cyan-500/10",
};

const emptyForm = {
  name: "",
  type: "custom",
  title: "",
  body: "",
  imageUrl: "",
};

export default function TemplateManager({ templates: initialTemplates, error }) {
  const t = useTranslations("Notifications.templatesPage");
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const extractVariables = (title, body) => {
    const combined = `${title} ${body}`;
    const matches = combined.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (template) => {
    setForm({
      name: template.name,
      type: template.type,
      title: template.title,
      body: template.body,
      imageUrl: template.imageUrl || "",
    });
    setEditingId(template.id || template._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name,
        type: form.type,
        title: form.title,
        body: form.body,
        ...(form.imageUrl && { imageUrl: form.imageUrl }),
      };

      if (editingId) {
        await updateTemplateAction(editingId, data);
        toast.success(t("updateSuccess"));
      } else {
        await createTemplateAction(data);
        toast.success(t("createSuccess"));
      }
      setShowForm(false);
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await deleteTemplateAction(id);
      toast.success(t("deleteSuccess"));
      setTemplates((prev) => prev.filter((tmpl) => (tmpl.id || tmpl._id) !== id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const detectedVars = extractVariables(form.title, form.body);

  if (error) {
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-8 text-center">
        <AlertCircle className="size-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-primary text-white rounded-xl text-sm font-medium hover:bg-green-primary/90 transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          {t("createNew")}
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-12 text-center">
          <FileText className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {t("noTemplates")}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {t("noTemplatesDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const id = template.id || template._id;
            const vars = extractVariables(template.title, template.body);
            return (
              <div
                key={id}
                className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        typeColors[template.type] || typeColors.custom
                      }`}
                    >
                      {t(template.type)}
                    </span>
                    {template.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="size-3" />
                        {t("active")}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        {t("inactive")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(template)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      <Edit2 className="size-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5"
                    >
                      <Trash2 className="size-3.5 text-red-400" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-mono">
                  {template.title}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                  {template.body}
                </p>

                {vars.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {vars.map((v) => (
                      <span
                        key={v}
                        className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 w-full max-w-lg mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {editingId ? t("edit") : t("createNew")}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <X className="size-4 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  {t("name")}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("namePlaceholder")}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-primary/20"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  {t("type")}
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none"
                >
                  {TEMPLATE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  {t("templateTitle")}
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t("titlePlaceholder")}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-primary/20"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  {t("templateBody")}
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder={t("bodyPlaceholder")}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-primary/20 resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  {t("imageUrl")}
                </label>
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1d2e] text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-primary/20"
                />
              </div>

              {/* Detected Variables */}
              {detectedVars.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Variable className="size-3.5" />
                    {t("variables")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedVars.map((v) => (
                      <span
                        key={v}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {t("variablesHint")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d2e]"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.title || !form.body}
                className="px-4 py-2.5 rounded-xl bg-green-primary text-white text-sm font-medium hover:bg-green-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "..." : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
