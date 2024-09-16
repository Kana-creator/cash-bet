import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./components/pages/signin";
import AdminSignin from "./components/pages/admin-signin";
import AdminSignup from "./components/pages/admin-signup";
import CashierPage from "./components/pages/cashier-page";
import ManagerPage from "./components/pages/manager-page";
import AdminDashboard from "./components/pages/admin-dashboard";
import UsersPage from "./components/pages/users-page";
import PartnersPage from "./components/pages/partners-page";
import ShopsPage from "./components/pages/shops-page";
import axios from "axios";
import PartnerUsers from "./components/pages/partner-users";
import PartnerShops from "./components/pages/partner-shops";
import AdminUsersPage from "./components/pages/admin-users-page";
import CashiersPage from "./components/pages/cashiers-page";
import PartnerDashboard from "./components/pages/partner-dashboard";
import ShopManagerReceipts from "./components/pages/shop-manager-receipts";
import ShopManagerReports from "./components/pages/shop-manager-reports";
import ShopCashierReceipts from "./components/pages/shop-cashier-receipts";
import ShopCashierReports from "./components/pages/shop-cashier-reports";
import AdminReports from "./components/pages/admin-reporpts";
import { AdminRightsModule } from "./components/modules/admin-rights-module";
import Fixture from "./components/pages/fixture-page";
import Results from "./components/pages/results-page";
import PartnerReports from "./components/pages/partner-reports";
import AdminWithdrawReport from "./components/pages/admin-withdraw-report";
import CreditReportPage from "./components/pages/credit-report-page";
import PartnerCreditReportPage from "./components/pages/partner-credit-report";
import ManagerCreditReportPage from "./components/pages/manager-credit-page";

const App: React.FC = () => {
  const [adminRights, setAdminRights] = useState<AdminRightsModule[]>([
    {
      rights_id: 0,
      user_id: 0,
      view_dashboard: 1,
      view_partners: 1,
      add_partner: 1,
      add_credit: 1,
      block_partner: 1,
      delete_partner: 1,
      view_users: 1,
      add_user: 1,
      edit_user: 1,
      delete_user: 1,
      view_reports: 1,
    },
  ]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/admin" element={<AdminSignin axios={axios} />} />
          <Route path="/admin-signup" element={<AdminSignup axios={axios} />} />
          <Route path="/cashier-page" element={<CashierPage />} />
          <Route path="/manager-page" element={<ManagerPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminDashboard
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />
          <Route path="/users" element={<UsersPage />} />
          <Route
            path="/admin-users"
            element={
              <AdminUsersPage
                currentUserAdminRights={adminRights}
                setCurrentUserAdminRights={setAdminRights}
              />
            }
          />
          <Route
            path="/admin-users/:user_id"
            element={
              <AdminUsersPage
                currentUserAdminRights={adminRights}
                setCurrentUserAdminRights={setAdminRights}
              />
            }
          />
          <Route path="/users/:user_id" element={<UsersPage />} />
          <Route path="/partner-users" element={<PartnerUsers />} />
          <Route path="/partner-users/:user_id" element={<PartnerUsers />} />
          <Route path="/partner-shops" element={<PartnerShops />} />
          <Route
            path="/partner-shops/:shop_id/:operator_id"
            element={<PartnerShops />}
          />
          <Route
            path="/partners"
            element={
              <PartnersPage
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />
          <Route
            path="/partner-dashboard"
            element={<PartnerDashboard adminRights={adminRights} />}
          />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/cashiers-page" element={<CashiersPage />} />
          <Route
            path="/shop-manager-receipts"
            element={<ShopManagerReceipts />}
          />
          <Route
            path="/shop-manager-reports"
            element={<ShopManagerReports />}
          />
          <Route
            path="/shop-cashier-receipts"
            element={<ShopCashierReceipts />}
          />
          <Route
            path="/shop-cashier-reports"
            element={<ShopCashierReports />}
          />

          <Route path="/partner-receipts" element={<PartnerReports />} />

          <Route
            path="/admin-reports"
            element={
              <AdminReports
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />

          <Route path="/fixture" element={<Fixture />} />

          <Route path="/partiner-results" element={<Results />} />
          <Route
            path="/admin-withdraw-report"
            element={
              <AdminWithdrawReport
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />

          <Route
            path="/credit-report"
            element={
              <CreditReportPage
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />

          <Route
            path="/partner-credit-report"
            element={
              <PartnerCreditReportPage
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />
          <Route
            path="/partner-credit-report"
            element={
              <PartnerCreditReportPage
                adminRights={adminRights}
                setAdminRights={setAdminRights}
              />
            }
          />

          <Route
            path="/manager-credit-report"
            element={<ManagerCreditReportPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
