import React, { useEffect, useRef, useState } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import PrintableReceipt from "./printable-receipt";
import { useReactToPrint } from "react-to-print";
import { FormatMoney } from "./activities/format-money";
import { ShopModule } from "./modules/shop-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { SelectedGameModule } from "./modules/selected-game-module";
import { DatabaseReceiptModule } from "./modules/database-receipt-module";
import ReceiptResults from "./receipt-results";
import { UserModule } from "./modules/user-module";

interface Props {
  receiptGames: SelectedGameModule[];
  setReceiptGames: React.Dispatch<React.SetStateAction<SelectedGameModule[]>>;
  managerCreditBalance: number;
  shop: ShopModule;
  odds: number[];
  setOdds: React.Dispatch<React.SetStateAction<number[]>>;

  totalOdds: number;
  setTotalOdds: React.Dispatch<React.SetStateAction<number>>;
  receiptNumber: number;
  setReceiptNumber: React.Dispatch<React.SetStateAction<number>>;
}

const Receipt: React.FC<Props> = ({
  receiptGames,
  setReceiptGames,
  managerCreditBalance,
  shop,
  odds,
  setOdds,
  totalOdds,
  setTotalOdds,
  receiptNumber,
  setReceiptNumber,
}) => {
  const [DBReceipt, setDBReceipt] = useState<DatabaseReceiptModule>({
    shop_id: 0,
    cashier_id: 0,
    receipt_number: receiptNumber,
    stake: 0,
    total_odds: totalOdds,
    possible_win: 0,
  });

  const [resultReceiptNumber, setResultReceiptNumber] = useState<string>("");
  const [receiptResults, setReceiptResults] = useState<DatabaseReceiptModule[]>(
    []
  );
  const [showResults, setShowResults] = useState<boolean>(false);
  const [possibleWin, setPossibleWin] = useState<number>(0);
  const [stake, setStake] = useState<number>(0);
  const [adminId, setAdminId] = useState<number>(0);
  const [sumOdds, setSumOdds] = useState<number>(0);
  const [linkedTo, setLinkedTo] = useState<number>(0);

  let componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function validateNumericInput(input: HTMLInputElement) {
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  useEffect(() => {
    const stake_field = document.getElementById("stake") as HTMLInputElement;

    if (receiptGames.length === 0) {
      stake_field.value = "";
      setStake(0);
    }

    if (Number(sumOdds * stake) > Number(shop.maxPaypout)) {
      setPossibleWin(shop.maxPaypout);
    } else {
      setPossibleWin(sumOdds * stake);
    }

    function getProductOfArrayElements(arr: number[]) {
      if (arr.length === 0) {
        return 0;
      }

      const product = arr.reduce(
        (accumulator: number, currentValue: number) =>
          accumulator * currentValue
      );

      return product;
    }
    const product = getProductOfArrayElements(odds);
    setTotalOdds(product);
    setSumOdds(product);
  }, [stake, receiptGames]);

  // FETCHING ADMIN ID
  useEffect(() => {
    const user: UserModule = JSON.parse(localStorage.getItem("user") as string);
    setLinkedTo(Number(user.linked_to));

    const fetchAdminId = () => {
      axios
        .get(`${AppUrl()}/fetch-admin-id`)
        .then((res) => setAdminId(res.data.adminId))
        .catch((error) => console.log(error));
    };

    return fetchAdminId();
  }, []);

  // SEVING RECEIPTS
  const saveReceiptGames = (
    DBReceipt: DatabaseReceiptModule,
    receiptGames: SelectedGameModule[],
    receipt_number: number,
    stake_field: HTMLInputElement,
    admin_id: number,
    linked_to: number
  ) => {
    axios
      .post(`${AppUrl()}/save-receipt-games`, {
        receipt: DBReceipt,
        games: receiptGames,
        receiptNumber: receipt_number,
        admin_id: admin_id,
        linked_to,
      })
      .then(() => {
        // setReceiptGames([]);
        // handlePrint();
        // setStake(0);
        // setTotalOdds(0);
        // setPossibleWin(0);

        setReceiptGames([]);
        setOdds([1]);
        setPossibleWin(0);
        setStake(0);
        setTotalOdds(0);
        handlePrint();
        stake_field.value = "";
      })
      .catch((error) => console.log(error));

    // return window.alert("Success");
  };

  useEffect(() => {
    setTotalOdds(sumOdds);
  }, [odds]);

  const fetchReceiptResults = (
    field: HTMLInputElement,
    receipt_number: string
  ) => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    axios
      .get(
        `${AppUrl()}/fetch-receipt-results/${receipt_number}/${user.shop_id}`
      )
      .then((res) => {
        if (res.data.status === "success") {
          setReceiptResults(res.data.receipt);
          setShowResults(true);
          field.value = "";
        } else {
          window.alert(res.data.message);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="receipt col-12">
      <div className="top col-12">
        <div className="p-2 col-12">
          <input
            id="receipt-number-field"
            type="text"
            className="form-control"
            placeholder="Enter receipt number"
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const receipt_number = document.getElementById(
                "receipt-number-field"
              ) as HTMLInputElement;

              if (e.key === "Enter") {
                setResultReceiptNumber(receipt_number.value);
                fetchReceiptResults(receipt_number, receipt_number.value);
              }
            }}
          />
        </div>

        <h6 className="text-center col-12 d-flex justify-content-between container px-4 mt-2">
          <strong>BET ({receiptGames.length})</strong>
          <strong
            className="btn clean-btn"
            onClick={() => {
              const stake_field = document.getElementById(
                "stake"
              ) as HTMLInputElement;
              setReceiptGames([]);
              setOdds([1]);
              setPossibleWin(0);
              setStake(0);
              setTotalOdds(0);
              stake_field.value = "";
            }}
          >
            <MdClose /> Clear
          </strong>
        </h6>

        <div className="receipt-category d-flex justify-content-around align-items-center col-12 my-2">
          <span
            className={`py-2 px-4 ${receiptGames.length === 1 ? "active" : ""}`}
          >
            Single
          </span>
          <span
            className={`py-2 px-4 ${receiptGames.length > 1 ? "active" : ""}`}
          >
            Multiple
          </span>
          <span
            className={`py-2 px-4 ${receiptGames.length === 0 ? "active" : ""}`}
          >
            System
          </span>
        </div>
      </div>

      <div className="col-12 midle">
        {receiptGames.map((rg, index) => (
          <div key={index} className="game container">
            <div className="d-flex justify-content-left">
              <span
                className="btn-remove col-1 text-center align-center"
                onClick={() => {
                  const stake_field = document.getElementById(
                    "stake"
                  ) as HTMLInputElement;
                  setReceiptGames([
                    ...receiptGames.filter(
                      (gi) => gi.game_number !== rg.game_number
                    ),
                  ]);

                  // setOdds([rg.odd]);

                  if (receiptGames.length === 1) {
                    setStake(0);
                    setOdds([1]);
                    setTotalOdds(0);
                    setReceiptGames([]);
                    setPossibleWin(0);
                  } else {
                    setStake(parseInt(stake_field.value));
                  }
                }}
              >
                <MdClose />
              </span>
              <span className="game-details col-11">
                <span className="px-2">{rg.game_number} | </span>
                <span>
                  {rg.home_team} - {rg.away_team}
                </span>
              </span>
            </div>
            <div className="bet col-12 container d-flex justify-content-between align-items-center">
              <span>{rg.bet}</span>
              <span>{rg.odd}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="col-12 bottom">
        <div className="container d-flex justify-content-between mt-1 pt-1 px-4">
          <span>Total Odds</span>
          <span>
            {receiptGames.length !== 0
              ? Number(
                  [...receiptGames.map((rg) => rg.odd)].reduce((a, b) => a * b)
                ).toFixed(2)
              : 1}
          </span>
        </div>
        {/* <div className="container d-flex justify-content-center align-items-center mt-1 px-4"> */}
        {/* <div className="odds-change py-2 col-12 d-flex align-items-center justify-content-center ">
            <span className="pe-2">Accept Odds Change</span>
            <input id="odds-change" type="checkBox" className="" />
          </div> */}
        {/* </div> */}

        <div className="col-12 mt-1 py-2">
          <div className="paiments py-2">
            <div className="d-flex align-items-center px-4 justify-content-between">
              <span>Amount</span>
              <input
                type="text"
                accept="number"
                name=""
                id="stake"
                className="text-end px-3"
                defaultValue={""}
                placeholder="UGX"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const stake_field = document.getElementById(
                    "stake"
                  ) as HTMLInputElement;
                  // const amount =
                  //   Number(shop.maxPaypout) >=
                  //   Number(e.target.value) * totalOdds
                  //     ? Number(e.target.value) * totalOdds
                  //     : Number(shop.maxPaypout);

                  validateNumericInput(stake_field);
                  setStake(Number(e.target.value));
                  setPossibleWin(
                    Number(totalOdds) * Number(e.target.value) >
                      Number(shop.maxPaypout)
                      ? Number(shop.maxPaypout)
                      : Number(totalOdds) * Number(e.target.value)
                  );

                  console.log(Number(totalOdds));

                  setDBReceipt({
                    ...DBReceipt,
                    stake: Number(e.target.value),
                    possible_win:
                      Number(totalOdds) * Number(e.target.value) >
                      shop.maxPaypout
                        ? shop.maxPaypout
                        : Number(totalOdds) * Number(e.target.value),
                  });
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    const stake_field = document.getElementById(
                      "stake"
                    ) as HTMLInputElement;

                    const getRandomInt = (min: number, max: number) => {
                      return Math.floor(Math.random() * (max - min + 1)) + min;
                    };

                    const receiptNum = getRandomInt(10000000, 1000000000);
                    setReceiptNumber(receiptNum);

                    const currentUser: any = JSON.parse(
                      localStorage.getItem("user") as string
                    );

                    DBReceipt.shop_id = Number(currentUser.duty_station);
                    DBReceipt.receipt_number = receiptNum;
                    DBReceipt.cashier_id = Number(currentUser.user_id);
                    DBReceipt.total_odds = Number(
                      receiptGames.length !== 0
                        ? Number(
                            [...receiptGames.map((rg) => rg.odd)].reduce(
                              (a, b) => a * b
                            )
                          ).toFixed(2)
                        : 1
                    );

                    if (managerCreditBalance < Number(stake_field.value)) {
                      window.alert(
                        "You have insufficient credit balance to place this bet!"
                      );
                    } else if (Number(stake_field.value) < shop.miniStake) {
                      window.alert(
                        `The minimum bet amount is ${shop.miniStake}!`
                      );
                    } else if (Number(stake_field.value) > shop.maxStake) {
                      window.alert(
                        `The maximum bet amount is ${shop.maxStake}!`
                      );
                    } else {
                      if (receiptGames.length > 0) {
                        saveReceiptGames(
                          DBReceipt,
                          receiptGames,
                          receiptNum,
                          stake_field,
                          adminId,
                          linkedTo
                        );
                      } else {
                        window.alert("Can't submit empty receipt.");
                      }
                    }
                  }
                }}
              />
            </div>
            {/* <div className="mt-4 d-flex justify-content-between px-1">
              <span className="btn btn-dark">
                <MdDelete />
              </span>
              <span className="btn btn-dark">50</span>
              <span className="btn btn-dark">100</span>
              <span className="btn btn-dark">250</span>
              <span className="btn btn-dark">500</span>
            </div> */}
          </div>

          <div className="betting mt-1">
            <div className="d-flex mt-1 py-2 px-4 justify-content-between">
              <span>Possible Win</span>
              <span>
                {/* {receiptGames.length !== 0
                  ? FormatMoney(
                      [...receiptGames.map((rg) => rg.odd)].reduce(
                        (a, b) => a * b
                      ) * stake,
                      2
                    )
                  : 0} */}
                {FormatMoney(possibleWin, 0)}
              </span>
            </div>

            <div className="col-12 px-4 pb-2">
              <button
                className="btn btn-primary col-12"
                onClick={() => {
                  const stake_field = document.getElementById(
                    "stake"
                  ) as HTMLInputElement;

                  const receiptNum = getRandomInt(10000000, 1000000000);
                  setReceiptNumber(receiptNum);

                  function getRandomInt(min: number, max: number) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                  }

                  const currentUser: any = JSON.parse(
                    localStorage.getItem("user") as string
                  );

                  DBReceipt.shop_id = Number(currentUser.duty_station);
                  DBReceipt.receipt_number = receiptNum;
                  DBReceipt.cashier_id = Number(currentUser.user_id);
                  DBReceipt.total_odds = Number(
                    receiptGames.length !== 0
                      ? Number(
                          [...receiptGames.map((rg) => rg.odd)].reduce(
                            (a, b) => a * b
                          )
                        ).toFixed(2)
                      : 1
                  );

                  if (managerCreditBalance < Number(stake_field.value)) {
                    window.alert(
                      "You have insufficient credit balance to place this bet!"
                    );
                  } else if (Number(stake_field.value) < shop.miniStake) {
                    window.alert(
                      `The minimum bet amount is ${shop.miniStake}!`
                    );
                  } else if (Number(stake_field.value) > shop.maxStake) {
                    window.alert(`The maximum bet amount is ${shop.maxStake}!`);
                  } else {
                    if (receiptGames.length > 0) {
                      saveReceiptGames(
                        DBReceipt,
                        receiptGames,
                        receiptNum,
                        stake_field,
                        adminId,
                        linkedTo
                      );
                    } else {
                      window.alert("Can't submit empty receipt.");
                    }
                  }
                }}
              >
                Bet
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12" ref={componentRef}>
        <PrintableReceipt
          receiptGames={receiptGames}
          stake={stake}
          possibleWin={possibleWin}
          totalOdds={totalOdds}
          shop={shop}
          receiptNumber={receiptNumber}
        />
      </div>

      {showResults ? (
        <ReceiptResults
          resultReceiptNumber={resultReceiptNumber}
          receiptResults={receiptResults}
          setShowResults={setShowResults}
        />
      ) : null}
    </div>
  );
};

export default Receipt;
