import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import BarGraph from "./charts/bar-chart";
import { UserModule } from "./modules/user-module";

interface Props {}

const ShopsSectionAdminDashboard: React.FC<Props> = ({}) => {
  const [allShops, setAllShops] = useState<number>(0);
  const [ourShops, setOurShops] = useState<number>(0);
  const [shopsPerlocation, setShopsPerLocation] = useState<
    { name: string; value: number }[]
  >([]);

  // FETCH NUMBER OF SHOPS
  useEffect(() => {
    const userToken: string = localStorage.getItem("token") as string;
    axios
      .get(`${AppUrl()}/fetch-number-of-all-shops`, {
        headers: { "x-access-token": userToken },
      })
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setAllShops(res.data.number_of_shops);
        }
      })
      .catch((error: string) => {
        console.log(error);
      });
  }, []);

  // FETCH NUMBER OF ALL OUR SHOPS
  useEffect(() => {
    const currentUser: UserModule = JSON.parse(
      localStorage.getItem("user") as string
    );
    const userToken: string = localStorage.getItem("token") as string;
    axios
      .get(
        `${AppUrl()}/fetch-our-shops/${currentUser.user_role}/${
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
          setOurShops(res.data.our_shops);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // FETCH NUMBER OF ALL OUR AND OTHER SHOPS PER LOCATION
  useEffect(() => {
    const currentUser: UserModule = JSON.parse(
      localStorage.getItem("user") as string
    );
    const userToken: string = localStorage.getItem("token") as string;

    axios
      .get(
        `${AppUrl()}/fetch-shops-per-location/${currentUser.user_role}/${
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
          setShopsPerLocation(res.data.shops_per_location);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="col-12 dashbord-users p-4 px-4">
      <h1 className="fs-4 mt-4 pt-4">Shops</h1>
      <div className="col-12 pt-2 px-5  d-flex flex-wrap justify-content-between align-items-center text-center">
        <div className="col-3 alert alert-secondary">
          <h5>All Shops</h5>
          <h1>{allShops}</h1>
        </div>
        <div className="col-3 alert alert-warning">
          <h5>Our Shops</h5>
          <h1>{ourShops}</h1>
        </div>
        <div className="col-3"></div>
      </div>
      <div className="col-12 d-flex flex-wrap justify-content-between align-items-center px-5">
        <div
          className="col-md-12 p-3"
          style={{ background: "rgba(211, 211, 211, 0.1)" }}
        >
          <b>Number of shops per location</b>
          <BarGraph
            data={shopsPerlocation}
            height={400}
            fill="#FF4D4D"
            fill2="#4D4DFF"
          />
        </div>
      </div>
    </div>
  );
};

export default ShopsSectionAdminDashboard;
