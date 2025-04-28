import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Tag } from "../../../store/features/tags/tagTypes";
import TagModal, { TagFormValues } from "./TagModal";
import LoadingPage from "../../../components/LoadingPage";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toast } from "sonner";
import { fetchTags, updateTag } from "../../../store/features/tags/tagThunks";
import { UpdateTagRequest } from "../../../store/features/tags/request/UdateTagRequest";
import { selectIsFetchingTags } from "../../../store/features/tags/tagSelectors";

const TagsTable = () => {
  const dispatch = useAppDispatch();

  const { tags, status, error, currentOperation, successMessage } =
    useAppSelector((state) => state.tags);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const isFetchingTags = useAppSelector(selectIsFetchingTags);

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

  const handleUpdateTag = (values: TagFormValues) => {
    if (selectedTag?.id) {
      const updateTagRequest: UpdateTagRequest = {
        id: selectedTag.id,
        name: values.name,
        promotional_price: values.promotional_price,
        priority: values.priority,
        is_pos: values.is_pos,
        is_mobile: values.is_mobile,
      };

      dispatch(updateTag(updateTagRequest));
    }
  };

  if (isFetchingTags) return <LoadingPage />;

  if (status === "failed" && currentOperation === "fetch")
    return <p className="text-red-500">Error loading tags.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <Card
            key={tag.id}
            className="p-4 relative flex flex-col justify-between min-h-[30px]"
          >
            <div className="space-y-2">
              <h2 className="text-sm">{tag.name}</h2>
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

            <div className="flex gap-3 justify-end mt-1">
              <Pencil
                className="w-4 h-4 ml-5 cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => openEditModal(tag)}
              />
              <Trash2 className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-700" />
            </div>
          </Card>
        ))}
      </div>

      {selectedTag && (
        <TagModal
          isLoading={isUpdating}
          open={editModalOpen}
          onClose={closeEditModal}
          tag={selectedTag}
          onSubmit={handleUpdateTag}
        />
      )}
    </>
  );
};

export default TagsTable;
