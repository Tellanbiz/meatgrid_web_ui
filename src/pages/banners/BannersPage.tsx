import { useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import BannerList from "./components/BannerList";
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
    <div>
      <div className="flex justify-between items-center py-2 sticky top-15 z-10 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Banners",
              to: "/banners",
            },
            {
              label: "Manage Banners",
              isPage: true,
            },
          ]}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isFetching && "animate-spin"}`}
            />
            Refresh
          </Button>
          <Button variant="default" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Banner</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
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
