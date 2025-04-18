"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import TagForm from "./_components/tag-form";
import { fetchWithAuth } from "../../_lib/fetch-with-auth";
import { Tag } from "@/types/Tag";
import { Button } from "@/components/ui/button";
import EditTagModal from "./_components/edit-tag";
import { FaSpinner } from "react-icons/fa";
import DeleteTagModal from "./_components/delete-tag";

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "Invalid date";
  }
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [extras, setExtras] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-all-tags`);
        const data = await res.json();

        if (res.ok && Array.isArray(data.tags)) {
          const coreData: Tag[] = data.tags.map((tag: any) => ({
            _id: tag._id,
            tagName: tag.tagName,
            tagDesc: tag.tagDesc,
            hotelId: tag.hotelId,
          }));

          const extraData: Record<string, any> = {};
          data.tags.forEach((tag: any) => {
            extraData[tag._id] = {
              updatedAt: tag.updatedAt ?? null,
            };
          });

          setTags(coreData);
          setExtras(extraData);
        } else {
          toast.error("Failed to load tags");
        }
      } catch (err) {
        toast.error("Error fetching tags");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-tag`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to create tag");

      const resData = await response.json();
      if (!resData?.tag) throw new Error("Invalid response");

      const { _id, tagName, tagDesc, hotelId, updatedAt } = resData.tag;
      const newTag: Tag = { _id, tagName, tagDesc, hotelId };

      setTags((prev) => [...prev, newTag]);
      setExtras((prev) => ({
        ...prev,
        [_id]: { updatedAt },
      }));

      toast.success("Tag created successfully!");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    }
  };

  const handleDelete = async (tagId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tag?");
    if (!confirmDelete) return;

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/delete-tag/${tagId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete tag");

      setTags((prev) => prev.filter((tag) => tag._id.toString() !== tagId));
      setExtras((prev) => {
        const updated = { ...prev };
        delete updated[tagId];
        return updated;
      });

      toast.success("Tag deleted successfully!");
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if(isLoading)
    return(
      <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
      <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
    </div>
    )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Menu: <span className="text-gray-600">Tags</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize tags for your menu items
          </p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
        >
          Add New Tag
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <TagForm onClose={() => setShowAddForm(false)} onSubmit={handleSubmit} />
      )}

      {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border text-xs font-medium text-gray-500">Tag Name</th>
                <th className="px-4 py-2 border text-xs font-medium text-gray-500">Description</th>
                <th className="px-4 py-2 border text-xs font-medium text-gray-500">Last Updated</th>
                <th className="px-4 py-2 border text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTags.map((tag) => {
                const extra = extras[tag._id.toString()] || {};
                return (
                  <tr key={tag._id.toString()} className="border hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium">{tag.tagName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{tag.tagDesc}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      {formatDate(extra.updatedAt)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTag(tag);
                            setEditModalOpen(true);
                          }}
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTag(tag);
                            setDeleteModalOpen(true);
                          }}
                          className="text-destructive"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      <EditTagModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tag={selectedTag}
        onUpdate={(updated) => {
          setTags((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        }}
      />

      <DeleteTagModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        tagId={String(selectedTag?._id) || null}
        onDelete={(deletedId) => {
          setTags((prev) => prev.filter((tag) => String(tag._id) !== deletedId));
          const newExtras = { ...extras };
          delete newExtras[deletedId];
          setExtras(newExtras);
        }}
      />
    </div>
  );
}
