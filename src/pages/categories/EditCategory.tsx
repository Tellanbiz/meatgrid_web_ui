import EditCategoryPage from "./components/EditCategoryPage";
import Breadcrumbs from "../../components/breadcrumbs";

const EditCategory = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-2 sticky top-15 z-10 bg-background">
        <Breadcrumbs
          items={[
            {
              label: "Categories",
              to: "/categories",
            },
            {
              label: "Edit Category",
              isPage: true,
            },
          ]}
        />
      </div>

      <div className="mt-4">
        <EditCategoryPage />
      </div>
    </div>
  );
};

export default EditCategory;
