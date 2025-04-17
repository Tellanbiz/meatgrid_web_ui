import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { fetchTags } from "../../store/features/tags/tagThunks";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import { FiPlus } from "react-icons/fi";
import TagsTable from "./components/TagsTable";

const TagsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchTags());
  };

  return (
    <>
      <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
        <h4 className="text-base font-bold">Tags</h4>

        <div className="flex space-x-2">
          <SecondaryButton
            text="Refresh"
            className="mr-2 font-bold"
            onClick={handleRefresh}
          />

          <PrimaryButton
            text="Add New Tag"
            className="font-bold"
            icon={<FiPlus />}
            onClick={() => console.log("Add New Tag Clicked")}
          />
        </div>
      </div>

      <div className="mt-4 rounded">
        <TagsTable />
      </div>
    </>
  );
};

export default TagsPage;
