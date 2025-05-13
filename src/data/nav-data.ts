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
    },
    {
      title: "Product Management",
      url: "#",
      icon: "solar:box-bold-duotone",
      isActive: true,
      requiredPermissions: ["allow_product_view", "allow_category_view"],
      requireAll: false,
      items: [
        { 
          title: "Products", 
          url: "/products", 
          icon: "solar:tag-bold-duotone",
          requiredPermissions: ["allow_product_view"]
        },
        { 
          title: "Categories", 
          url: "/categories", 
          icon: "solar:folder-bold-duotone",
          requiredPermissions: ["allow_category_view"]
        },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: "solar:cart-large-bold-duotone",
      isActive: true,
      requiredPermissions: ["allow_orders_view", "allow_payment_method_view"],
      requireAll: false,
      items: [
        { 
          title: "Orders", 
          url: "/orders",
          requiredPermissions: ["allow_orders_view"]
        },
        { 
          title: "Payment Methods", 
          url: "/payment-methods",
          requiredPermissions: ["allow_payment_method_view"]
        },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: "solar:shop-bold-duotone",
      isActive: true,
      requiredPermissions: ["allow_stock_view", "allow_suppliers_view", "allow_warehouse_view", "allow_storage_type_view"],
      requireAll: false,
      items: [
        { 
          title: "Stock", 
          url: "/stock",
          requiredPermissions: ["allow_stock_view"]
        },
        { 
          title: "Suppliers", 
          url: "/suppliers",
          requiredPermissions: ["allow_suppliers_view"]
        },
        { 
          title: "Warehouses", 
          url: "/warehouses",
          requiredPermissions: ["allow_warehouse_view"]
        },
        { 
          title: "Storage Types", 
          url: "/storage-types",
          requiredPermissions: ["allow_storage_type_view"]
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: "solar:tag-price-bold-duotone",
      isActive: true,
      requiredPermissions: ["allow_banners_view", "allow_promotional_tag_view"],
      requireAll: false,
      items: [
        { 
          title: "Recipes", 
          url: "/recipes", 
          icon: "solar:book-open-bold-duotone"
        },
        { 
          title: "Coupons", 
          url: "/coupons", 
          icon: "solar:star-bold-duotone"
        },
        { 
          title: "Banners", 
          url: "/banners",
          requiredPermissions: ["allow_banners_view"]
        },
        { 
          title: "Promotion Tags", 
          url: "/tags",
          requiredPermissions: ["allow_promotional_tag_view"]
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: "solar:users-group-rounded-bold-duotone",
      requiredPermissions: ["allow_accounts_view", "allow_staff_view", "allow_riders_view"],
      requireAll: false,
      items: [
        { 
          title: "Accounts", 
          url: "/accounts",
          requiredPermissions: ["allow_accounts_view"]
        },
        { 
          title: "Staff Members", 
          url: "/staffs",
          requiredPermissions: ["allow_staff_view"]
        },
        { 
          title: "Riders", 
          url: "/riders",
          requiredPermissions: ["allow_riders_view"]
        },
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