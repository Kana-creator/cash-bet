import React, { useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import Shops from "../shops";
import ShopForm from "../forms/shop-form";
import "../styles/shop-page-style.css";

const ShopsPage: React.FC = () => {
  const [showShopForm, setShowShopForm] = useState<boolean>(false);
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/admin-page",
    },
    {
      lable: "Partners",
      link: "/partners",
    },
    {
      lable: "Users",
      link: "/users",
    },
    {
      lable: "Shops",
      link: "/shops",
    },
  ]);
  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">Logo</h1>
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

export default ShopsPage;
