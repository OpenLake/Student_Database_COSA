import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import {
  createTemplate,
  updateTemplate,
} from "../../services/templates";

const categories = [
  "TECHNICAL",
  "CULTURAL",
  "SPORTS",
  "ACADEMIC",
  "OTHER",
];

const statuses = [
  "Draft",
  "Active",
  "Archived",
];

const designs = [
  "Default",
  "Classic",
  "Modern",
];

const initialState = {
  title: "",
  description: "",
  category: "TECHNICAL",
  design: "Default",
  status: "Draft",
};

export default function TemplateModal({
  open,
  mode = "create",
  template,
  onClose,
  onSuccess,
}) {
  const editing = mode === "edit";
  const viewing = mode === "view";

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setForm({
        title: template.title || "",
        description: template.description || "",
        category: template.category || "TECHNICAL",
        design: template.design || "Default",
        status: template.status || "Draft",
      });
    } else {
      setForm(initialState);
    }
  }, [template, open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    if (!loading) {
      setForm(initialState);
      onClose();
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (viewing) {
      handleClose();
      return;
    }

    if (!form.title.trim()) {
      toast.error("Template title is required");
      return;
    }

    try {
      setLoading(true);

      if (editing) {
        const res = await updateTemplate(template._id, form);

        if (res?.status === 200) {
          toast.success("Template updated successfully");
        }
      } else {
        const res = await createTemplate(form);

        if (res?.status === 201 || res?.status === 200) {
          toast.success("Template created successfully");
        }
      }

      await onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-[#2A6040]">

            {viewing
              ? "View Template"
              : editing
              ? "Edit Template"
              : "Create Template"}

          </h2>

          <button
            onClick={handleClose}
            disabled={loading}
          >
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Title */}

          <div>

            <label className="font-semibold">
              Title
            </label>

            <input
              disabled={viewing || loading}
              className="border rounded-lg w-full mt-2 p-2"
              value={form.title}
              onChange={(e) =>
                handleChange("title", e.target.value)
              }
            />

          </div>

          {/* Description */}

          <div>

            <label className="font-semibold">
              Description
            </label>

            <textarea
              rows={4}
              disabled={viewing || loading}
              className="border rounded-lg w-full mt-2 p-2"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />

          </div>

          {/* Category */}

          <div>

            <label className="font-semibold">
              Category
            </label>

            <select
              disabled={viewing || loading}
              className="border rounded-lg w-full mt-2 p-2"
              value={form.category}
              onChange={(e) =>
                handleChange("category", e.target.value)
              }
            >
              {categories.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </select>

          </div>

          {/* Design */}

          <div>

            <label className="font-semibold">
              Design
            </label>

            <select
              disabled={viewing || loading}
              className="border rounded-lg w-full mt-2 p-2"
              value={form.design}
              onChange={(e) =>
                handleChange("design", e.target.value)
              }
            >
              {designs.map((d) => (
                <option key={d}>
                  {d}
                </option>
              ))}
            </select>

          </div>

          {/* Status */}

          {editing && (
            <div>

              <label className="font-semibold">
                Status
              </label>

              <select
                disabled={viewing || loading}
                className="border rounded-lg w-full mt-2 p-2"
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
              >
                {statuses.map((s) => (
                  <option key={s}>
                    {s}
                  </option>
                ))}
              </select>

            </div>
          )}

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={handleClose}
              className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100"
            >
              {viewing ? "Close" : "Cancel"}
            </button>

            {!viewing && (

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg,#2A6040,#1E4A30)",
                }}
              >
                {loading
                  ? "Saving..."
                  : editing
                  ? "Update"
                  : "Create"}
              </button>

            )}

          </div>

        </form>

      </div>
    </div>
  );
}