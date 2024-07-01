import React, { useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import Shops from "../shops";
import ShopForm from "../forms/shop-form";
import "../styles/shop-page-style.css";

const PartnerShops: React.FC = () => {
  const [showShopForm, setShowShopForm] = useState<boolean>(false);
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/partner-dashboard",
    },

    {
      lable: "Users",
      link: "/partner-users",
    },
    {
      lable: "Shops",
      link: "/partner-shops",
      status: "active",
    },

    {
      lable: "Fixture",
      link: "/fixture",
    },
    {
      lable: "Results",
      link: "/partiner-results",
    },
    {
      lable: "Reports",
      link: "/partner-receipts",
    },
  ]);
  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">BETCRANE</h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />

        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          {!showShopForm ? (
            <Shops
              showShopForm={showShopForm}
              setShowShopForm={setShowShopForm}
            />
          ) : (
            <ShopForm
              showShopForm={showShopForm}
              setShowShopForm={setShowShopForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerShops;
