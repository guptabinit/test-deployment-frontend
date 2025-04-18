"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";

const tagFormSchema = z.object({
  tagName: z.string().min(1, "Tag name is required"),
  tagDesc: z.string().optional(),
});

interface TagFormProps {
  onClose: () => void;
  onSubmit: (data: {
    tagName: string;
    tagDesc?: string;
  }) => void;
}

export default function TagForm({ onClose, onSubmit }: TagFormProps) {
  const [formData, setFormData] = useState({
    tagName: "",
    tagDesc: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = tagFormSchema.parse(formData);
      await onSubmit(validatedData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to create tag");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Tag</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <FiX size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tagName">Tag Name</Label>
            <Input
              id="tagName"
              placeholder="Enter tag name"
              value={formData.tagName}
              onChange={(e) =>
                setFormData({ ...formData, tagName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagDesc">Tag Description</Label>
            <Input
              id="tagDesc"
              placeholder="Enter tag description"
              value={formData.tagDesc}
              onChange={(e) =>
                setFormData({ ...formData, tagDesc: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" disabled={loading} onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Create Tag
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
