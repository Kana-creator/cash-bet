import React from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";

import UsersSectionAdminDashboard from "./users-section-admin-dashbord";
import ShopsSectionAdminDashboard from "./shops-section-admin-dashboard";
import { AdminRightsModule } from "./modules/admin-rights-module";
import FinanceSectionAdminDashboard from "./finance-section-admin-dashboard";

interface Props {
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
  allSystemUsers: number;
  allPartners: number;
  allAdminStaff: number;
  usersRegRate: {
    value: number;
    name: string;
  }[];
  usersByCategory: {
    value: number;
    name: string;
    fill?: string;
  }[];
  adminRights: AdminRightsModule[];
}

const AdminDashboardComponent: React.FC<Props> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
  allSystemUsers,
  allPartners,
  allAdminStaff,
  usersRegRate,
  usersByCategory,
  adminRights,
}) => {
  return (
    <div className="users col-12 d-flex flex-wrap justify-content-center">
      <div className="page-heading col-10 d-flex justify-content-between mb-4 p-4">
        <h4>Dashboard</h4>

        <details
          className="position-relative  bg-dark px-3 py-1"
          style={{ width: "fit-content" }}
        >
          <summary>
            <span>
              {currentUserName} {<MdSettings />}
            </span>
          </summary>
          {/* <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p> */}
          <p
            className="btn btn-secondary px-2 py-2 col-12"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>
      <div className="col-12 p-4 pt-4 mt-4">
        {/* FINANCE SECTION */}
        <FinanceSectionAdminDashboard
          allAdminStaff={allAdminStaff}
          usersRegRate={usersRegRate}
          adminRights={adminRights}
        />

        {/* USERS SECTION */}
        <UsersSectionAdminDashboard
          allSystemUsers={allSystemUsers}
          allPartners={allPartners}
          allAdminStaff={allAdminStaff}
          usersRegRate={usersRegRate}
          usersByCategory={usersByCategory}
          adminRights={adminRights}
        />
        {/* SHOPS SECTION */}
        <ShopsSectionAdminDashboard />
      </div>
    </div>
  );
};

export default AdminDashboardComponent;
