import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import { RouteObject } from "react-router-dom";
import MainLayout from "../components/MainLayout.js";
import Dashboard from "../pages/dashboard/Dashboard";
import Orders from "../pages/orders/Orders";
import Products from "../pages/products/Products";
import Reports from "../pages/reports/Reports.jsx";
import Categories from "../pages/categories/Categories.js";
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
import EditCategory from "../pages/categories/EditCategory.js";

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
        path: "reports",
        element: <Reports />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/:categoryId/edit",
        element: <EditCategory />,
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
