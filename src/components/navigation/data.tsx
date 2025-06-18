export const sidebarData = {
  company: {
    name: "MeatGrid",
    logo: "/images/logo.png",
  },
  navMain: [
    {
      title: "General",
      url: "#",
      icon: "solar:home-smile-linear",
      isActive: true,
      requiredPermissions: ["allow_product_view", "allow_category_view"],
      requireAll: false,
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: "solar:home-2-linear",
          isActive: true,
        },
      ],
    },
    {
      title: "Product Management",
      url: "#",
      icon: "solar:box-linear",
      isActive: true,
      requiredPermissions: ["allow_product_view", "allow_category_view"],
      requireAll: false,
      items: [
        {
          title: "Products",
          url: "/products",
          icon: "solar:tag-price-linear",
          requiredPermissions: ["allow_product_view"],
        },
        {
          title: "Categories",
          url: "/categories",
          icon: "solar:folder-with-files-linear",
          requiredPermissions: ["allow_category_view"],
        },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: "solar:cart-large-linear",
      isActive: true,
      requiredPermissions: ["allow_orders_view", "allow_payment_method_view"],
      requireAll: false,
      items: [
        {
          title: "Orders",
          url: "/orders",
          icon: "solar:cart-3-linear",
          requiredPermissions: ["allow_orders_view"],
        },
        {
          title: "Payment Methods",
          url: "/payment-methods",
          icon: "solar:card-2-linear",
          requiredPermissions: ["allow_payment_method_view"],
        },
      ],
    },
    {
      title: "Purchasables",
      url: "#",
      icon: "solar:cart-large-2-linear",
      items: [
        {
          title: "Purchasables",
          url: "/purchasables",
          icon: "solar:box-minimalistic-linear",
        },
        {
          title: "Purchasable Orders",
          url: "/purchasable-orders",
          icon: "solar:bill-list-linear",
        },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: "solar:shop-linear",
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
          icon: "solar:box-minimalistic-linear",
          requiredPermissions: ["allow_stock_view"],
        },
        {
          title: "Batches",
          url: "/batches",
          icon: "solar:box-linear",
          requiredPermissions: ["allow_product_view"],
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          icon: "solar:users-group-two-rounded-linear",
          requiredPermissions: ["allow_suppliers_view"],
        },
        {
          title: "Warehouses",
          url: "/warehouses",
          icon: "solar:buildings-3-linear",
          requiredPermissions: ["allow_warehouse_view"],
        },
        {
          title: "Storage Types",
          url: "/storage-types",
          icon: "solar:archive-up-linear",
          requiredPermissions: ["allow_storage_type_view"],
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: "solar:megaphone-linear",
      isActive: true,
      requiredPermissions: ["allow_banners_view", "allow_promotional_tag_view"],
      requireAll: false,
      items: [
        {
          title: "Recipes",
          url: "/recipes",
          icon: "solar:notebook-linear",
        },
        {
          title: "Coupons",
          url: "/coupons",
          icon: "solar:ticket-linear",
        },
        {
          title: "Banners",
          url: "/banners",
          icon: "solar:bill-list-linear",
          requiredPermissions: ["allow_banners_view"],
        },
        {
          title: "Promotion Tags",
          url: "/tags",
          icon: "solar:tag-price-linear",
          requiredPermissions: ["allow_promotional_tag_view"],
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: "solar:users-group-rounded-linear",
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
          icon: "solar:user-id-linear",
          requiredPermissions: ["allow_accounts_view"],
        },
        {
          title: "Administrators",
          url: "/administrators",
          icon: "solar:user-rounded-linear",
          requiredPermissions: ["allow_adminstrators_view"],
        },
        {
          title: "Staff Members",
          url: "/staffs",
          icon: "solar:users-group-two-rounded-linear",
          requiredPermissions: ["allow_staff_view"],
        },
        {
          title: "Organizations",
          url: "/organizations",
          icon: "solar:buildings-3-linear",
          requiredPermissions: ["allow_accounts_view"],
        },
        {
          title: "Riders",
          url: "/riders",
          icon: "solar:delivery-linear",
          requiredPermissions: ["allow_riders_view"],
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "solar:settings-linear",
      items: [
        {
          title: "Delivery Schedules",
          url: "/delivery-schedules",
          icon: "solar:calendar-mark-linear",
          requiredPermissions: ["allow_configuration_view"],
        },
      ],
    },
  ],
};
