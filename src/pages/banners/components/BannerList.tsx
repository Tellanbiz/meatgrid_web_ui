import { Banner } from "../../../store/features/banners/bannerTypes";
import { Category } from "../../../store/features/categories/categoryTypes";
import { Tag } from "../../../store/features/tags/tagTypes";
import BannerCard from "./BannerCard";

interface BannerListProps {
  banners: Banner[];
  categories: Category[];
  tags: Tag[];
}

const BannerList = ({ banners, categories, tags }: BannerListProps) => {
  const handleEdit = (id: string) => {
    console.log("Edit banner with ID:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete banner with ID:", id);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    console.log(
      `Banner with ID ${id} is now ${active ? "Active" : "Inactive"}`
    );
  };

  const enrichedBanners = banners.map((banner) => {
    const category = categories.find(
      (category) => category.id === banner.category_id
    );
    const tag = tags.find((tag) => tag.id === banner.tag_id);

    return {
      ...banner,
      categoryName: category?.name || "Unknown Category",
      tagName: tag?.name || "Unknown Tag",
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
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      ))}
    </div>
  );
};

export default BannerList;
