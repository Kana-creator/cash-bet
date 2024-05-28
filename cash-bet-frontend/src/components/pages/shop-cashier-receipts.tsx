import React, { useState } from "react";
import "../styles/cashier-interface-style.css";
// import Games from "../games";
// import { GameModule } from "../modules/game-module";
// import GameDetails from "../game-detailes";
import CashierHeader from "../cashier-header";
// import Receipt from "../receipt";
// import { ShopModule } from "../modules/shop-module";
// import axios from "axios";
// import { AppUrl } from "../activities/app-url";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";

// interface UserData {
//   block_status: number;
//   created_by: number;
//   date_added: string;
//   date_updated: string;
//   duty_station: string;
//   first_name: string;
//   last_name: string;
//   linked_to: number;
//   login_status: number;
//   manager_id: number;
//   max_payout: number;
//   max_stake: number;
//   min_stake: number;
//   operator: number;
//   sales_limit: number;
//   shop_id: number;
//   shop_location: string;
//   shop_name: string;
//   user_email: string;
//   user_id: string;
//   user_password: string;
//   user_role: string;
//   user_telephone: string;
// }

interface Props {
  //   games: GameModule[];
}

const ShopCashierReceipts: React.FC<Props> = () => {
  //   const [receiptGames, setReceiptGames] = useState<GameModule[]>([]);
  //   const [showGameDetails, setShowGameDetails] = useState<boolean>(false);
  const [managerCreditBalance, setManagerCreditBalance] = useState<number>(0);
  //   const [selectedGame, setSelectedGame] = useState<GameModule[]>([]);
  //   const [odds, setOdds] = useState<number[]>([]);
  //   const [stake, setStake] = useState<number>(0);
  //   const [possibleWin, setPossibleWin] = useState<number>(0);
  //   const [totalOdds, setTotalOdds] = useState<number>(0);
  // const [games, setGames] = useState<GameModule[]>([]);

  //   const [currentGame, setCurrentGame] = useState<GameModule>({
  //     awayCorner: 0,
  //     awayHalfScore: 0,
  //     awayId: "",
  //     awayName: "",
  //     awayRank: "",
  //     awayRed: 0,
  //     awayScore: 0,
  //     awayYellow: 0,
  //     explain: "",
  //     extraExplain: {
  //       awayScore: 0,
  //       extraAwayScore: 0,
  //       extraHomeScore: 0,
  //       extraTimeStatus: 0,
  //       homeScore: 0,
  //       kickOff: 0,
  //       minute: 0,
  //       penAwayScore: 0,
  //       penHomeScore: 0,
  //       twoRoundsAwayScore: 0,
  //       twoRoundsHomeScore: 0,
  //       winner: 0,
  //     },
  //     group: "",
  //     halfStartTime: 0,
  //     hasLineup: false,
  //     homeCorner: 0,
  //     homeHalfScore: 0,
  //     homeId: "",
  //     homeName: "",
  //     homeRank: "",
  //     homeRed: 0,
  //     homeScore: 0,
  //     homeYellow: 0,
  //     injuryTime: 0,
  //     leagueColor: "",
  //     leagueId: "",
  //     leagueName: "",
  //     leagueShortName: "",
  //     leagueType: 0,
  //     location: "",
  //     matchId: "",
  //     matchTime: 0,
  //     neutral: false,
  //     round: "",
  //     season: "",
  //     status: 0,
  //     subLeagueId: "",
  //     subLeagueName: "",
  //     temperature: "",
  //     updateTime: 0,
  //     var: "",
  //     weather: "",
  //   });

  //   const [shop, setShop] = useState<ShopModule>({
  //     shopID: 0,
  //     adminId: 0,
  //     shopName: "",
  //     shopLocation: "",
  //     miniStake: 0,
  //     maxStake: 0,
  //     salesLimit: 0,
  //     maxPaypout: 0,
  //     shopOperator: 0,
  //   });

  const [navLinks, setNavLinks] = useState<NavLinkModule[]>([
    {
      lable: "Games",
      link: "/cashier-page",
    },

    {
      lable: "Receipts",
      link: "/shop-cashier-receipts",
      status: "active",
    },
    {
      lable: "Reports",
      link: "/shop-cashier-reports",
    },
  ]);

  //   useEffect(() => {
  //     const currentUser: UserData = JSON.parse(
  //       localStorage.getItem("user") as string
  //     );

  //     setShop({
  //       ...shop,
  //       miniStake: currentUser.min_stake,
  //       maxStake: currentUser.max_stake,
  //       maxPaypout: currentUser.max_payout,
  //       shopID: currentUser.shop_id,
  //       adminId: parseInt(currentUser.user_id),
  //     });
  //   }, []);

  return (
    <div className="main">
      <CashierHeader
        managerCreditBalance={managerCreditBalance}
        setManagerCreditBalance={setManagerCreditBalance}
      />

      <div className="body col-12 d-flex flex-wrap">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
        {/* <div className="games col-md-7 col-sm-12 col-lg-7 col-xl-7 border-right border-danger"> */}
        {/* {!showGameDetails ? (
            <Games
              receiptGames={receiptGames}
              setReceiptGames={setReceiptGames}
              setShowGameDetails={setShowGameDetails}
              setManagerCreditBalance={setManagerCreditBalance}
              setSelectedGame={setSelectedGame}
              selectedGame={selectedGame}
              odds={odds}
              setOdds={setOdds}
              games={games}
              setCurrentGame={setCurrentGame}
            />
          ) : (
            <GameDetails
              showGameDetails={showGameDetails}
              setShowGameDetails={setShowGameDetails}
              currentGame={currentGame}
            />
          )} */}
        {/* </div> */}

        {/* <div className="col-md-3 col-sm-12 col-lg-3 col-xl-3">
          <Receipt
            receiptGames={receiptGames}
            setReceiptGames={setReceiptGames}
            managerCreditBalance={managerCreditBalance}
            shop={shop}
            odds={odds}
            setOdds={setOdds}
            stake={stake}
            setStake={setStake}
            possibleWin={possibleWin}
            setPossibleWin={setPossibleWin}
            totalOdds={totalOdds}
            setTotalOdds={setTotalOdds}
          />
        </div> */}
      </div>
    </div>
  );
};

export default ShopCashierReceipts;
