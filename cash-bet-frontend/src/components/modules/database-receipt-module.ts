export interface DatabaseReceiptModule {
  shop_id?: number;
  cashier_id: number;
  receipt_number: number;
  stake: number;
  total_odds: number;
  possible_win: number;
  date_added?: string;
  receipt_status?: number;
  action_date?: string;
}
