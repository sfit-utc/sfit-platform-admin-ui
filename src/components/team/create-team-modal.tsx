"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/modal";
import { teamService } from "@/services/team-service";
import { CreateTeamRequest } from "@/types/team";

export default function CreateTeamModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setError(null);
    }
  }, [open]);

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const createReq: CreateTeamRequest = { name, description };
      await teamService.createTeam(createReq);
      if (onCreated) await Promise.resolve(onCreated());
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không thể tạo nhóm");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      state={open}
      funcClickToBack={() => onClose()}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-green)" }}
        >
          Tạo Ban
        </h2>

        {error && (
          <div className="text-sm" style={{ color: "var(--sfit-red-500)" }}>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm">Tên ban</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            style={{ borderColor: "var(--sfit-gray-200)" }}
            placeholder="Nhập tên nhóm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 min-h-24"
            style={{ borderColor: "var(--sfit-gray-200)" }}
            placeholder="Mô tả ngắn về nhóm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            style={{ borderColor: "var(--sfit-gray-200)" }}
            disabled={submitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="px-4 py-2 bg-sfit-green text-white rounded-md disabled:opacity-60"
          >
            {submitting ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
