export interface Credit {
  crdit_id?: number;
  given_by: number;
  given_to: number;
  credit_amount: number;
  credit_type: string;
  transaction_date?: string;
  user_name?: string;
  shop_manager: number;
  user_role: string;
}
