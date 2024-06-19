import React, { useEffect, useState } from "react";
import AreaGraph from "./charts/area-graph";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { AdminRightsModule } from "./modules/admin-rights-module";
import LineGraph from "./charts/line-chart";
import { FormatMoneyExt } from "./activities/format-money";

import io from "socket.io-client";

interface Props {
  allAdminStaff: number;
  usersRegRate: {
    value: number;
    name: string;
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

const FinanceSectionAdminDashboard: React.FC<Props> = ({
  allAdminStaff,
  adminRights,
}) => {
  const [yearsArray, setYearsArray] = useState<number[]>([]);
  const [creditSubscription, setCreditSubscription] = useState<number>(0);
  const [subscriptionThisYear, setSubscriptionThisYear] = useState<number>(0);
  const [subscriptionThisMonth, setSubscriptionThisMonth] = useState<number>(0);
  const [monthlySubscription, setMonthlySubscription] = useState<
    { month: string; subscription: number }[]
  >([]);

  const [usersRegRate, setUsersRegRate] = useState<
    {
      value: number;
      name: string;
      fill?: string;
    }[]
  >([]);

  const [annualSubscription, setAnnualSubscription] = useState<
    { year: Number; subscription: Number }[]
  >([]);

  useEffect(() => {
    const years: number[] = [];
    let year = new Date().getFullYear();

    for (let y = year - 9; y <= year; y++) {
      years.push(y);
    }

    setYearsArray(years);
  }, []);

  // FETCH MONTHLY CREDIT SUBSCRIPTION
  const handleMonthlySubscription = (year: number) => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );
    const userToken: string = localStorage.getItem("token") as string;
    axios
      .get(
        `${AppUrl()}/fetch-monthly-subscription/${year}/${
          currentUser.user_role
        }/${currentUser.user_id}`,
        {
          headers: { "x-access-token": userToken },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          setMonthlySubscription(res.data.monthly_subscription);
        } else {
          window.alert(res.data.message);
        }
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => handleMonthlySubscription(new Date().getFullYear()), []);

  // FETCH TOTAL CREDIT SUBSCRIPTION
  useEffect(() => {
    const userToken: string = localStorage.getItem("token") as string;
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    axios
      .get(
        `${AppUrl()}/fetch-total-credit-subscription/${currentUser.user_role}/${
          currentUser.user_id
        }`,
        {
          headers: { "x-access-token": userToken },
        }
      )
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setCreditSubscription(res.data.total_credit);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // FETCHING SUBSCRITION IN THE CURRENT YEAR
  useEffect(() => {
    const userToken: string = localStorage.getItem("token") as string;
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );
    axios
      .get(
        `${AppUrl()}/fetch-subscription-this-year/${currentUser.user_role}/${
          currentUser.user_id
        }`,
        {
          headers: { "x-access-token": userToken },
        }
      )
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setSubscriptionThisYear(res.data.subscription);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // FETCH SUBSCRIPTION IN THE CURRENT MONTH
  useEffect(() => {
    const userToken: string = localStorage.getItem("token") as string;
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    axios
      .get(
        `${AppUrl()}/fetch-subscription-this-month/${currentUser.user_role}/${
          currentUser.user_id
        }`,
        {
          headers: { "x-access-token": userToken },
        }
      )
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setSubscriptionThisMonth(res.data.subscription);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // FETCH ANNUAL SUBSCRIPTION
  useEffect(() => {
    const userToken: string = localStorage.getItem("token") as string;
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );
    axios
      .get(
        `${AppUrl()}/fetch-annual-subscription/${currentUser.user_role}/${
          currentUser.user_id
        }`,
        {
          headers: { "x-access-token": userToken },
        }
      )
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setAnnualSubscription(res.data.annual_subscription);
        }
      });
  }, []);

  return (
    <div className="col-12 dashbord-users p-4 border-2 border-bottom-red">
      <h1 className="fs-4 mt-4 pt-4">Finance</h1>
      <div className="col-12 pt-2  d-flex flex-wrap justify-content-around align-items-center text-center">
        <div className="col-3 alert alert-primary">
          <h5>Total credit subscription</h5>
          <h4>{FormatMoneyExt(creditSubscription, 3)}</h4>
        </div>
        <div className="col-3 alert alert-info">
          <h5>Subscription in {new Date().getFullYear()}</h5>
          <h4>{FormatMoneyExt(subscriptionThisYear, 3)}</h4>
        </div>
        <div className="col-3 alert alert-danger">
          <h5>
            Subcription in{" "}
            {new Date(
              new Date().getFullYear(),
              new Date().getMonth()
            ).toLocaleDateString("en-US", {
              month: "long",
            })}
          </h5>
          <h4>{FormatMoneyExt(subscriptionThisMonth, 3)}</h4>
        </div>
      </div>
      <div className="col-12 d-flex flex-wrap justify-content-between align-items-center px-5">
        <div
          className="col-md-12 p-3"
          style={{ background: "rgba(211, 211, 211, 0.1)" }}
        >
          <div className="col-12 d-flex flex-wrap justify-contnent-between align-items center">
            <b className="col-md-10">Monthly credit subscription</b>
            <form action="" className="col-2">
              <select
                name=""
                id=""
                className="col-12"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleMonthlySubscription(Number(e.target.value))
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
          <LineGraph data={monthlySubscription} XAxisKey="month" height={500} />
        </div>

        <div
          className="col-md-12 p-3"
          style={{ background: "rgba(211, 211, 211, 0.1)" }}
        >
          <div className="col-12 d-flex flex-wrap justify-contnent-between align-items center">
            <b className="col-md-10">Annual credit subscription</b>
          </div>

          <AreaGraph
            data={annualSubscription}
            XAxisKey="year"
            dataKey="subscription"
            height={500}
            fill={"#FF4D4D"}
            color_id="finance"
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceSectionAdminDashboard;
