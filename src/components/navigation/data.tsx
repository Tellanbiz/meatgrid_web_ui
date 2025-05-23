export const sidebarData = {
  company: {
    name: "MeatGrid",
    logo: "/images/logo.png",
  },
  navMain: [
    {
      title: "General",
      url: "#",
      icon: "solar:box-bold-duotone",
      isActive: true,
      requiredPermissions: ["allow_product_view", "allow_category_view"],
      requireAll: false,
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: "solar:home-2-bold-duotone",
          isActive: true,
        },
      ],
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
          requiredPermissions: ["allow_product_view"],
        },
        {
          title: "Categories",
          url: "/categories",
          icon: "solar:folder-bold-duotone",
          requiredPermissions: ["allow_category_view"],
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
          icon: "solar:cart-bold-duotone",
          requiredPermissions: ["allow_orders_view"],
        },
        {
          title: "Payment Methods",
          url: "/payment-methods",
          icon: "solar:card-bold-duotone",
          requiredPermissions: ["allow_payment_method_view"],
        },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: "solar:shop-bold-duotone",
      isActive: true,
      requiredPermissions: [
        "allow_stock_view",
        "allow_suppliers_view",
        "allow_warehouse_view",
        "allow_storage_type_view",
      ],
      requireAll: false,
      items: [
        {
          title: "Stock",
          url: "/stock",
          icon: "solar:box-bold-duotone",
          requiredPermissions: ["allow_stock_view"],
        },
        {
          title: "Batches",
          url: "/batches",
          icon: "solar:box-minimalistic-bold-duotone",
          requiredPermissions: ["allow_product_view"],
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          icon: "solar:users-group-rounded-bold-duotone",
          requiredPermissions: ["allow_suppliers_view"],
        },
        {
          title: "Warehouses",
          url: "/warehouses",
          icon: "solar:buildings-3-bold-duotone",
          requiredPermissions: ["allow_warehouse_view"],
        },
        {
          title: "Storage Types",
          url: "/storage-types",
          icon: "solar:archive-bold-duotone",
          requiredPermissions: ["allow_storage_type_view"],
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
          icon: "solar:book-open-bold-duotone",
        },
        {
          title: "Coupons",
          url: "/coupons",
          icon: "solar:star-bold-duotone",
        },
        {
          title: "Banners",
          url: "/banners",
          icon: "solar:bill-list-bold-duotone",
          requiredPermissions: ["allow_banners_view"],
        },
        {
          title: "Promotion Tags",
          url: "/tags",
          icon: "solar:tag-bold-duotone",
          requiredPermissions: ["allow_promotional_tag_view"],
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: "solar:users-group-rounded-bold-duotone",
      requiredPermissions: [
        "allow_accounts_view",
        "allow_staff_view",
        "allow_riders_view",
      ],
      requireAll: false,
      items: [
        {
          title: "Accounts",
          url: "/accounts",
          icon: "solar:user-bold-duotone",
          requiredPermissions: ["allow_accounts_view"],
        },
        {
          title: "Administrators",
          url: "/administrators",
          icon: "solar:user-bold-duotone",
          requiredPermissions: ["allow_adminstrators_view"],
        },
        {
          title: "Staff Members",
          url: "/staffs",
          icon: "solar:user-bold-duotone",
          requiredPermissions: ["allow_staff_view"],
        },
        {
          title: "Organizations",
          url: "/organizations",
          icon: "solar:buildings-3-bold-duotone",
          requiredPermissions: ["allow_accounts_view"],
        },
        {
          title: "Riders",
          url: "/riders",
          icon: "solar:user-bold-duotone",
          requiredPermissions: ["allow_riders_view"],
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "solar:settings-bold-duotone",
      items: [
        {
          title: "Delivery Schedules",
          url: "/delivery-schedules",
          icon: "solar:calendar-bold-duotone",
          requiredPermissions: ["allow_configuration_view"],
        },
      ],
    },
  ],
};
