import React, { useEffect, useState } from "react";
import Games from "../games";
import GameDetails from "../game-detailes";
import Receipt from "../receipt";
import { GameModule } from "../modules/game-module";
import "../styles/manager-style.css";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import ManagerHeader from "../manager-header";
import { ShopModule } from "../modules/shop-module";
import axios from "axios";
import { AppUrl } from "../activities/app-url";
import { SelectedGameModule } from "../modules/selected-game-module";
import { GameNumber } from "../modules/game_number_module";

import xml2js from "xml2js";

interface UserData {
  block_status: number;
  created_by: number;
  date_added: string;
  date_updated: string;
  duty_station: string;
  first_name: string;
  last_name: string;
  linked_to: number;
  login_status: number;
  manager_id: number;
  max_payout: number;
  max_stake: number;
  min_stake: number;
  operator: number;
  sales_limit: number;
  shop_id: number;
  shop_location: string;
  shop_name: string;
  user_email: string;
  user_id: string;
  user_password: string;
  user_role: string;
  user_telephone: string;
}

interface Props {}

const ManagerPage: React.FC<Props> = ({}) => {
  const [receiptNumber, setReceiptNumber] = useState<number>(0);

  const [receiptGames, setReceiptGames] = useState<SelectedGameModule[]>([]);
  const [showGameDetails, setShowGameDetails] = useState<boolean>(false);
  const [managerCreditBalance, setManagerCreditBalance] = useState<number>(0);
  const [selectedGame, setSelectedGame] = useState<SelectedGameModule>({
    cashier_id: 0,
    game_number: 0,
    event_id: 0,
    home_team: "",
    away_team: "",
    date_played: "",
    date_added: "",
    bet: "",
    odd: 0,
    short_score: "",
    long_score: "",
  });
  const [odds, setOdds] = useState<number[]>([1]);
  const [totalOdds, setTotalOdds] = useState<number>(4);
  const [shop, setShop] = useState<ShopModule>({
    shopID: 0,
    adminId: 0,
    shopName: "",
    shopLocation: "",
    miniStake: 0,
    maxStake: 0,
    salesLimit: 0,
    maxPaypout: 0,
    shopOperator: 0,
  });

  const [currentGame, setCurrentGame] = useState<GameModule[]>([]);

  const [navLinks, setNavLinks] = useState<NavLinkModule[]>([
    {
      lable: "Games",
      link: "/manager-page",
      status: "active",
    },
    {
      lable: "Cashiers",
      link: "/cashiers-page",
    },
    {
      lable: "Credit",
      link: "/manager-credit-report",
    },
  ]);

  const [eventNumbers, setEventNumbers] = useState<GameNumber[]>([]);
  const [resultIDs, setResltIDs] = useState<string[]>([]);
  const [allPreMatchGames, setAllPreMatchGames] = useState<GameModule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const parseXml = async (xmlString: string) => {
    try {
      const parser = new xml2js.Parser();
      const parsedXml = await parser.parseStringPromise(xmlString);
      return parsedXml;
    } catch (error) {
      console.error("Error parsing XML:", error);
      throw error;
    }
  };

  // FETCHING IDS FROM SAVED GAMES AND USE THEM TO GET GAME RESULTS FROM THE API
  useEffect(() => {
    const interval = setInterval(() => {
      const ids: number[] = [];
      axios
        .get(`${AppUrl()}/fetch-result-ids`)
        .then((res) => {
          res.data.IDs.map((id: any) => ids.push(id.event_id));
          res.data.IDs.forEach((id: any) => {});
          setResltIDs(res.data.IDs);
        })
        .catch((error) => console.log(error));

      var currentDate = new Date();

      // Subtract one day from the current date
      var yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      // Get the timestamp for yesterday
      var yesterdayTimestamp = yesterday.getTime();

      console.log(new Date(yesterdayTimestamp));
    }, 100000);

    return () => clearInterval(interval);
  }, []);

  // FETCH API PRE-MATCH GAMES
  useEffect(() => {
    // const interval = setInterval(() => {
    axios
      .get(`${AppUrl()}/fetch-games`)
      .then(async (res) => {
        const result = await parseXml(res.data.games);
        const pre_match_games = [
          ...result.markets.S.map((s: any) =>
            s.C.map((c: any) =>
              c.L.map((l: any) =>
                l.E.map((e: any, i: number) => {
                  return {
                    league_name: c.$.N + " " + l.$.N,
                    event: e.$,
                    markets: e.M,
                  };
                })
              )
            )
          ),
        ];

        const allGames: GameModule[] = [];
        const markets: any[] = [];
        pre_match_games.forEach((game) => {
          const pr_game = [...game.map((g: any) => g)];
          pr_game.forEach((prg: any) =>
            prg.map((pg: any) =>
              pg.forEach((p: any) => {
                allGames.push(p);
                const mts = [p.markets];
                mts.forEach((m) => markets.push(m));
              })
            )
          );
        });

        setAllPreMatchGames(allGames.filter((ag) => ag.markets !== undefined));
        setLoading(false);
      })
      .catch((error) => console.log(error));
    // }, 30000);

    // return () => clearInterval(interval);
  }, []);

  // SETTING CURRENT USER DETAILS TO THE SHOP
  useEffect(() => {
    const currentUser: UserData = JSON.parse(
      localStorage.getItem("user") as string
    );

    setShop({
      ...shop,
      miniStake: currentUser.min_stake,
      maxStake: currentUser.max_stake,
      maxPaypout: currentUser.max_payout,
      shopID: currentUser.shop_id,
      adminId: parseInt(currentUser.user_id),
    });
  }, []);

  // FETCHING MANAGER CREDIT BALALNCE
  useEffect(() => {
    // const interval = setInterval(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: UserData = JSON.parse(user);

    const userToken: string = localStorage.getItem("token") as string;
    axios
      .get(`${AppUrl()}/fetch-credit-balance/${current_user.user_id}`, {
        headers: { "x-access-token": userToken },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setManagerCreditBalance(res.data.credit_balance.available_credit);
        } else {
          if (res.data.message === "Authentication failed") {
            window.location.href = "/";
          }
        }
      })
      .catch((error) => console.log(error));
    // }, 120000);

    // return () => clearInterval(interval);
  }, []);

  //  FETCHING EVENT NUMBERS
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-event-numbers`)
        .then((res) => setEventNumbers(res.data.event_IDs))
        .catch((error) => console.log(error));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main">
      <ManagerHeader
        managerCreditBalance={managerCreditBalance}
        setManagerCreditBalance={setManagerCreditBalance}
      />
      <div className="body col-12 d-flex flex-wrap">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
        <div className="games col-md-7 col-sm-12 col-lg-7 col-xl-7 border-right border-danger">
          {!showGameDetails ? (
            <Games
              receiptGames={receiptGames}
              setReceiptGames={setReceiptGames}
              setShowGameDetails={setShowGameDetails}
              setManagerCreditBalance={setManagerCreditBalance}
              setSelectedGame={setSelectedGame}
              selectedGame={selectedGame}
              odds={odds}
              loading={loading}
              games={allPreMatchGames}
              setCurrentGame={setCurrentGame}
              eventNumbers={eventNumbers}
              setEventNumbers={setEventNumbers}
            />
          ) : (
            <GameDetails
              showGameDetails={showGameDetails}
              setShowGameDetails={setShowGameDetails}
              currentGame={currentGame}
              setSelectedGame={setSelectedGame}
              setOdds={setOdds}
              odds={odds}
              selectedGame={selectedGame}
              receiptGames={receiptGames}
              setReceiptGames={setReceiptGames}
              setCurrentGame={setCurrentGame}
              eventNumbers={eventNumbers}
              receiptNumber={receiptNumber}
              setReceiptNumber={setReceiptNumber}
            />
          )}
        </div>

        <div className="col-md-3 col-sm-12 col-lg-3 col-xl-3">
          <Receipt
            receiptGames={receiptGames}
            setReceiptGames={setReceiptGames}
            managerCreditBalance={managerCreditBalance}
            shop={shop}
            odds={odds}
            setOdds={setOdds}
            // stake={stake}
            // setStake={setStake}
            // possibleWin={possibleWin}
            // setPossibleWin={setPossibleWin}
            totalOdds={totalOdds}
            setTotalOdds={setTotalOdds}
            receiptNumber={receiptNumber}
            setReceiptNumber={setReceiptNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
