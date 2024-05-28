import React, { memo, useEffect, useState } from "react";
import AreaGraph from "./charts/area-graph";
import DonutChart from "./charts/donut-chart";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { AdminRightsModule } from "./modules/admin-rights-module";

interface Props {
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

interface User {
  linked_to?: number;
  first_name: string;
  last_name: string;
  email?: string;
  telephone: string;
  user_role: string;
  dutyStation?: number;
  password: string;
  confirmPassword?: string;
  user_id: number;
  token: string;
}

const UsersSectionAdminDashboard: React.FC<Props> = memo(
  ({
    allSystemUsers,
    allPartners,
    allAdminStaff,
    usersByCategory,
    adminRights,
  }) => {
    const [yearsArray, setYearsArray] = useState<number[]>([]);
    const [usersRegRate, setUsersRegRate] = useState<
      {
        value: number;
        name: string;
        fill?: string;
      }[]
    >([]);

    // SETTING AN ARRAY OF TEN YEARS
    useEffect(() => {
      const years: number[] = [];
      let year = new Date().getFullYear();

      for (let y = year - 9; y <= year; y++) {
        years.push(y);
      }

      setYearsArray(years);
    }, []);

    // FETCH MONTHLY USER REGISTRATION
    const handleFetchRegRate = (year: number) => {
      const currentUser: User = JSON.parse(
        localStorage.getItem("user") as string
      );
      const userToken: string = localStorage.getItem("token") as string;
      axios
        .get(
          `${AppUrl()}/fetch-monthly-users-registration/${
            currentUser.user_role
          }/${adminRights[0].view_dashboard}/${year}`,
          { headers: { "x-access-token": userToken } }
        )
        .then((res) => {
          if (res.data.status === "success") {
            setUsersRegRate(res.data.usersRegRate);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    };

    // FETCHING THE MONTHLY USER REGISTRATION IN THE CURRENT YEAR
    useEffect(() => handleFetchRegRate(new Date().getFullYear()), []);

    return (
      <div className="col-12 dashbord-users p-4 border-2 border-bottom-red">
        <h1 className="fs-4 mt-4 pt-4">Users</h1>
        <div className="col-12 pt-2  d-flex flex-wrap justify-content-around align-items-center text-center">
          <div className="col-3 alert alert-primary">
            <h5>All Users</h5>
            <h1>{allSystemUsers}</h1>
          </div>
          <div className="col-3 alert alert-info">
            {" "}
            <h5>All Partners</h5>
            <h1>{allPartners}</h1>
          </div>
          <div className="col-3 alert alert-danger">
            {" "}
            <h5>All Admin Staff</h5>
            <h1>{allAdminStaff}</h1>
          </div>
        </div>
        <div className="col-12 d-flex flex-wrap justify-content-between align-items-center px-5">
          <div
            className="col-md-7 p-3"
            style={{ background: "rgba(211, 211, 211, 0.1)" }}
          >
            <div className="col-12 d-flex flex-wrap justify-contnent-between align-items center">
              <b className="col-md-10">Monthly users registration</b>
              <form action="" className="col-2">
                <select
                  name=""
                  id=""
                  className="col-12"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleFetchRegRate(Number(e.target.value))
                  }
                >
                  {yearsArray
                    .sort((a, b) => b - a)
                    .map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </form>
            </div>
            <AreaGraph
              data={usersRegRate}
              XAxisKey="name"
              dataKey="value"
              height={400}
              fill={"#2451B7"}
              color_id={"users"}
            />
          </div>

          <div
            className="col-md-5 p-3"
            style={{ background: "rgba(211, 211, 211, 0.1)" }}
          >
            <b>Number of users by Category</b>
            <DonutChart data={usersByCategory} height={400} />
          </div>
          {/* <GaugeChart /> */}
        </div>
      </div>
    );
  }
);

export default UsersSectionAdminDashboard;
