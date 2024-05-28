export interface ShopModule {
  shopID?: number;
  adminId?: number;
  shopName: string;
  shopLocation: string;
  miniStake: number;
  maxStake: number;
  salesLimit: number;
  maxPaypout: number;
  shopOperator: number;
}
