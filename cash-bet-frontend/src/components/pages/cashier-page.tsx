import React, { useEffect, useState } from "react";
import "../styles/cashier-interface-style.css";
import Games from "../games";
import { GameModule } from "../modules/game-module";
import GameDetails from "../game-detailes";
import CashierHeader from "../cashier-header";
import Receipt from "../receipt";
import { ShopModule } from "../modules/shop-module";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { SelectedGameModule } from "../modules/selected-game-module";
import { GameNumber } from "../modules/game_number_module";
import axios from "axios";
import { AppUrl } from "../activities/app-url";
import xml2js from "xml2js";
import ScreenPreloader from "../screen-preloader";

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

interface Props {
  // games: GameModule[];
}

const CashierPage: React.FC<Props> = ({}) => {
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
  // const [stake, setStake] = useState<number>(0);
  // const [possibleWin, setPossibleWin] = useState<number>(0);
  const [totalOdds, setTotalOdds] = useState<number>(0);

  const [currentGame, setCurrentGame] = useState<GameModule[]>([]);

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

  const [navLinks, setNavLinks] = useState<NavLinkModule[]>([
    {
      lable: "Games",
      link: "/cashier-page",
      status: "active",
    },

    // {
    //   lable: "Receipts",
    //   link: "/shop-cashier-receipts",
    // },

    // {
    //   lable: "Reports",
    //   link: "/shop-cashier-reports",
    // },
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
      axios
        .get(`${AppUrl()}/fetch-result-ids`)
        .then((res) => {
          setResltIDs(res.data.IDs);
        })
        .catch((error) => console.log(error));
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  // FETCHING API PRE-MATCH GAMES
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
    // }, 300000);
    // return () => clearInterval(interval);
  }, []);

  // SETTING CURRENT USER DETAILS
  useEffect(() => {
    const currentUser: UserData = JSON.parse(
      localStorage.getItem("user") as string
    );

    const user = localStorage.getItem("user");

    if (user !== null) {
      console.log(currentUser);
    } else {
      window.location.href = "/";
    }

    setShop({
      ...shop,
      miniStake: currentUser.min_stake,
      maxStake: currentUser.max_stake,
      maxPaypout: currentUser.max_payout,
      shopID: currentUser.shop_id,
      adminId: parseInt(currentUser.user_id),
    });
  }, []);

  // FETCHING THE NEW GENERATED IDS FROM THE SAVED EVENT_IDS
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
      <CashierHeader
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
              games={allPreMatchGames}
              setCurrentGame={setCurrentGame}
              eventNumbers={eventNumbers}
              setEventNumbers={setEventNumbers}
              loading={loading}
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

export default CashierPage;
