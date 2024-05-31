import React, { useState, useEffect } from "react";
import SelectOption from "../form-fields/select-option";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import { ShopModule } from "../modules/shop-module";
import { AddShopAction } from "../activities/add-shop-action";
import axios from "axios";
import { AppUrl } from "../activities/app-url";
import { SelectOptionsModule } from "../modules/select-options-module";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  showShopForm: boolean;
  setShowShopForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
  date_added: string;
  date_updated: string;
  duty_station: string;
  first_name: string;
  last_name: string;
  linked_to: number;
  login_status: number;
  user_email: string;
  user_id: number;
  user_password: string;
  user_role: string;
  user_telephone: string;
}

interface ShopDtails {
  created_by: number;
  date_added?: string;
  date_updated?: string;
  max_payout: number;
  max_stake: number;
  min_stake: number;
  operator: number;
  sales_limit?: number;
  shop_id?: number;
  shop_location: string;
  shop_name: string;
  first_name?: string;
  last_name?: string;
  user_id?: number;
}

const ShopForm: React.FC<Props> = ({ showShopForm, setShowShopForm }) => {
  const [shop, setShop] = useState<ShopModule>({
    adminId: 0,
    shopName: "",
    shopLocation: "",
    miniStake: 0,
    maxStake: 0,
    salesLimit: 0,
    maxPaypout: 0,
    shopOperator: 0,
  });

  const [options, setOptions] = useState<SelectOptionsModule[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [editableShop, setEditableShop] = useState<ShopDtails[]>([]);
  const navigate = useNavigate();
  const { shop_id, operator_id } = useParams();

  useEffect(() => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    setCurrentUserId(currentUser.user_id);

    const token: string = localStorage.getItem("token") as string;

    setShop({ ...shop, adminId: currentUser.user_id });

    axios
      .get(`${AppUrl()}/fetchOperators/${currentUser.user_id}`, {
        headers: { "x-access-token": token },
      })
      .then((res) =>
        setOptions([
          { label: "SELECT SHOP OPERATOR", value: "0" },
          ...res.data.operators.map((operator: User) => {
            return {
              label:
                "300" +
                operator.user_id +
                " " +
                operator.first_name +
                " " +
                operator.last_name,
              value: `${operator.user_id}`,
            };
          }),
        ])
      )
      .catch((error) => console.log(error));
  }, []);

  // FETCH SHOP DETAILS FOR UPDATES
  useEffect(() => {
    const token: string = localStorage.getItem("token") as string;
    axios
      .get(`${AppUrl()}/fetch-shop-details/${shop_id}/${operator_id}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        setEditableShop([res.data.shop]);
        setShop({
          adminId: res.data.shop.operator,
          shopName: res.data.shop.shop_name,
          shopLocation: res.data.shop.shop_location,
          miniStake: res.data.shop.min_stake,
          maxStake: res.data.shop.max_stake,
          salesLimit: res.data.shop.sales_limit,
          maxPaypout: res.data.shop.max_payout,
          shopOperator: res.data.shop.operater,
        });
      })
      .catch((error) => console.log(error));
  }, [shop_id]);

  const handleUpdate = () => {
    const userToken = localStorage.getItem("token");
    axios
      .patch(`${AppUrl()}/update-shop/${shop_id}`, shop, {
        headers: { "x-access-token": userToken },
      })
      .then((res) => {
        if (res.data.status === "success") {
          navigate("/partner-shops");
          setShowShopForm(false);
          window.alert(res.data.message);
        } else {
          window.alert(res.data.message);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="signin__form col-12 d-flex justify-content-center align-items-center">
      <form
        className="col-8 p-4 d-flex flex-wrap justify-content-left"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
        style={{ height: "fit-content" }}
      >
        <h3 className="col-12">
          {!shop_id ? "Add a new shop" : "Update shop info"}
        </h3>
        {/* <div className="col-12"> */}

        {/* </div> */}
        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Shop Name"
          type="text"
          id="shop-name"
          value={`${shop_id ? editableShop.map((es) => es.shop_name) : ""}`}
          autoFocus={true}
          placeholder="Enter shop name here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShop({ ...shop, shopName: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Shop Location"
          type="text"
          id="shop-location"
          value={`${shop_id ? editableShop.map((es) => es.shop_location) : ""}`}
          autoFocus={false}
          placeholder="Enter shop location here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShop({ ...shop, shopLocation: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Minimum stake"
          type="number"
          id="min-stake"
          value={`${shop_id ? editableShop.map((es) => es.min_stake) : ""}`}
          autoFocus={false}
          placeholder="Enter minimum stake here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShop({ ...shop, miniStake: parseInt(e.target.value) })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Maximum stake"
          type="number"
          id="max-stake"
          value={`${shop_id ? editableShop.map((es) => es.max_stake) : ""}`}
          autoFocus={false}
          placeholder="Enter maximum stake here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShop({ ...shop, maxStake: parseInt(e.target.value) })
          }
          onKeyUp={() => {}}
        />

        {/* <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Sales limit"
          type="number"
          id="sales-limit"
          value={`${shop_id ? editableShop.map((es) => es.sales_limit) : ""}`}
          autoFocus={false}
          placeholder="Enter sales limit here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShop({ ...shop, salesLimit: parseInt(e.target.value) })
          }
          onMouseEnter={() => {}}
        /> */}

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Maximum payout"
          type="number"
          id="max-payout"
          value={`${shop_id ? editableShop.map((es) => es.max_payout) : ""}`}
          autoFocus={false}
          placeholder="Enter maximum payout here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShop({ ...shop, maxPaypout: parseInt(e.target.value) })
          }
          onKeyUp={() => {}}
        />

        <SelectOption
          span=""
          className="form-group my-3 px-4 col-md-6 "
          label="Shop operator"
          id="shop-operator"
          options={
            shop_id
              ? [
                  {
                    label:
                      operator_id !== `0`
                        ? `${editableShop.map(
                            (es) =>
                              "300" +
                              es.user_id +
                              " " +
                              es.first_name +
                              " " +
                              es.last_name
                          )}`
                        : ``,
                    value:
                      operator_id !== `0`
                        ? `${editableShop.map((es) => es.operator)}`
                        : `0`,
                  },

                  ...options,
                ]
              : [...options]
          }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setShop({ ...shop, shopOperator: parseInt(e.target.value) })
          }
        />

        <div className="col-12 d-flex justify-content-center">
          {shop_id ? (
            <ButtonText
              value="Submit"
              className="form-group my-4 px-4 col-md-4"
              id="add-user"
              action={() => handleUpdate()}
            />
          ) : (
            <ButtonText
              value="Submit"
              className="form-group my-4 px-4 col-md-4"
              id="add-user"
              action={() =>
                AddShopAction(
                  [
                    document.getElementById("shop-name") as HTMLInputElement,
                    document.getElementById(
                      "shop-location"
                    ) as HTMLInputElement,
                    document.getElementById("min-stake") as HTMLInputElement,
                    document.getElementById("max-stake") as HTMLInputElement,
                    document.getElementById("max-payout") as HTMLInputElement,
                  ],
                  shop,
                  localStorage.getItem("token") as string,
                  setShowShopForm,
                  currentUserId
                )
              }
            />
          )}
          <ButtonText
            value="Cancel"
            className="my-4 px-4 col-md-4 btn-danger"
            id="cancel-add-user"
            action={(e: React.FormEvent) => {
              e.preventDefault();
              setShowShopForm(false);
              navigate("/partner-shops");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default ShopForm;
