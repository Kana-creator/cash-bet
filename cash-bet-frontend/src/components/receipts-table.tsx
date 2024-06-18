import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import { useReactToPrint } from "react-to-print";
import ResultsRow from "./results-row";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import xml2js from "xml2js";
import { ReceiptModule } from "./modules/receipt-module";
import ShopName from "./shop-name";
import CashierName from "./cashier-name";
import { FormatMoney } from "./activities/format-money";
import Receipts from "./pages/receipts-page";
import { UserModule } from "./modules/user-module";
import ReceiptRow from "./receipt-row";

interface Props {
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
}

interface CashiersModule {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface ShopModule {
  created_by: number;
  shop_id: number;
  shop_name: string;
}

const ReceiptsTable: React.FC<Props> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
}) => {
  const [dbReceipts, setDBReceipts] = useState<ReceiptModule[]>([]);
  const [monthly, setMonthly] = useState<boolean>(true);
  const [weekly, setWeekly] = useState<boolean>(false);
  const [daily, setDaily] = useState<boolean>(false);
  const [displayReceipts, setDisplayReceipts] = useState<ReceiptModule[]>([]);
  const [stakeArray, setStakeArray] = useState<number[]>([]);
  const [payArray, setPayArray] = useState<number[]>([]);

  const [groupedByshop, setGroupedByshop] = useState<any[]>([]);
  const [cashiers, setCashiers] = useState<CashiersModule[]>([]);
  const [shops, setShops] = useState<ShopModule[]>([]);
  const [adminId, setAdminId] = useState<number>(0);
  const [shopFilter, setShopFiter] = useState<boolean>(false);
  const [shopFilterId, setShopFiterId] = useState<number>(0);
  const [cashierFilter, setCashierFilter] = useState<boolean>(false);
  const [cashierFilterId, setCashierFilterId] = useState<number>(0);

  let componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    setMonthly(true);
    setWeekly(false);
    setDaily(false);

    const user: UserModule = JSON.parse(localStorage.getItem("user") as string);
    const linked_to = user.user_id;
    const role = user.user_role;

    const timeOut = setTimeout(() => {
      axios
        .get(`${AppUrl()}/fetch-receipts/${linked_to}/${role}`)
        .then((res) => {
          console.log(res.data.receipts);
          const date = new Date();
          const month = date.getMonth();
          const year = date.getFullYear();
          setDBReceipts(
            res.data.receipts.sort(
              (a: ReceiptModule, b: ReceiptModule) =>
                b.receipt_id - a.receipt_id
            )
          );

          setDisplayReceipts(
            res.data.receipts
              .filter(
                (r: ReceiptModule) =>
                  new Date(r.date_added).getMonth() == month &&
                  new Date(r.date_added).getFullYear() == year
              )
              .sort(
                (a: ReceiptModule, b: ReceiptModule) =>
                  b.receipt_id - a.receipt_id
              )
          );

          const newReceiptsByCashier: ReceiptModule[] = [];
          const newReceiptsByShop: ReceiptModule[] = [];
          const cashierGroup = res.data.receipts.reduce(
            (acc: any, obj: any) => {
              const key = obj.cashier_id; // Grouping based on age
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
            },
            {}
          );

          const cashierArray: ReceiptModule[] = Object.values(cashierGroup);
          newReceiptsByCashier.push(cashierArray[0]);

          const shopGroup = res.data.receipts.reduce((acc: any, obj: any) => {
            const key = obj.shop_id; // Grouping based on shop_id
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }, {});

          const shopArray = Object.values(shopGroup);
          setGroupedByshop(shopArray);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);
    return () => clearTimeout(timeOut);
  }, []);

  useEffect(() => {
    setStakeArray(displayReceipts.map((rec: ReceiptModule) => rec.stake));
    setPayArray(
      displayReceipts
        .filter((rec: ReceiptModule) => rec.receipt_status == 4)
        .map((r: ReceiptModule) => r.possible_win)
    );
  }, [displayReceipts]);

  useEffect(() => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    if (daily) {
      if (shopFilter) {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added).getDate() == date &&
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year &&
              receipt.shop_id == shopFilterId
          )
        );
      } else if (cashierFilter) {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added).getDate() == date &&
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year &&
              receipt.cashier_id == cashierFilterId
          )
        );
      } else {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added).getDate() == date &&
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year
          )
        );
      }
    } else if (weekly) {
      // Get the current date
      var currentDate = new Date();

      // Calculate the start date of the week (Sunday)
      var startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
      );

      // Calculate the end date of the week (Saturday)
      var endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + (7 - currentDate.getDay())
      );

      if (shopFilter) {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added) >= startDate &&
              new Date(receipt.date_added) <= endDate &&
              receipt.shop_id == shopFilterId
          )
        );
      } else if (cashierFilter) {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added) >= startDate &&
              new Date(receipt.date_added) <= endDate &&
              receipt.cashier_id == cashierFilterId
          )
        );
      } else {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added) >= startDate &&
              new Date(receipt.date_added) <= endDate
          )
        );
      }
    } else if (monthly) {
      setDisplayReceipts(
        dbReceipts
          .sort(
            (a: ReceiptModule, b: ReceiptModule) => b.receipt_id - a.receipt_id
          )
          .filter(
            (receipt) =>
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year
          )
      );

      if (shopFilter) {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year &&
              receipt.shop_id == shopFilterId
          )
        );
      } else if (cashierFilter) {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year &&
              receipt.cashier_id == cashierFilterId
          )
        );
      } else {
        setDisplayReceipts(
          dbReceipts.filter(
            (receipt: ReceiptModule) =>
              new Date(receipt.date_added).getMonth() == month &&
              new Date(receipt.date_added).getFullYear() == year
          )
        );
      }
    }
  }, [monthly, weekly, daily, shopFilterId, cashierFilterId]);

  // FETCH CASHIERS AND SHOPS
  useEffect(() => {
    const user: UserModule = JSON.parse(localStorage.getItem("user") as string);
    const user_id = user.user_id;

    // FETCH CASHIERS
    axios
      .get(`${AppUrl()}/fetch-receipts-cashiers/${user_id}/${user.user_role}`)
      .then((res) => {
        setCashiers(res.data.cashiers);
      })
      .catch((error) => console.log(error));

    // FETCH SHOPS
    axios
      .get(`${AppUrl()}/fetch-receipts-shops/${user_id}/${user.user_role}`)
      .then((res) => {
        setShops(res.data.shops);
        setAdminId(res.data.admin_id);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className=" col-12 d-flex flex-wrap justify-content-center">
      <div className="page-heading col-10 d-flex justify-content-around mb-4 p-4">
        <h4>Reports</h4>

        <div
          className="col-3 d-flex flex-wrap justify-content-around"
          style={{ maxHeight: "30px" }}
        >
          <button
            className={`btn ${monthly ? "btn-dark" : "btn-secondary"}`}
            onClick={() => {
              setMonthly(true);
              setWeekly(false);
              setDaily(false);
            }}
          >
            Monthly
          </button>
          <button
            className={`btn ${weekly ? "btn-dark" : "btn-secondary"}`}
            onClick={() => {
              setMonthly(false);
              setWeekly(true);
              setDaily(false);

              setShopFiter(false);
              setShopFiterId(0);
              setCashierFilter(false);
              setCashierFilterId(0);
            }}
          >
            Weekly
          </button>
          <button
            className={`btn ${daily ? "btn-dark" : "btn-secondary"}`}
            onClick={() => {
              setMonthly(false);
              setWeekly(false);
              setDaily(true);

              setShopFiter(false);
              setShopFiterId(0);
              setCashierFilter(false);
              setCashierFilterId(0);
            }}
          >
            Daily
          </button>
        </div>

        <div
          className="days col-2 d-flex justify-content-between"
          style={{ maxHeight: "30px" }}
        >
          <select
            name=""
            id=""
            className="col-8 fs-12"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (Number(e.target.value) !== 0) {
                setShopFiter(true);
                setShopFiterId(Number(e.target.value));
                setCashierFilter(false);
                setCashierFilterId(0);
              } else {
                setShopFiter(false);
                setShopFiterId(Number(e.target.value));
                setCashierFilter(false);
                setCashierFilterId(0);
              }
            }}
          >
            <option value={0}>ALL SHOPS</option>
            {shops.map((shop, index) => (
              <option key={index} value={shop.shop_id}>
                {shop.shop_id + ": " + shop.shop_name}
              </option>
            ))}
          </select>
        </div>

        <div
          className="days col-2 d-flex justify-content-between"
          style={{ maxHeight: "30px" }}
        >
          <select
            name=""
            id=""
            className="col-8 fs-12"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (Number(e.target.value) !== 0) {
                setCashierFilter(true);
                setCashierFilterId(Number(e.target.value));
                setShopFiter(false);
                setShopFiterId(0);
              } else {
                setCashierFilter(false);
                setCashierFilterId(Number(e.target.value));
                setShopFiter(false);
                setShopFiterId(0);
              }
            }}
          >
            <option value={0}>ALL CASHIERS</option>
            {cashiers.map((cashier, index) => (
              <option key={index} value={cashier.user_id}>
                {cashier.user_id +
                  ": " +
                  cashier.first_name +
                  " " +
                  cashier.last_name}
              </option>
            ))}
          </select>
        </div>

        <div
          className="days col-2 d-flex justify-content-between align-items-center"
          style={{ maxHeight: "30px" }}
        >
          <button className="btn btn-info" onClick={handlePrint}>
            Print reports
          </button>
        </div>

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
      <div
        ref={componentRef}
        className="text-center pt-5 pb-3 mt-5 col-12 flex-wrap justify-content-center overflow-x-auto px-3  "
      >
        <table className="receipt-table my-5 col-12">
          <thead>
            <tr>
              <th>No</th>
              <th>Receipt number</th>
              <th>Time played</th>
              <th>Shop number</th>
              <th>Shop name</th>
              <th>Cashier ID</th>
              <th>Cashier name</th>
              <th>Stake</th>
              <th>Total odds</th>
              <th>Possible win</th>
              <th>Tax (15%)</th>
              <th>Paid amount</th>
              <th>Status</th>
              <th>Status changed</th>
            </tr>
          </thead>
          <tbody>
            {displayReceipts.map((receipt, index) => {
              let status = "";
              let color = "";
              const actionDate = receipt.action_date
                ? receipt.action_date.split("T")[1].slice(0, 5)
                : null;

              const datePlayed = receipt.date_added
                ? receipt.date_added.split("T")[1].slice(0, 5)
                : null;
              if (receipt.receipt_status === 0) {
                status = "PENDING";
                color = "text-info";
              } else if (receipt.receipt_status === 1) {
                status = "WIN";
                color = "text-success";
              } else if (receipt.receipt_status === 2) {
                status = "LOSS";
                color = "text-danger";
              } else if (receipt.receipt_status === 3) {
                status = "CANCELLED";
                color = "text-warning";
              } else if (receipt.receipt_status === 4) {
                status = "PAID";
                color = "text-light";
              }
              return (
                <ReceiptRow
                  key={index}
                  receipt={receipt}
                  color={color}
                  index={index}
                  datePlayed={datePlayed}
                  actionDate={actionDate}
                  status={status}
                />
              );
            })}
            <tr>
              <td colSpan={14}></td>
            </tr>
            <tr>
              <td colSpan={8} rowSpan={3} className="fs-5">
                TOTALS
              </td>
              <td colSpan={3} className="fs-6">
                Total stake
              </td>
              <td colSpan={3} className="fs-6 text-end">
                {FormatMoney(
                  stakeArray.reduce((acc, num) => acc + num, 0),
                  0
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="fs-6">
                Total pay out
              </td>
              <td colSpan={3} className="fs-6 text-end">
                {FormatMoney(
                  payArray.reduce((acc, num) => acc + num, 0),
                  0
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="fs-6">
                Balance
              </td>
              <td colSpan={3} className="fs-6 text-end">
                {FormatMoney(
                  stakeArray.reduce((acc, num) => acc + num, 0) -
                    payArray.reduce((acc, num) => acc + num, 0),
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptsTable;
