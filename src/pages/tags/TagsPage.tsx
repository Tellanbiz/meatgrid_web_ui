import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTags, createTag } from "../../store/features/tags/tagThunks";
import TagsTable from "./components/TagsTable";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import {
  selectIsCreatingTag,
  selectIsFetchingTags,
} from "../../store/features/tags/tagSelectors";
import TagModal, { TagFormValues } from "./components/TagModal";
import { Tag } from "../../store/features/tags/tagTypes";
import { CreateTagRequest } from "../../store/features/tags/request/CreateTagRequest";

const TagsPage = () => {
  const dispatch = useAppDispatch();
  const isFetchingTags = useAppSelector(selectIsFetchingTags);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const isCreateTagLoading = useAppSelector(selectIsCreatingTag);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchTags());
  };

  const handleAddTag = () => {
    setSelectedTag(null);
    setIsTagModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTagModalOpen(false);
    setSelectedTag(null);
  };

  const handleSubmitTag = (values: TagFormValues) => {
    const createTagRequest: CreateTagRequest = {
      name: values.name,
      promotional_price: values.promotional_price,
      priority: values.priority,
      is_pos: values.is_pos,
      is_mobile: values.is_mobile,
    };

    dispatch(createTag(createTagRequest));
  };

  return (
    <>
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <h4 className="text-base font-bold">Tags</h4>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${isFetchingTags && "animate-spin"}`}
            />
            Refresh
          </Button>

          <Button variant="default" size="sm" onClick={handleAddTag}>
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Tag</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TagsTable />
      </div>

      {isTagModalOpen && (
        <TagModal
          isLoading={isCreateTagLoading}
          open={isTagModalOpen}
          onClose={handleCloseModal}
          tag={selectedTag}
          onSubmit={handleSubmitTag}
        />
      )}
    </>
  );
};

export default TagsPage;
