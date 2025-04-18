"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  tagId: string | null;
  onDelete: (id: string) => void;
}

export default function DeleteTagModal({ open, onClose, tagId, onDelete }: Props) {

  const [isLoading,setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/delete-tag/${tagId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete tag");

      toast.success("Tag deleted successfully");
      onDelete(tagId!);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting tag");
    } finally{
        setIsLoading(false)
    }   
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this tag? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button disabled={isLoading} variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
