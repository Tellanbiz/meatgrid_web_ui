import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Tag } from "../../../store/features/tags/tagTypes";
import TagModal, { TagFormValues } from "./TagModal";
import LoadingPage from "../../../components/LoadingPage";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toast } from "sonner";
import {
  fetchTags,
  updateTag,
  deleteTag,
} from "../../../store/features/tags/tagThunks";
import { UpdateTagRequest } from "../../../store/features/tags/request/UdateTagRequest";
import {
  selectIsFetchingTags,
  selectIsDeletingTag,
} from "../../../store/features/tags/tagSelectors";
import DeleteDialog from "../../../components/DeleteDialog";
import { Button } from "../../../components/ui/button";

const TagsTable = () => {
  const dispatch = useAppDispatch();

  const { tags, status, error, currentOperation, successMessage } =
    useAppSelector((state) => state.tags);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const isFetchingTags = useAppSelector(selectIsFetchingTags);
  const isDeletingTag = useAppSelector(selectIsDeletingTag);

  useEffect(() => {
    if (!currentOperation) return;

    if (currentOperation === "update") {
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
    } else if (currentOperation === "delete") {
      switch (status) {
        case "failed":
          toast.error(error);
          break;
        case "succeeded":
          toast.success(successMessage);
          setDeleteDialogOpen(false);
          setTagToDelete(null);
          dispatch(fetchTags());
          break;
      }
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

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tagToDelete?.id) {
      dispatch(deleteTag(tagToDelete.id));
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
            className="p-4 relative flex flex-col gap-y-1 min-h-[30px]"
          >
            <div className="space-y-2">
              <h2 className="text-sm">{tag.name}</h2>
              <p className="text-sm text-muted-foreground">
                Priority: {tag.priority}
              </p>
              <p className="text-sm text-muted-foreground">
                Promotional Price: {tag.promotional_price}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Mobile:{" "}
                {tag.is_mobile ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                POS:{" "}
                {tag.is_pos ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </p>
            </div>

            <div className="flex gap-x-1 justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditModal(tag)}
              >
                <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(tag)}
              >
                <Trash2 className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-700" />
              </Button>
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

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${tagToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeletingTag}
      />
    </>
  );
};

export default TagsTable;
