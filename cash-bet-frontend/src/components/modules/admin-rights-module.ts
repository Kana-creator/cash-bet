export interface AdminRightsModule {
  rights_id?: number;
  user_id?: number;
  view_dashboard: number;
  view_partners: number;
  add_partner: number;
  add_credit: number;
  block_partner: number;
  delete_partner: number;
  view_users: number;
  add_user: number;
  edit_user: number;
  delete_user: number;
  view_reports: number;
}
