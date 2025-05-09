import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import { RouteObject } from "react-router-dom";
import MainLayout from "../components/MainLayout.js";
import Dashboard from "../pages/dashboard/Dashboard";
import Orders from "../pages/orders/Orders";
import Products from "../pages/products/Products";
import Reports from "../pages/reports/Reports.jsx";
import LoginPage from "../pages/login/LoginPage.js";
import RegisterPage from "../pages/register/RegisterPage.js";
import ResetPassword from "../pages/reset-pasword/ResetPassword";
import Coupons from "../pages/coupons/Coupons";
import AddCoupon from "../pages/coupons/AddCoupon";
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
        element: <Orders />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetails />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/new",
        element: <ManageProductPage />,
      },
      {
        path: "products/:productId/edit",
        element: <ManageProductPage />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "categories/:categoryId/edit",
        element: <ManageCategoryPage />,
      },
      {
        path: "categories/new",
        element: <ManageCategoryPage />,
      },
      {
        path: "coupons",
        element: <Coupons />,
      },
      {
        path: "recipes",
        element: <Recipes />,
      },
      {
        path: "recipes/new",
        element: <AddRecipe />,
      },
      {
        path: "recipes/:id/edit",
        element: <EditRecipe />,
      },

      {
        path: "coupons/new",
        element: <AddCoupon />,
      },
      {
        path: "tags",
        element: <TagsPage />,
      },
      {
        path: "/banners",
        element: <BannersPage />,
      },
      {
        path: "banners/new",
        element: <ManageBannerPage />,
      },
      {
        path: "banners/:bannerId/edit",
        element: <ManageBannerPage />,
      },
      {
        path: "suppliers",
        element: <SupplierPage />,
      },
      {
        path: "stock",
        element: <StocksPage />,
      },
      {
        path: "stock/transfer",
        element: <TransferStockPage />,
      },
      {
        path: "stock/restock",
        element: <RestockPage />,
      },
      {
        path: "stock/process",
        element: <ProcessProductsPage />,
      },
      {
        path: "stock/process/select-products",
        element: <SelectProductsPage />,
      },
      {
        path: "warehouses",
        element: <WareHousePage />,
      },
      {
        path: "warehouses/new",
        element: <ManageWareHousePage />,
      },
      {
        path: "warehouses/:warehouseId/edit",
        element: <ManageWareHousePage />,
      },
      {
        path: "payment-methods",
        element: <PaymentMethodsPage />,
      },
      {
        path: "storage-types",
        element: <StorageTypesPage />,
      },
      {
        path: "storage-types/new",
        element: <ManageStorageTypesPage />,
      },

      {
        path: "storage-types/:storageTypeId/edit",
        element: <ManageStorageTypesPage />,
      },
      {
        path: "accounts",
        element: <AccountsPage />,
      },
      {
        path: "staffs",
        element: <StaffsPage />,
      },
      {
        path: "riders",
        element: <RidersPage />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
