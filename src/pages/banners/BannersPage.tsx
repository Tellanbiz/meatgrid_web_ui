import Breadcrumbs from "../../components/breadcrumbs";
import BannerList from "./components/BannerList";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectBanners,
  selectIsFetchingBanners,
} from "../../store/features/banners/bannerSelectors";
import LoadingPage from "../../components/LoadingPage";
import { Button } from "../../components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { fetchBanners } from "../../store/features/banners/bannerThunks";

const BannersPage = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const isFetching = useAppSelector(selectIsFetchingBanners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchBanners());
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
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isFetching && "animate-spin"}`}
            />
            Refresh
          </Button>
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Banner</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {isFetching ? <LoadingPage /> : <BannerList banners={banners} />}
      </div>
    </div>
  );
};

export default BannersPage;
