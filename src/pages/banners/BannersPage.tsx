import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectBanners,
  selectIsFetchingBanners,
  selectIsDeletingBanner,
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
import DeleteDialog from "../../components/DeleteDialog";
import { Banner } from "../../store/features/banners/bannerTypes";
import { toast } from "sonner";
import { useModal } from "../../hooks/use-modal";

const BannersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const categories = useAppSelector(selectCategories);
  const tags = useAppSelector(selectTags);
  const isFetchingBanners = useAppSelector(selectIsFetchingBanners);
  const isDeleting = useAppSelector(selectIsDeletingBanner);

  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useModal();
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

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

  const handleDeleteClick = (bannerId: string) => {
    const banner = banners.find((b) => b.id === bannerId);
    if (banner) {
      setBannerToDelete(banner);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (bannerToDelete?.id) {
      try {
        await dispatch(deleteBanner(bannerToDelete.id)).unwrap();
        toast.success("Banner deleted successfully");
        handleRefresh();
      } catch {
        toast.error("Failed to delete banner");
      }
    }
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
            disabled={isFetchingBanners}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingBanners ? "animate-spin" : ""}`}
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
        {isFetchingBanners ? (
          <LoadingPage />
        ) : (
          <BannerList
            banners={banners}
            categories={categories}
            tags={tags}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleActive={handleToggleActive}
            toggleLoadingId={toggleLoadingId}
          />
        )}
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Banner"
        description={`Are you sure you want to delete this banner? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BannersPage;
