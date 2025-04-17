import { JSX } from "react";
import NavigationItem from "./NavigationItem";
import {
  FiHome,
  FiTag,
  FiUsers,
  FiBarChart2,
  FiBook,
  FiBell,
  FiSettings,
  FiUser,
  FiFolder,
  FiList,
  FiStar,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";
import { Tags } from "lucide-react";

type MenuItem = {
  name?: string;
  path?: string;
  icon?: JSX.Element;
  trailingText?: string;
  divider?: string;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/", icon: <FiHome /> },
  { name: "Orders", path: "/orders", icon: <FiList />, trailingText: "16" },
  { name: "Products", path: "/products", icon: <FiTag /> },
  { name: "Categories", path: "/categories", icon: <FiFolder /> },
  { name: "Customers", path: "/customers", icon: <FiUsers /> },
  { name: "Reports", path: "/reports", icon: <FiBarChart2 /> },
  { name: "Coupons", path: "/coupons", icon: <FiStar /> },
  { name: "Recipes", path: "/recipes", icon: <FiBookOpen /> },
  { name: "Inbox", path: "/inbox", icon: <FiMessageSquare /> },
  { divider: "Marketting" },
  { name: "Promotion Tags", path: "/tags", icon: <Tags /> },
  { divider: "Other Information" },
  { name: "Knowledge Base", path: "/knowledge-base", icon: <FiBook /> },
  { name: "Product Updates", path: "/product-updates", icon: <FiBell /> },
  { divider: "Settings" },
  { name: "Personal Settings", path: "/personal-settings", icon: <FiUser /> },
  { name: "Global Settings", path: "/global-settings", icon: <FiSettings /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-primary-500 text-white h-full overflow-y-auto scrollbar-hide p-4">
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item, index) =>
          item.divider ? (
            <div
              key={`divider-${index}`}
              className="text-gray-400 text-xs font-semibold mt-4 mb-2"
            >
              {item.divider}
            </div>
          ) : (
            <NavigationItem
              key={item.path || `item-${index}`}
              to={item.path || "/"}
              icon={item.icon}
              text={item.name || "Unknown"}
              trailingText={item.trailingText}
            />
          )
        )}
      </nav>
    </aside>
  );
}
