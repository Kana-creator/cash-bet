import { ShopModule } from "./shop-module";

export interface UserModule {
  linked_to?: number;
  firstName: string;
  lastName: string;
  email?: string;
  telephone: string;
  user_role?: string;
  dutyStation?: number;
  password: string;
  confirmPassword?: string;
  shop?: ShopModule;
  user_id?: number;
}
