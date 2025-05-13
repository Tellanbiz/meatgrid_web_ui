export interface AdminPermissions {
  allow_store_view: boolean;
  allow_store_submit: boolean;
  allow_product_view: boolean;
  allow_product_submit: boolean;
  allow_category_view: boolean;
  allow_category_submit: boolean;
  allow_orders_view: boolean;
  allow_orders_submit: boolean;
  allow_payment_method_view: boolean;
  allow_payment_method_submit: boolean;
  allow_suppliers_view: boolean;
  allow_suppliers_submit: boolean;
  allow_warehouse_view: boolean;
  allow_warehouse_submit: boolean;
  allow_storage_type_view: boolean;
  allow_storage_type_submit: boolean;
  allow_stock_view: boolean;
  allow_stock_submit: boolean;
  allow_accounts_view: boolean;
  allow_accounts_submit: boolean;
  allow_staff_view: boolean;
  allow_staff_submit: boolean;
  allow_riders_view: boolean;
  allow_riders_submit: boolean;
  allow_banners_view: boolean;
  allow_banners_submit_view: boolean;
  allow_promotional_tag_view: boolean;
  allow_promotional_tag_submit: boolean;
  allow_adminstrators_view: boolean;
  allow_adminstrators_submit: boolean;
  allow_configuration_view: boolean;
  allow_configuration_submit: boolean;
  receive_stock_alerts: boolean;
  receice_orders_alerts: boolean;
}

export interface AdminAccount {
  id: string;
  picture: string;
  full_name: string;
  phone_number: string;
  email: string;
  role: string;
  verified_org: boolean;
  status: string;
  permissions: AdminPermissions;
  created_at: string;
}
