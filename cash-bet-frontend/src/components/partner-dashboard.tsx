import React from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";

interface Props {
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
}

const PartnerDashboardComponent: React.FC<Props> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
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
          <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p>
          <p
            className="btn btn-secondary px-2 py-2 col-12"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>
    </div>
  );
};

export default PartnerDashboardComponent;
