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
    <div className="col-12 d-flex justify-content-center position-absolute">
      <div className="col-md-4">
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
        <div className="p-receipt-body col-12 px-5 min-height-100">
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
                <p
                  key={index}
                  className="mb-2 p-0 d-flex justify-content-between align-items-center "
                >
                  <span className="col-1 text-center">{rg.game_number}</span>
                  <span className="d-flex flex-wrap px-4">
                    {/* <span className="col-12">{rg.bet}</span> */}
                    <span>
                      {rg.home_team}-{rg.away_team}
                    </span>
                    {/* <span className="col-12">Full time</span> */}
                    <span className="col-12">{rg.bet}</span>
                  </span>
                  <span className="col-3 text-left">
                    {new Date(dateString).toDateString()}|{time}
                  </span>
                  <strong>{rg.odd}</strong>
                </p>
              );
            })}
          </div>

          <div className="col-12 border-top py-3">
            {/* <p>
              <strong className="col-12 text-left">Total Odds: </strong>
              <span>24</span>
            </p> */}
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
          <Barcode width={3} height={50} value={receiptNumber.toString()} />
        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;
