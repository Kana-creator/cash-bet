import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { GameModule } from "./modules/game-module";
import { FormatMoney } from "./activities/format-money";
import { ShopModule } from "./modules/shop-module";
import { SelectedGameModule } from "./modules/selected-game-module";

interface Props {
  receiptGames: SelectedGameModule[];
  stake: number;
  possibleWin: number;
  totalOdds: number;
  shop: ShopModule;
  receiptNumber: number;
}

const PrintableReceipt: React.FC<Props> = ({
  receiptGames,
  stake,
  possibleWin,
  totalOdds,
  shop,
  receiptNumber,
}) => {
  const [tax, setTax] = useState<number>(0);
  const [winAmount, setWinAmount] = useState<number>(0);

  useEffect(() => {
    setTax((15 / 100) * possibleWin);
  }, [possibleWin]);

  useEffect(() => {
    const amount =
      Number(
        receiptGames.length !== 0
          ? [...receiptGames.map((rg) => rg.odd)].reduce((a, b) => a * b)
          : 1
      ) * stake;
    const maxPay = Number(shop.maxPaypout);

    if (amount > maxPay) {
      setWinAmount(maxPay);
    } else {
      setWinAmount(amount);
    }
  }, []);

  return (
    <div
      className="col-12 d-flex justify-content-center position-absolute"
      style={{ fontSize: "10pt", color: "black" }}
    >
      <div className="col-12">
        <div className="p-receit-head col-12 d-flex flex-wrap justify-content-center">
          <div className="col-12">
            {/* <h1 className="text-center">LOGO</h1> */}
            <h3 className="text-center">Xma sports betting</h3>
          </div>
          <div className="col-12 d-flex flex-wrap justify-content-around border-bottom border-dark border-3">
            <h6 className="col-6 text-center">Receipt No.: {receiptNumber}</h6>
            <h6 className="col-6 text-center">
              Shop No.: {"100" + shop.shopID}
            </h6>
            <h6 className="col-6 text-center">Customer ID: </h6>
            <h6 className="col-6 text-center">
              Date: {new Date().toDateString()}
            </h6>
            <h6 className="col-6  text-center">
              Cashier No.: {"200" + shop.adminId}
            </h6>
            <h6 className="col-6  text-center">
              Time: {new Date().toTimeString().slice(0, 9)}
            </h6>
          </div>
        </div>
        <div className="p-receipt-body col-12 px-1 min-height-100">
          <div className="col-12 mt-2 d-flex justify-content-between border-bottom border-seconday border-1">
            <p>
              <strong>Stake: </strong>
              {FormatMoney(stake, 2)}
            </p>
            <p>
              <strong className="col-12 text-left">Total Odds: </strong>
              <span>
                {Number(
                  receiptGames.length !== 0
                    ? [...receiptGames.map((rg) => rg.odd)].reduce(
                        (a, b) => a * b
                      )
                    : 1
                ).toFixed(2)}
              </span>
            </p>
          </div>
          <div className="bets col-12">
            {receiptGames.map((rg, index) => {
              const dateString = rg.date_played;
              const date = new Date(dateString);
              const offsetInMinutes = date.getTimezoneOffset();
              const localDate = new Date(
                date.getTime() - offsetInMinutes * 60000
              );
              const localDateString = new Date(localDate).toLocaleString();
              const date1: string[] = localDateString.split(", ");
              const time = date1[1];
              return (
                <div
                  key={index}
                  className="col-12 p-1 border border-dark"
                  style={{ fontSize: "10pt", fontWeight: "400" }}
                >
                  <div
                    className="col-12 text-end py-0 bg-blue"
                    style={{ lineHeight: "1", fontSize: "8pt" }}
                  >
                    {new Date(dateString).toDateString()} | {time}
                  </div>
                  <div
                    className="col-12 fw-bold d-flex justify-content-between align-items-center py-1"
                    style={{ lineHeight: "1" }}
                  >
                    <span className="col-3 text-center text-light bg-dark px-1 fw-bold">
                      {"[ " + rg.game_number + " ]"}
                    </span>
                    <span className="col-9 px-2 d-flex flex-wrap align-items-center">
                      <span>
                        {rg.home_team} - {rg.away_team}
                      </span>
                    </span>
                  </div>
                  <div
                    className="col-12 text-left d-flex justify-content-between align-items-center px-2 py-0"
                    style={{ lineHeight: "1", fontSize: "8pt" }}
                  >
                    <span>{rg.bet}</span>
                    <strong>{rg.odd}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-12 border-top py-3">
            <p className="col-12 text-end">
              <strong>Possible win: </strong>
              <span>{FormatMoney(possibleWin, 2)}</span>
            </p>
            <p className="col-12 text-end">
              <strong>15% Tax: </strong>
              <span>{FormatMoney((15 / 100) * possibleWin, 2)}</span>
            </p>
            <p className="col-12 text-end">
              <strong>Pay out: </strong>
              <span>
                {FormatMoney(possibleWin - (15 / 100) * possibleWin, 2)}
              </span>
            </p>
          </div>
        </div>
        <div className="p-receipt-foot col-12 text-center">
          <Barcode width={2} height={50} value={receiptNumber.toString()} />
        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;
