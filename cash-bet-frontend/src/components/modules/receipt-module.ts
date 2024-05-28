export interface ReceiptModule {
  receipt_id: number;
  shop_id: number;
  cashier_id: number;
  receipt_number: number;
  stake: number;
  total_odds: number;
  possible_win: number;
  date_added: string;
  action_date: string;
  receipt_status: number;
  admin_id: number;
}
