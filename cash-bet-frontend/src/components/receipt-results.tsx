import React, { useEffect, useState } from "react";
import { DatabaseReceiptModule } from "./modules/database-receipt-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { SelectedGameModule } from "./modules/selected-game-module";
import ResultsGame from "./results-game";
import { FormatMoney } from "./activities/format-money";

interface Props {
  resultReceiptNumber: string;
  receiptResults: DatabaseReceiptModule[];
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReceiptResults: React.FC<Props> = ({
  resultReceiptNumber,
  receiptResults,
  setShowResults,
}) => {
  const [resultGames, setResultGames] = useState<SelectedGameModule[]>([]);
  const [winStatusArray, setWinStatusArray] = useState<string[]>([]);
  const [winStatus, setWinStatus] = useState<string>("");
  const [status, setStatus] = useState<string[]>([]);
  const [receiptStatus, setReceiptStatus] = useState<number>(0);

  const updateParentArray = (newValue: string, index: number) => {
    const newArray = [...winStatusArray]; // Create a copy of the parentArray
    newArray[index] = newValue; // Update the value at the specified index
    // setWinStatusArray(newArray);
    winStatusArray.push(newValue);
    setStatus([...status, newValue]);
  };

  const handelChangeReceiptStatus = (
    status: number,
    receipt_number: string
  ) => {
    axios
      .put(`${AppUrl()}/change-receipt-status/${status}/${receipt_number}`)
      .then((res) => {
        if (status === 3 || status === 4) {
          setShowResults(false);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const pendingStatus = status.includes("Pending");
    const lossStatus = status.includes("Loss");
    const notFoundStatus = status.includes("Missing");
    const winStatus = status.includes("Win");

    console.log(status);

    const interval = setInterval(() => {
      const receipt_status = receiptResults.map((rr) => rr.receipt_status);
      setReceiptStatus(Number(receipt_status[0]));

      if (receipt_status[0] === 4) {
        setWinStatus("Paid");
      } else if (receipt_status[0] === 3) {
        setWinStatus("Cancelled");
      } else {
        if (pendingStatus && !lossStatus) {
          setWinStatus("Pending");
          handelChangeReceiptStatus(0, resultReceiptNumber);
        } else if (lossStatus) {
          handelChangeReceiptStatus(2, resultReceiptNumber);
          setWinStatus("Loss");
        } else if (!lossStatus && notFoundStatus) {
          handelChangeReceiptStatus(5, resultReceiptNumber);
          setWinStatus("Missing");
        } else if (!pendingStatus && !lossStatus && winStatus) {
          handelChangeReceiptStatus(1, resultReceiptNumber);
          setWinStatus("Win");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // FETCHING RECIEPTS RESULTS
  useEffect(() => {
    axios
      .get(`${AppUrl()}/fetch-result-games/${resultReceiptNumber}`)
      .then((res) => {
        if (res.data.status === "error") {
          setResultGames([]);
        } else {
          setResultGames(res.data.resultGames);
        }
      })
      .catch((error) => console.log(error));
  }, [resultReceiptNumber]);

  return (
    <div className="results d-flex justify-content-center">
      <div className="header">
        <div>
          <p>
            <b>Receipt No: </b>
            <span>{receiptResults.map((rr) => rr.receipt_number)}</span>
          </p>
          <p>
            <b>Date: </b>
            <span>
              {receiptResults.map((rr) =>
                new Date(`${rr.date_added}`).toDateString()
              )}
            </span>
          </p>
        </div>
        <button
          className="close-btn btn btn-danger"
          onClick={() => {
            return setShowResults(false);
          }}
        >
          X
        </button>
      </div>
      <div className="inner-div">
        {resultGames.length > 0 ? (
          resultGames.map((rg, id) => (
            <ResultsGame
              resultsGame={rg}
              key={id}
              index={id}
              updateParentArray={updateParentArray}
            />
          ))
        ) : (
          <h1>No game associated with this receipt.</h1>
        )}

        <div className="payments col-12 pt-5 p-2">
          <div className="col-12 payment-details">
            <p>
              <b>Total odds: </b>
              {receiptResults.map((rr) => rr.total_odds)}
            </p>
            <p>
              <b>Stake: </b>
              {receiptResults.map((rr) => FormatMoney(rr.stake, 0))}
            </p>
            <p>
              <b>Possible win: </b>
              {receiptResults.map((rr) => FormatMoney(rr.possible_win, 0))}
            </p>
            <p>
              <b>15% Tax: </b>
              {receiptResults.map((rr) =>
                FormatMoney((15 / 100) * rr.possible_win, 0)
              )}
            </p>
            <p>
              <b>Pay out: </b>
              {receiptResults.map((rr) =>
                FormatMoney(rr.possible_win - (15 / 100) * rr.possible_win, 0)
              )}
            </p>
            <h1 className="receipt-status">{winStatus}</h1>
          </div>
        </div>
      </div>

      <div className="cash-out col-12 d-flex justify-content-around align-items-center">
        {winStatus === "Win" ? (
          <button
            className="btn btn-info col-5"
            onClick={() => handelChangeReceiptStatus(4, resultReceiptNumber)}
          >
            Pay
          </button>
        ) : null}

        {winStatus === "Pending" ? (
          <button
            className="btn btn-info col-5"
            onClick={() => handelChangeReceiptStatus(3, resultReceiptNumber)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ReceiptResults;
