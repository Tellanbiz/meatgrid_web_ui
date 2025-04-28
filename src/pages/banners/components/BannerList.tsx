import { Banner } from "../../../store/features/banners/bannerTypes";
import BannerCard from "./BannerCard";

interface BannerListProps {
  banners: Banner[];
}

const BannerList = ({ banners }: BannerListProps) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {banners.map((banner) => (
        <BannerCard
          key={banner.id}
          id={banner.id}
          name={banner.name}
          imageUrl={banner.image}
          active={banner.active}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      ))}
    </div>
  );
};

export default BannerList;
