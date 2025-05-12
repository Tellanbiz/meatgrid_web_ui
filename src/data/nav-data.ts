export const data = {
  company: {
    name: "MeatGrid",
    logo: "/images/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: "solar:home-2-bold-duotone",
      isActive: true,
      items: [{ title: "Dashboard", url: "/" }],
    },
    {
      title: "Product Management",
      url: "#",
      icon: "solar:box-bold-duotone",
      isActive: true,
      items: [
        { title: "Products", url: "/products", icon: "solar:tag-bold-duotone" },
        { title: "Categories", url: "/categories", icon: "solar:folder-bold-duotone" },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: "solar:cart-large-bold-duotone",
      isActive: true,
      items: [
        { title: "Orders", url: "/orders" },
        { title: "Payment Methods", url: "/payment-methods" },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: "solar:shop-bold-duotone",
      isActive: true,
      items: [
        { title: "Stock", url: "/stock" },
        { title: "Suppliers", url: "/suppliers" },
        { title: "Warehouses", url: "/warehouses" },
        { title: "Storage Types", url: "/storage-types" },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: "solar:tag-price-bold-duotone",
      isActive: true,
      items: [
        { title: "Recipes", url: "/recipes", icon: "solar:book-open-bold-duotone" },
        { title: "Coupons", url: "/coupons", icon: "solar:star-bold-duotone" },
        { title: "Banners", url: "/banners" },
        { title: "Promotion Tags", url: "/tags" },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: "solar:users-group-rounded-bold-duotone",
      items: [
        { title: "Accounts", url: "/accounts" },
        { title: "Staff Members", url: "/staffs" },
        { title: "Riders", url: "/riders" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "solar:settings-bold-duotone",
      items: [
        { title: "Personal Settings", url: "/personal-settings", icon: "solar:user-bold-duotone" },
        { title: "Global Settings", url: "/global-settings", icon: "solar:settings-bold-duotone" },
      ],
    },
  ],
}; 