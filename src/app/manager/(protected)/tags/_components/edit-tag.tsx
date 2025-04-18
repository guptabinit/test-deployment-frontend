"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { Tag } from "@/types/Tag";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";

const schema = z.object({
  tagName: z.string().min(1, "Tag name is required"),
  tagDesc: z.string().optional(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
  onUpdate: (updated: Tag) => void;
}

export default function EditTagModal({ open, onClose, tag, onUpdate }: Props) {
  const [form, setForm] = useState({ tagName: "", tagDesc: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tag) {
      setForm({ tagName: tag.tagName, tagDesc: tag.tagDesc || "" });
    }
  }, [tag]);

  const handleUpdate = async () => {
    try {
      const validated = schema.parse(form);
      setLoading(true);
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-tag/${tag?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      onUpdate(data.tag);
      toast.success("Tag updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tag Name</Label>
            <Input
              value={form.tagName}
              onChange={(e) => setForm({ ...form, tagName: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.tagDesc}
              onChange={(e) => setForm({ ...form, tagDesc: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
