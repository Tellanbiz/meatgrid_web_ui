import { Plus } from "lucide-react";
import Breadcrumbs from "../../components/breadcrumbs";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import StocksTable from "./components/StocksTable";

const StocksPage = () => {
  return (
    <>
      <div className="h-full overflow-hidden">
        <div className="flex justify-between items-center py-2 sticky top-0 z-10 bg-background">
          <Breadcrumbs
            items={[
              {
                label: "Products",
                isPage: true,
              },
            ]}
          />
          <div className="flex space-x-2">
            <SecondaryButton
              text="Export"
              className="mr-2 font-bold"
              onClick={() => null}
            />

            <PrimaryButton
              text="Add Product"
              className="font-bold"
              icon={<Plus />}
              onClick={() => null}
            />
          </div>
        </div>

        <div className="mt-4">
          <StocksTable />
        </div>
      </div>
    </>
  );
};

export default StocksPage;
