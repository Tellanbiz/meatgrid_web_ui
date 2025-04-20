import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Tag } from "../../../store/features/tags/tagTypes";
import EditTagModal from "./EditTagModal";
import LoadingPage from "../../../components/LoadingPage";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toast } from "sonner";
import { fetchTags, updateTag } from "../../../store/features/tags/tagThunks";
import { Switch } from "../../../components/ui/switch";
import Loader from "../../../components/Loader";

const TagsTable = () => {
  const dispatch = useAppDispatch();

  const { tags, status, error, currentOperation, successMessage } =
    useAppSelector((state) => state.tags);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentOperation !== "update") return;

    switch (status) {
      case "loading":
        setIsUpdating(true);
        break;
      case "failed":
        setIsUpdating(false);
        toast.error(error);
        break;
      case "succeeded":
        setIsUpdating(false);
        setEditModalOpen(false);
        toast.success(successMessage);
        dispatch(fetchTags());
        break;
    }
  }, [status, error, currentOperation, successMessage, dispatch]);

  const openEditModal = (tag: Tag) => {
    setSelectedTag(tag);
    setEditModalOpen(true);
  };

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedTag(null);
  }, []);

  const handleToggleActive = (tag: Tag, checked: boolean) => {
    setUpdatingIds((prev) => new Set(prev).add(tag.id));

    dispatch(
      updateTag({
        ...tag,
        active: checked,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Tag status updated");
      })
      .catch((err) => {
        toast.error("Failed to update tag: " + err.message);
      })
      .finally(() => {
        setUpdatingIds((prev) => {
          const updated = new Set(prev);
          updated.delete(tag.id);
          return updated;
        });
      });
  };

  if (status === "loading" && currentOperation === "fetch")
    return <LoadingPage />;
  if (status === "failed" && currentOperation === "fetch")
    return <p className="text-red-500">Error loading tags.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <Card
            key={tag.id}
            className="p-4 relative flex flex-col justify-between min-h-[50px]"
          >
            <div className="space-y-2">
              <h2 className="text-sm font-semibold">{tag.name}</h2>
              <p className="text-sm text-muted-foreground">
                Priority: {tag.priority}
              </p>
              <p className="text-sm text-muted-foreground">
                Promotional Price: {tag.promotional_price}
              </p>
              <p className="text-sm text-muted-foreground">
                Mobile: {tag.is_mobile ? "Yes" : "No"}
              </p>
              <p className="text-sm text-muted-foreground">
                POS: {tag.is_pos ? "Yes" : "No"}
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-4">
              {updatingIds.has(tag.id) ? (
                <Loader size={22} />
              ) : (
                <Switch
                  checked={tag.active}
                  onCheckedChange={(checked) =>
                    handleToggleActive(tag, checked)
                  }
                />
              )}

              <Pencil
                className="w-5 h-5 ml-5 cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => openEditModal(tag)}
              />
              <Trash2 className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700" />
            </div>
          </Card>
        ))}
      </div>

      {selectedTag && (
        <EditTagModal
          isUpdating={isUpdating}
          open={editModalOpen}
          onClose={closeEditModal}
          tag={selectedTag}
        />
      )}
    </>
  );
};

export default TagsTable;
