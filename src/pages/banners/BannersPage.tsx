import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectBanners,
  selectIsFetchingBanners,
} from "../../store/features/banners/bannerSelectors";
import { selectTags } from "../../store/features/tags/tagSelectors";
import LoadingPage from "../../components/LoadingPage";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import {
  fetchBanners,
  deleteBanner,
  toggleBannerActive,
} from "../../store/features/banners/bannerThunks";
import { fetchTags } from "../../store/features/tags/tagThunks";
import { selectCategories } from "../../store/features/categories/categorySelectors";
import { fetchCategories } from "../../store/features/categories/categoryThunks";
import { useNavigate } from "react-router-dom";
import BannerList from "./components/BannerList";

const BannersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const categories = useAppSelector(selectCategories);
  const tags = useAppSelector(selectTags);
  const isFetching = useAppSelector(selectIsFetchingBanners);

  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    dispatch(fetchBanners());
  };

  const handleEdit = (id: string) => {
    navigate(`/banners/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate("/banners/new");
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteBanner(id));
    handleRefresh();
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setToggleLoadingId(id);
    await dispatch(toggleBannerActive({ id, active }));
    setToggleLoadingId(null);
    handleRefresh();
  };

  return (
    <div className="h-full overflow-hidden p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Banners</h1>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="w-4 h-4" />
            Add Banner
          </Button>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        {isFetching ? (
          <LoadingPage />
        ) : (
          <BannerList
            banners={banners}
            categories={categories}
            tags={tags}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            toggleLoadingId={toggleLoadingId}
          />
        )}
      </div>
    </div>
  );
};

export default BannersPage;
