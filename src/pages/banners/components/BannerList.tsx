import { Banner } from "../../../store/features/banners/bannerTypes";
import { Category } from "../../../store/features/categories/categoryTypes";
import { Tag } from "../../../store/features/tags/tagTypes";
import BannerCard from "./BannerCard";

interface BannerListProps {
  banners: Banner[];
  categories: Category[];
  tags: Tag[];
  toggleLoadingId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  
}

const BannerList = ({
  banners,
  categories,
  tags,
  toggleLoadingId,
  onEdit,
  onDelete,
  onToggleActive,
}: BannerListProps) => {
  const enrichedBanners = banners.map((banner) => {
    const category = categories.find(
      (category) => category.id === banner.category_id
    );
    const tag = tags.find((tag) => tag.id === banner.tag_id);

    return {
      ...banner,
      categoryName: category?.name || "Unknown Category",
      tagName: tag?.name || "Unknown Tag",
      toggleActiveLoading: toggleLoadingId === banner.id,
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {enrichedBanners.map((banner) => (
        <BannerCard
          key={banner.id}
          id={banner.id}
          name={banner.name}
          imageUrl={banner.image}
          active={banner.active}
          categoryName={banner.categoryName}
          tagName={banner.tagName}
          toggleActiveLoading={banner.toggleActiveLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default BannerList;
