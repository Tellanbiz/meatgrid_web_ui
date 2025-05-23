import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import { RouteObject } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout.js";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductsPage from "../pages/products/ProductsPage.js";
import LoginPage from "../pages/login/LoginPage.js";
import RegisterPage from "../pages/register/RegisterPage.js";
import ResetPassword from "../pages/reset-pasword/ResetPassword";
import Coupons from "../pages/coupons/Coupons";
import Recipes from "../pages/recipes/Recipes";
import AddRecipe from "../pages/recipes/AddRecipe";
import EditRecipe from "../pages/recipes/EditRecipe";
import PrivateRoute from "./PrivateRoute.js";
import OrderDetails from "../pages/orders/OrderDetails.js";
import TagsPage from "../pages/tags/TagsPage.js";
import SupplierPage from "../pages/suppliers/SupplierPage.js";
import StocksPage from "../pages/stocks/StocksPage.js";
import WareHousePage from "../pages/warehouses/WareHousePage.js";
import ManageWareHousePage from "../pages/warehouses/ManageWareHousePage.js";
import PaymentMethodsPage from "../pages/payment-methods/PaymentMethodsPage.js";
import BannersPage from "../pages/banners/BannersPage.js";
import ManageBannerPage from "../pages/banners/ManageBannerPage.js";
import ManageCategoryPage from "../pages/categories/ManageCategoryPage.js";
import CategoriesPage from "../pages/categories/CategoriesPage.js";
import StorageTypesPage from "../pages/storage-types/StorageTypesPage.js";
import ManageStorageTypesPage from "../pages/storage-types/ManageStorageTypesPage.js";
import ManageProductPage from "../pages/products/ManageProductPage.js";
import TransferStockPage from "../pages/stocks/TransferStockPage.js";
import RestockPage from "../pages/stocks/RestockPage.js";
import ProcessProductsPage from "../pages/stocks/ProcessProductsPage.js";
import SelectProductsPage from "../pages/stocks/SelectProductsPage.js";
import AccountsPage from "../pages/accounts/AccountsPage.js";
import StaffsPage from "../pages/staff/StaffsPage.js";
import RidersPage from "../pages/riders/RidersPage.js";
import EditCouponPage from "../pages/coupons/EditCouponPage.js";
import AddCouponPage from "../pages/coupons/AddCouponPage.js";
import OrdersPage from "../pages/orders/OrdersPage.js";
import AdministratorsPage from "../pages/administrators/AdministratorsPage";
import UpdateAdminPermissionsPage from "../pages/administrators/UpdateAdminPermissionsPage";
import ScheduledDeliveriesPage from "../pages/scheduled-deliveries/ScheduledDeliveriesPage.js";
import CorporateProductsPage from "../pages/products/CorporateProductsPage.js";
import OrganizationsPage from "../pages/organizations/OrganizationsPage.js";
import BatchesPage from "../pages/batches/BatchesPage";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: (
          <PrivateRoute requiredPermissions={["allow_orders_view"]}>
            <OrdersPage />
          </PrivateRoute>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <PrivateRoute requiredPermissions={["allow_orders_view"]}>
            <OrderDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "products",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_view"]}>
            <ProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "products/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_submit"]}>
            <ManageProductPage />
          </PrivateRoute>
        ),
      },
      {
        path: "products/:productId/edit",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_submit"]}>
            <ManageProductPage />
          </PrivateRoute>
        ),
      },
      {
        path: "organizations/:organizationId/products",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_view"]}>
            <CorporateProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <PrivateRoute requiredPermissions={["allow_category_view"]}>
            <CategoriesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "categories/:categoryId/edit",
        element: (
          <PrivateRoute requiredPermissions={["allow_category_submit"]}>
            <ManageCategoryPage />
          </PrivateRoute>
        ),
      },
      {
        path: "categories/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_category_submit"]}>
            <ManageCategoryPage />
          </PrivateRoute>
        ),
      },
      {
        path: "batches",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_view"]}>
            <BatchesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "coupons",
        element: (
          <PrivateRoute requiredPermissions={["allow_promotional_tag_view"]}>
            <Coupons />
          </PrivateRoute>
        ),
      },
      {
        path: "coupons/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_promotional_tag_submit"]}>
            <AddCouponPage />
          </PrivateRoute>
        ),
      },
      {
        path: "coupons/edit/:id",
        element: (
          <PrivateRoute requiredPermissions={["allow_promotional_tag_submit"]}>
            <EditCouponPage />
          </PrivateRoute>
        ),
      },
      {
        path: "recipes",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_view"]}>
            <Recipes />
          </PrivateRoute>
        ),
      },
      {
        path: "recipes/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_submit"]}>
            <AddRecipe />
          </PrivateRoute>
        ),
      },
      {
        path: "recipes/:id/edit",
        element: (
          <PrivateRoute requiredPermissions={["allow_product_submit"]}>
            <EditRecipe />
          </PrivateRoute>
        ),
      },
      {
        path: "tags",
        element: (
          <PrivateRoute requiredPermissions={["allow_promotional_tag_view"]}>
            <TagsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/banners",
        element: (
          <PrivateRoute requiredPermissions={["allow_banners_view"]}>
            <BannersPage />
          </PrivateRoute>
        ),
      },
      {
        path: "banners/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_banners_submit_view"]}>
            <ManageBannerPage />
          </PrivateRoute>
        ),
      },
      {
        path: "banners/:bannerId/edit",
        element: (
          <PrivateRoute requiredPermissions={["allow_banners_submit_view"]}>
            <ManageBannerPage />
          </PrivateRoute>
        ),
      },
      {
        path: "suppliers",
        element: (
          <PrivateRoute requiredPermissions={["allow_suppliers_view"]}>
            <SupplierPage />
          </PrivateRoute>
        ),
      },
      {
        path: "stock",
        element: (
          <PrivateRoute requiredPermissions={["allow_stock_view"]}>
            <StocksPage />
          </PrivateRoute>
        ),
      },
      {
        path: "stock/transfer",
        element: (
          <PrivateRoute requiredPermissions={["allow_stock_submit"]}>
            <TransferStockPage />
          </PrivateRoute>
        ),
      },
      {
        path: "stock/restock",
        element: (
          <PrivateRoute requiredPermissions={["allow_stock_submit"]}>
            <RestockPage />
          </PrivateRoute>
        ),
      },
      {
        path: "stock/process",
        element: (
          <PrivateRoute requiredPermissions={["allow_stock_submit"]}>
            <ProcessProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "stock/process/select-products",
        element: (
          <PrivateRoute requiredPermissions={["allow_stock_submit"]}>
            <SelectProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "warehouses",
        element: (
          <PrivateRoute requiredPermissions={["allow_warehouse_view"]}>
            <WareHousePage />
          </PrivateRoute>
        ),
      },
      {
        path: "warehouses/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_warehouse_submit"]}>
            <ManageWareHousePage />
          </PrivateRoute>
        ),
      },
      {
        path: "warehouses/:warehouseId/edit",
        element: (
          <PrivateRoute requiredPermissions={["allow_warehouse_submit"]}>
            <ManageWareHousePage />
          </PrivateRoute>
        ),
      },
      {
         path: "warehouses/:warehouseId/products",
        element: (
          <PrivateRoute requiredPermissions={["allow_warehouse_submit"]}>
            <CorporateProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-methods",
        element: (
          <PrivateRoute requiredPermissions={["allow_payment_method_view"]}>
            <PaymentMethodsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "storage-types",
        element: (
          <PrivateRoute requiredPermissions={["allow_storage_type_view"]}>
            <StorageTypesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "storage-types/new",
        element: (
          <PrivateRoute requiredPermissions={["allow_storage_type_submit"]}>
            <ManageStorageTypesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "storage-types/:storageTypeId/edit",
        element: (
          <PrivateRoute requiredPermissions={["allow_storage_type_submit"]}>
            <ManageStorageTypesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "accounts",
        element: (
          <PrivateRoute requiredPermissions={["allow_accounts_view"]}>
            <AccountsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "staffs",
        element: (
          <PrivateRoute requiredPermissions={["allow_staff_view"]}>
            <StaffsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "organizations",
        element: (
          <PrivateRoute requiredPermissions={["allow_accounts_view"]}>
            <OrganizationsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "riders",
        element: (
          <PrivateRoute requiredPermissions={["allow_riders_view"]}>
            <RidersPage />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute requiredPermissions={["allow_configuration_view"]}>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "administrators",
        element: (
          <PrivateRoute requiredPermissions={["allow_adminstrators_view"]}>
            <AdministratorsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "administrators/:userId/permissions",
        element: (
          <PrivateRoute requiredPermissions={["allow_adminstrators_submit"]}>
            <UpdateAdminPermissionsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "scheduled-deliveries",
        element: (
          <PrivateRoute requiredPermissions={["allow_orders_view"]}>
            <ScheduledDeliveriesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
