import React, { useEffect, useState } from "react";
import { GameModule } from "./modules/game-module";
import { SelectedGameModule } from "./modules/selected-game-module";
import { UserModule } from "./modules/user-module";
import { GameNumber } from "./modules/game_number_module";

interface Props {
  showGameDetails: boolean;
  setShowGameDetails: React.Dispatch<React.SetStateAction<boolean>>;
  currentGame: GameModule[];
  setSelectedGame: React.Dispatch<React.SetStateAction<SelectedGameModule>>;
  setOdds: React.Dispatch<React.SetStateAction<number[]>>;
  odds: number[];
  selectedGame: SelectedGameModule;
  receiptGames: SelectedGameModule[];
  setReceiptGames: React.Dispatch<React.SetStateAction<SelectedGameModule[]>>;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameModule[]>>;
  eventNumbers: GameNumber[];
  receiptNumber: number;
  setReceiptNumber: React.Dispatch<React.SetStateAction<number>>;
}

const GameDetails: React.FC<Props> = ({
  showGameDetails,
  setShowGameDetails,
  currentGame,
  setSelectedGame,
  setOdds,
  odds,
  selectedGame,
  receiptGames,
  setReceiptGames,
  setCurrentGame,
  eventNumbers,
  receiptNumber,
  setReceiptNumber,
}) => {
  const [x2Odds, set1x2Odds] = useState<[number, number, number]>([0, 0, 0]);
  const [x2_H1Odds, set1x2_H1Odds] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [x2_H2Odds, set1x2_H2Odds] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  // OVER/UNDER FULL TIME ODDS
  const [OU_0_5, setOU_0_5] = useState<[number, number]>([0, 0]);
  const [OU_1_5, setOU_1_5] = useState<[number, number]>([0, 0]);
  const [OU_2_5, setOU_2_5] = useState<[number, number]>([0, 0]);
  const [OU_3_5, setOU_3_5] = useState<[number, number]>([0, 0]);
  const [OU_4_5, setOU_4_5] = useState<[number, number]>([0, 0]);
  const [OU_5_5, setOU_5_5] = useState<[number, number]>([0, 0]);

  // OVER/UNDER FIRST HALF ODDS
  const [OU_0_5_H1, setOU_0_5_H1] = useState<[number, number]>([0, 0]);
  const [OU_1_5_H1, setOU_1_5_H1] = useState<[number, number]>([0, 0]);
  const [OU_2_5_H1, setOU_2_5_H1] = useState<[number, number]>([0, 0]);
  const [OU_3_5_H1, setOU_3_5_H1] = useState<[number, number]>([0, 0]);
  const [OU_4_5_H1, setOU_4_5_H1] = useState<[number, number]>([0, 0]);
  const [OU_5_5_H1, setOU_5_5_H1] = useState<[number, number]>([0, 0]);

  // OVER/UNDER SECOND HALF ODDS
  const [OU_0_5_H2, setOU_0_5_H2] = useState<[number, number]>([0, 0]);
  const [OU_1_5_H2, setOU_1_5_H2] = useState<[number, number]>([0, 0]);
  const [OU_2_5_H2, setOU_2_5_H2] = useState<[number, number]>([0, 0]);
  const [OU_3_5_H2, setOU_3_5_H2] = useState<[number, number]>([0, 0]);
  const [OU_4_5_H2, setOU_4_5_H2] = useState<[number, number]>([0, 0]);
  const [OU_5_5_H2, setOU_5_5_H2] = useState<[number, number]>([0, 0]);

  // HALF TIME/FULL TIME ODDS
  const [HTFT_odds, setHTFT_odds] = useState<
    [number, number, number, number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // ODD/EVEN NUMBER OF GOALS
  const [OE_odds, setOE_odds] = useState<[number, number]>([0, 0]);
  const [OE_H1, setOE_H1] = useState<[number, number]>([0, 0]);
  const [OE_H2, setOE_H2] = useState<[number, number]>([0, 0]);

  // BOTH TEAMS TO SCORE
  const [BTS_odds, setBTS_odds] = useState<[number, number]>([0, 0]);
  const [BTS_H1, setBTS_H1] = useState<[number, number]>([0, 0]);
  const [BTS_H2, setBTS_H2] = useState<[number, number]>([0, 0]);

  // DOUBLE CHANCE
  const [DC_odds, setDC_odds] = useState<[number, number, number]>([0, 0, 0]);
  const [DC_H1, setDC_H1] = useState<[number, number, number]>([0, 0, 0]);
  const [DC_H2, setDC_H2] = useState<[number, number, number]>([0, 0, 0]);

  // HIGHEST SCORING HALF
  const [HSH_odds, setHSH_odds] = useState<[number, number, number]>([0, 0, 0]);

  // TOTAL GOALS BOTH TEAMS TO SCORE
  const [TGBTS_odds, setTGBTS_odds] = useState<
    [number, number, number, number]
  >([0, 0, 0, 0]);

  // RESULTS AND TOTAL
  const [RTG_0_5, setRTG_0_5] = useState<
    [number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0]);
  const [RTG_1_5, setRTG_1_5] = useState<
    [number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0]);
  const [RTG_2_5, setRTG_2_5] = useState<
    [number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0]);
  const [RTG_3_5, setRTG_3_5] = useState<
    [number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0]);
  const [RTG_4_5, setRTG_4_5] = useState<
    [number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0]);
  const [RTG_5_5, setRTG_5_5] = useState<
    [number, number, number, number, number, number]
  >([0, 0, 0, 0, 0, 0]);

  // DRAW NO BET
  const [DNB_odds, setDNB_odds] = useState<[number, number]>([0, 0]);

  // EUROPEAN HANDCAP (EH)
  const [EH_5_0, setEH_5_0] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_4_0, setEH_4_0] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_3_0, setEH_3_0] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_2_0, setEH_2_0] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_1_0, setEH_1_0] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_0_1, setEH_0_1] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_0_2, setEH_0_2] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_0_3, setEH_0_3] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_0_4, setEH_0_4] = useState<[number, number, number]>([0, 0, 0]);
  const [EH_0_5, setEH_0_5] = useState<[number, number, number]>([0, 0, 0]);

  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    eventNumbers && eventNumbers.length > 0
      ? eventNumbers.forEach((eventNumber: GameNumber) => {
          if (eventNumber.event_number === Number(currentGame[0].event.I)) {
            setIds([eventNumber.id]);
          }
        })
      : setIds([]);
  }, [currentGame]);

  // SET THE CURRENT

  useEffect(() => {
    const current_user: UserModule = JSON.parse(
      localStorage.getItem("user") as string
    );
    setSelectedGame({
      cashier_id: Number(current_user.user_id),
      game_number: Number(currentGame[0].event.I),
      event_id: Number(currentGame[0].event.I),
      home_team: currentGame[0].event.T1,
      away_team: currentGame[0].event.T2,
      date_played: currentGame[0].event.DT,
      date_added: new Date().toISOString(),
      bet: "",
      odd: 0,
      short_score: "",
      long_score: "",
    });
  }, [x2Odds]);

  useEffect(() => {
    const allOdds: any[] = [];
    const mkts: any[] = [currentGame[0].markets];
    mkts.forEach((mkt: any[]) =>
      mkt.forEach((mk) =>
        mk.B.map((bookmark: any) =>
          allOdds.push({ market: mk.$, odds: [...bookmark.O] })
        )
      )
    );

    // console.log(allOdds);
    // console.log(allOdds.filter((odds) => odds.market.K.includes("1x2")));

    // 1x2 ODDS
    set1x2Odds(
      allOdds.filter((odds) => odds.market.K == "1x2").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "1x2")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    // 1x2 FIRST HALF
    set1x2_H1Odds(
      allOdds.filter((odds) => odds.market.K == "1x2_H1").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "1x2_H1")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    // 1x2 SECOND HALF
    set1x2_H2Odds(
      allOdds.filter((odds) => odds.market.K == "1x2_H2").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "1x2_H2")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    // OVER/UNDER FULL TIME
    setOU_0_5(
      allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 0.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OU" && odds.market.H == 0.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_1_5(
      allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 1.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OU" && odds.market.H == 1.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_2_5(
      allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 2.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OU" && odds.market.H == 2.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_3_5(
      allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 3.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OU" && odds.market.H == 3.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_4_5(
      allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 4.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OU" && odds.market.H == 4.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_5_5(
      allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 5.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OU" && odds.market.H == 5.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_0_5_H1(
      allOdds.filter((odds) => odds.market.K == "OU_H1" && odds.market.H == 0.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H1" && odds.market.H == 0.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_1_5_H1(
      allOdds.filter((odds) => odds.market.K == "OU_H1" && odds.market.H == 1.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H1" && odds.market.H == 1.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_2_5_H1(
      allOdds.filter((odds) => odds.market.K == "OU_H1" && odds.market.H == 2.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H1" && odds.market.H == 2.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_3_5_H1(
      allOdds.filter((odds) => odds.market.K == "OU_H1" && odds.market.H == 3.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H1" && odds.market.H == 3.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_4_5_H1(
      allOdds.filter((odds) => odds.market.K == "OU_H1" && odds.market.H == 4.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H1" && odds.market.H == 4.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_5_5_H1(
      allOdds.filter((odds) => odds.market.K == "OU_H1" && odds.market.H == 5.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H1" && odds.market.H == 5.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    // OVER/UNDER SECOND HALF
    setOU_0_5_H2(
      allOdds.filter((odds) => odds.market.K == "OU_H2" && odds.market.H == 0.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H2" && odds.market.H == 0.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_1_5_H2(
      allOdds.filter((odds) => odds.market.K == "OU_H2" && odds.market.H == 1.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H2" && odds.market.H == 1.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_2_5_H2(
      allOdds.filter((odds) => odds.market.K == "OU_H2" && odds.market.H == 2.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H2" && odds.market.H == 2.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_3_5_H2(
      allOdds.filter((odds) => odds.market.K == "OU_H2" && odds.market.H == 3.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H2" && odds.market.H == 3.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_4_5_H2(
      allOdds.filter((odds) => odds.market.K == "OU_H2" && odds.market.H == 4.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H2" && odds.market.H == 4.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOU_5_5_H2(
      allOdds.filter((odds) => odds.market.K == "OU_H2" && odds.market.H == 5.5)
        .length !== 0
        ? allOdds
            .filter(
              (odds) => odds.market.K == "OU_H2" && odds.market.H == 5.5
            )[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setHTFT_odds(
      allOdds.filter((odds) => odds.market.K == "HTFT").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "HTFT")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0, 0, 0, 0]
    );

    // ODD OR EVEN NUMBER OF GOALS
    setOE_odds(
      allOdds.filter((odds) => odds.market.K == "OE").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OE")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOE_H1(
      allOdds.filter((odds) => odds.market.K == "OE_H1").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OE_H1")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setOE_H2(
      allOdds.filter((odds) => odds.market.K == "OE_H2").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "OE_H2")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    // BOTH TEAMS TO SCORE
    setBTS_odds(
      allOdds.filter((odds) => odds.market.K == "BTS").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "BTS")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setBTS_H1(
      allOdds.filter((odds) => odds.market.K == "BTS_H1").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "BTS_H1")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    setBTS_H2(
      allOdds.filter((odds) => odds.market.K == "BTS_H2").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "BTS_H2")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    // DOUBLE CHANCE
    setDC_odds(
      allOdds.filter((odds) => odds.market.K == "DC").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "DC")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setDC_H1(
      allOdds.filter((odds) => odds.market.K == "DC_H1").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "DC_H1")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setDC_H2(
      allOdds.filter((odds) => odds.market.K == "DC_H2").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "DC_H2")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    // HIGHEST SCORING HALF
    setHSH_odds(
      allOdds.filter((odds) => odds.market.K == "HSH").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "HSH")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    // TOTAL GOALS BOTH TEAMS TO SCORE
    setTGBTS_odds(
      allOdds.filter((odds) => odds.market.K == "TGBTS").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "TGBTS")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0]
    );

    // RESULTS AND TOTAL
    setRTG_0_5(
      allOdds.filter((odds) => odds.market.K == "RTG" && odds.market.H == 0.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "RTG" && odds.market.H == 0.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0]
    );

    setRTG_1_5(
      allOdds.filter((odds) => odds.market.K == "RTG" && odds.market.H == 1.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "RTG" && odds.market.H == 1.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0]
    );

    setRTG_2_5(
      allOdds.filter((odds) => odds.market.K == "RTG" && odds.market.H == 2.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "RTG" && odds.market.H == 2.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0]
    );

    setRTG_3_5(
      allOdds.filter((odds) => odds.market.K == "RTG" && odds.market.H == 3.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "RTG" && odds.market.H == 3.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0]
    );

    setRTG_4_5(
      allOdds.filter((odds) => odds.market.K == "RTG" && odds.market.H == 4.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "RTG" && odds.market.H == 4.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0]
    );

    setRTG_5_5(
      allOdds.filter((odds) => odds.market.K == "RTG" && odds.market.H == 5.5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "RTG" && odds.market.H == 5.5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0, 0, 0, 0]
    );

    // DRAW NO BET
    setDNB_odds(
      allOdds.filter((odds) => odds.market.K == "DNB").length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "DNB")[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0]
    );

    // EUROPEAN HANDCAP (EU)
    setEH_5_0(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == -5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == -5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_4_0(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == -4)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == -4)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_3_0(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == -3)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == -3)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_2_0(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == -2)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == -2)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_1_0(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == -1)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == -1)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_0_1(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == 1)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == 1)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_0_2(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == 2)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == 2)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_0_3(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == 3)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == 3)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_0_4(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == 4)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == 4)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );

    setEH_0_5(
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == 5)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == 5)[0]
            .odds.map((odd: any) => odd.$.V)
        : [0, 0, 0]
    );
  }, [currentGame]);

  // SETTING GAME ODDS AND BETTING MARKETS FOR THE SELECTED GAME
  const setOddsOnClick = (
    id: number,
    bet: string,
    odd: number,

    selectedGamee: SelectedGameModule
  ) => {
    const exists = receiptGames.filter((rg) => rg.game_number == id);
    if (exists.length > 0) {
      setShowGameDetails(false);
      window.alert("Bet on the same game already placed.");
    } else {
      if (odd > 0) {
        selectedGame.game_number = id;
        selectedGame.bet = bet;
        selectedGame.odd = odd;
        setOdds([...odds, odd]);
        setReceiptGames([...receiptGames, selectedGamee]);

        setShowGameDetails(false);
      } else {
        window.alert("You can't bet with zero odds");
      }
    }
  };

  const [datesDate, setDatesDate] = useState<string>("");
  const [datesTime, setDatesTime] = useState<string>("");

  useEffect(() => {
    const dateString = currentGame[0].event.DT;
    const date = new Date(dateString);
    const offsetInMinutes = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offsetInMinutes * 60000);
    const dateDate = new Date(localDate).toLocaleDateString();
    const dateTime = new Date(localDate).toLocaleTimeString();
    setDatesDate(dateDate);
    setDatesTime(dateTime);
  }, []);

  return (
    <div className="game-details col-12">
      <span
        className="back-button btn btn-primary"
        onClick={() => {
          setShowGameDetails(false);
          setCurrentGame([]);
        }}
      >
        <span>{`<`}</span>Back
      </span>

      <div className="shortcut col-12 d-flex justify-content-center align-items-center ">
        <input
          type="number"
          name=""
          id="shortcut"
          autoComplete="false"
          className="col-md-6 fs-5 px-4"
          placeholder="Enter shortcut"
          autoFocus={true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            selectedGame.game_number = ids[0];
            if (e.target.value === "1") {
              // setOddsOnClick(ids[0], "FT 1x2: 1", x2Odds[0], selectedGame);
              selectedGame.bet = `FT_1x2: 1`;
              selectedGame.odd = x2Odds[0];
              setOdds([...odds, x2Odds[0]]);
            } else if (e.target.value === "0") {
              // setOddsOnClick(ids[0], "FT 1x2: X", x2Odds[1], selectedGame);
              selectedGame.bet = `FT_1x2: X`;
              selectedGame.odd = x2Odds[1];
              setOdds([...odds, x2Odds[1]]);
            } else if (e.target.value === "2") {
              // setOddsOnClick(ids[0], "FT 1x2: 2", x2Odds[2], selectedGame);
              selectedGame.bet = `FT_1x2: 2`;
              selectedGame.odd = x2Odds[2];
              setOdds([...odds, x2Odds[2]]);
            } else if (e.target.value === "10") {
              // setOddsOnClick(ids[0], "DC_T1/X", DC_odds[0], selectedGame);
              selectedGame.bet = `DC_T1/X`;
              selectedGame.odd = DC_odds[0];
              setOdds([...odds, DC_odds[0]]);
            } else if (e.target.value === "12") {
              // setOddsOnClick(ids[0], "DC_T1/X", DC_odds[0], selectedGame);
              selectedGame.bet = `DC_T1/T2`;
              selectedGame.odd = DC_odds[1];
              setOdds([...odds, DC_odds[1]]);
            } else if (e.target.value === "02") {
              // setOddsOnClick(ids[0], "DC_T1/X", DC_odds[0], selectedGame);
              selectedGame.bet = `DC_X/T2`;
              selectedGame.odd = DC_odds[2];
              setOdds([...odds, DC_odds[2]]);
            } else if (e.target.value === "++") {
              // setOddsOnClick(ids[0], "DC_T1/X", DC_odds[0], selectedGame);
              selectedGame.bet = `BTS_YES`;
              selectedGame.odd = BTS_odds[0];
              setOdds([...odds, BTS_odds[0]]);
            } else if (e.target.value === "+-") {
              // setOddsOnClick(ids[0], "DC_T1/X", DC_odds[0], selectedGame);
              selectedGame.bet = `BTS_NO`;
              selectedGame.odd = BTS_odds[1];
              setOdds([...odds, BTS_odds[1]]);
            } else {
              selectedGame.bet = "";
              selectedGame.odd = 0;
            }
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              if (selectedGame.odd === 0) {
                setShowGameDetails(true);
              } else {
                if (receiptGames.length > 0) {
                  const exists = receiptGames.filter(
                    (rg) => rg.game_number == ids[0]
                  );
                  if (exists.length > 0) {
                    window.alert("Bet on the same game already placed.");
                    setShowGameDetails(false);
                  } else {
                    setReceiptGames([...receiptGames, selectedGame]);
                    setShowGameDetails(false);
                  }
                } else {
                  setReceiptGames([...receiptGames, selectedGame]);
                  setShowGameDetails(false);
                }
              }
            }
          }}
        />
      </div>

      <div className="heading col-12 d-flex justify-content-center">
        <div className="span col-7 px-4 d-flex justify-content-around">
          <span>{ids[0]}</span>
          <strong>{currentGame[0].event.T1}</strong>
          <span className="text-center">
            {new Date(datesDate).toDateString()} <br /> {datesTime}
          </span>
          <strong>{currentGame[0].event.T2}</strong>
        </div>
      </div>

      <div className=" details-body col-12 px-1 d-flex justify-contet-center">
        {/* LEFT SIDE */}
        <div className="left col-6 p-2">
          <table className="col-12">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  Match Results
                </td>
              </tr>
              <tr className="text-center">
                <td
                  title={`1x2_FT: 1`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(ids[0], "1x2_FT: 1", x2Odds[0], selectedGame)
                  }
                >
                  {currentGame[0].event.T1}{" "}
                  <strong className="text-warning">{x2Odds[0]}</strong>
                </td>
                <td
                  title={`1x2_FT: X`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(ids[0], "1x2_FT: X", x2Odds[1], selectedGame)
                  }
                >
                  X <strong className="text-warning">{x2Odds[1]}</strong>
                </td>
                <td
                  title={`1x2_FT: 2`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(ids[0], "1x2_FT: 2", x2Odds[2], selectedGame)
                  }
                >
                  {currentGame[0].event.T2}{" "}
                  <strong className="text-warning">{x2Odds[2]}</strong>
                </td>
              </tr>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  Match Result HalfTime
                </td>
              </tr>
              <tr>
                <td
                  title={`1x2_H1: 1`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "1x2_H1: 1",
                      x2_H1Odds[0],
                      selectedGame
                    )
                  }
                >
                  {currentGame[0].event.T1}{" "}
                  <strong className="text-warning">{x2_H1Odds[0]}</strong>
                </td>
                <td
                  title={`1x2_H1: X`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "1x2_H1: X",
                      x2_H1Odds[1],
                      selectedGame
                    )
                  }
                >
                  X <strong className="text-warning">{x2_H1Odds[1]}</strong>
                </td>
                <td
                  title={`1x2_H1: 2`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "1x2_H1: 2",
                      x2_H1Odds[2],
                      selectedGame
                    )
                  }
                >
                  {currentGame[0].event.T2}{" "}
                  <strong className="text-warning">{x2_H1Odds[2]}</strong>
                </td>
              </tr>
              <tr className="column">
                <td colSpan={3} className="py-1">
                  {" "}
                  Match Result SecondHalf
                </td>
              </tr>
              <tr>
                <td
                  title={`1x2_H2: 1`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "1x2_H2: 1",
                      x2_H2Odds[0],
                      selectedGame
                    )
                  }
                >
                  {currentGame[0].event.T1}{" "}
                  <strong className="text-warning">{x2_H2Odds[0]}</strong>
                </td>
                <td
                  title={`1x2_H2: X`}
                  className="col-4"
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "1x2_H2: X",
                      x2_H2Odds[1],
                      selectedGame
                    )
                  }
                >
                  X <strong className="text-warning">{x2_H2Odds[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`1x2_H2: 2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "1x2_H2: 2",
                      x2_H2Odds[2],
                      selectedGame
                    )
                  }
                >
                  {currentGame[0].event.T2}{" "}
                  <strong className="text-warning">{x2_H2Odds[2]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  Over/Uder
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4"></td>
                <td className="col-4">Over</td>
                <td className="col-4">Under</td>
              </tr>
              <tr className="textcenter">
                <td>0.5</td>
                <td
                  title={`Over_0.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_0.5_FT",
                      OU_0_5[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_0_5[0]}</strong>
                </td>
                <td
                  title={`Under_0.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_FT",
                      OU_0_5[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_0_5[1]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">1.5</td>
                <td
                  className="col-4"
                  title={`Over_1.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_1.5_FT",
                      OU_1_5[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_1_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_0.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_FT",
                      OU_1_5[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_1_5[1]}</strong>
                </td>
              </tr>
              <tr className="">
                <td>2.5</td>

                <td
                  className="col-4"
                  title={`Over_2.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_FT",
                      OU_2_5[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_2_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_2.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_2.5_FT",
                      OU_2_5[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_2_5[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-4">3.5</td>
                <td
                  className="col-4"
                  title={`Over_2.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_FT",
                      OU_2_5[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_3_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_3.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_3.5_FT",
                      OU_3_5[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_3_5[1]}</strong>
                </td>
              </tr>
              <tr className="">
                <td>4.5</td>

                <td
                  className="col-4"
                  title={`Over_4.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_4.5_FT",
                      OU_4_5[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_4_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_4.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_4.5_FT",
                      OU_4_5[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_4_5[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-4">5.5</td>
                <td
                  className="col-4"
                  title={`Over_5.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_5.5_FT",
                      OU_5_5[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_5_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_5.5_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_5.5_FT",
                      OU_5_5[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_5_5[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  First Half Under/Over
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4"></td>
                <td className="col-4">Over</td>
                <td className="col-4">Under</td>
              </tr>
              <tr className="textcenter">
                <td className="col-4">0.5</td>
                <td
                  className="col-4"
                  title={`Over_0.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_0.5_H1",
                      OU_0_5_H1[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_0_5_H1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_0.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_H1",
                      OU_0_5_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_0_5_H1[1]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">1.5</td>
                <td
                  className="col-4"
                  title={`Over_1.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_1.5_H1",
                      OU_1_5_H1[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_1_5_H1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_1.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_1.5_H1",
                      OU_1_5_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_1_5_H1[1]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">2.5</td>
                <td
                  className="col-4"
                  title={`Over_2.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_H1",
                      OU_2_5_H1[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_2_5_H1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_2.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_2.5_H1",
                      OU_2_5_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_2_5_H1[1]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">3.5</td>
                <td
                  className="col-4"
                  title={`Over_3.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_3.5_H1",
                      OU_3_5_H1[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_3_5_H1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_3.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_3.5_H1",
                      OU_3_5_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_3_5_H1[1]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">4.5</td>
                <td
                  className="col-4"
                  title={`Over_4.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_4.5_H1",
                      OU_4_5_H1[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_4_5_H1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_4.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_4.5_H1",
                      OU_4_5_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_4_5_H1[1]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td className="col-4">5.5</td>
                <td
                  className="col-4"
                  title={`Over_0.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_5.5_H1",
                      OU_5_5_H1[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_5_5_H1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_5.5_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_5.5_H1",
                      OU_5_5_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_5_5_H1[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  Second Half Under/Over
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4"></td>
                <td className="col-4">Over</td>
                <td className="col-4">Under</td>
              </tr>
              <tr className="textcenter">
                <td>0.5</td>
                <td
                  title={`Over_0.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_0.5_H2",
                      OU_0_5_H2[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_0_5_H2[0]}</strong>
                </td>
                <td
                  title={`Under_0.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_H2",
                      OU_0_5_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_0_5_H2[1]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">1.5</td>
                <td
                  className="col-4"
                  title={`Over_1.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_1.5_H2",
                      OU_1_5_H2[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_1_5_H2[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_1.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_1.5_H2",
                      OU_1_5_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_1_5_H2[1]}</strong>
                </td>
              </tr>
              <tr className="">
                <td>2.5</td>

                <td
                  className="col-4"
                  title={`Over_2.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_H2",
                      OU_2_5_H2[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_2_5_H2[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_2.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_2.5_H2",
                      OU_2_5_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_2_5_H2[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-4">3.5</td>
                <td
                  className="col-4"
                  title={`Over_3.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_3.5_H2",
                      OU_3_5_H2[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_3_5_H2[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_3.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_3.5_H2",
                      OU_3_5_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_3_5_H2[1]}</strong>
                </td>
              </tr>
              <tr className="">
                <td>4.5</td>

                <td
                  className="col-4"
                  title={`Over_4.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_4.5_H2",
                      OU_4_5_H2[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_4_5_H2[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_4.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_4.5_H2",
                      OU_4_5_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_4_5_H2[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-4">5.5</td>
                <td
                  className="col-4"
                  title={`Over_5.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_5.5_H2",
                      OU_5_5_H2[0],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_5_5_H2[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_5.5_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_5.5_H2",
                      OU_5_5_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning">{OU_5_5_H2[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  HalfTime Full Time
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`HTFT_1/1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_1/1",
                      HTFT_odds[0],
                      selectedGame
                    )
                  }
                >
                  1/1
                  <strong className="text-warning"> {HTFT_odds[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HTFT_1/X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_1/X",
                      HTFT_odds[1],
                      selectedGame
                    )
                  }
                >
                  1/x
                  <strong className="text-warning"> {HTFT_odds[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HTFT_1/2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_1/2",
                      HTFT_odds[2],
                      selectedGame
                    )
                  }
                >
                  1/2
                  <strong className="text-warning"> {HTFT_odds[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`HTFT_X/1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_X/1",
                      HTFT_odds[3],
                      selectedGame
                    )
                  }
                >
                  x/1
                  <strong className="text-warning"> {HTFT_odds[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HTFT_X/X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_X/X",
                      HTFT_odds[4],
                      selectedGame
                    )
                  }
                >
                  x/x
                  <strong className="text-warning"> {HTFT_odds[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HTFT_X/2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_X/2",
                      HTFT_odds[5],
                      selectedGame
                    )
                  }
                >
                  x/2
                  <strong className="text-warning"> {HTFT_odds[5]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`HTFT_2/1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_2/1",
                      HTFT_odds[6],
                      selectedGame
                    )
                  }
                >
                  2/1
                  <strong className="text-warning"> {HTFT_odds[6]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HTFT_2/X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_2/X",
                      HTFT_odds[7],
                      selectedGame
                    )
                  }
                >
                  2/x
                  <strong className="text-warning"> {HTFT_odds[7]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HTFT_2/2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HTFT_2/2",
                      HTFT_odds[8],
                      selectedGame
                    )
                  }
                >
                  2/2
                  <strong className="text-warning"> {HTFT_odds[8]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="p-1">
                  1X2 and Over/Under - Full Time
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Over_0.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_0.5_T1",
                      RTG_0_5[0],
                      selectedGame
                    )
                  }
                >
                  1-Over(0.5)
                  <strong className="text-warning"> {RTG_0_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_0.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_0.5_X",
                      RTG_0_5[1],
                      selectedGame
                    )
                  }
                >
                  x-Over(0.5)
                  <strong className="text-warning"> {RTG_0_5[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_0.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_0.5_T2",
                      RTG_0_5[2],
                      selectedGame
                    )
                  }
                >
                  2-Over(0.5)
                  <strong className="text-warning"> {RTG_0_5[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Under_0.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_T1",
                      RTG_0_5[3],
                      selectedGame
                    )
                  }
                >
                  1-Under(0.5)
                  <strong className="text-warning"> {RTG_0_5[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_0.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_X",
                      RTG_0_5[4],
                      selectedGame
                    )
                  }
                >
                  x-Under(0.5)
                  <strong className="text-warning"> {RTG_0_5[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_0.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_0.5_T2",
                      RTG_0_5[5],
                      selectedGame
                    )
                  }
                >
                  2-Under(0.5)
                  <strong className="text-warning"> {RTG_0_5[5]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Over_1.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_1.5_T1",
                      RTG_1_5[0],
                      selectedGame
                    )
                  }
                >
                  1-Over(1.5)
                  <strong className="text-warning"> {RTG_1_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_1.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_1.5_X",
                      RTG_1_5[1],
                      selectedGame
                    )
                  }
                >
                  x-Over(1.5)
                  <strong className="text-warning"> {RTG_1_5[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_1.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_1.5_T2",
                      RTG_1_5[2],
                      selectedGame
                    )
                  }
                >
                  2-Over(1.5)
                  <strong className="text-warning"> {RTG_1_5[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Under_1.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_1.5_T1",
                      RTG_1_5[3],
                      selectedGame
                    )
                  }
                >
                  1-Under(1.5)
                  <strong className="text-warning"> {RTG_1_5[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_1.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_1.5_X",
                      RTG_1_5[4],
                      selectedGame
                    )
                  }
                >
                  x-Under(1.5)
                  <strong className="text-warning"> {RTG_1_5[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_1.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_1.5_T2",
                      RTG_1_5[5],
                      selectedGame
                    )
                  }
                >
                  2-Under(1.5)
                  <strong className="text-warning"> {RTG_1_5[5]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Over_2.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_T1",
                      RTG_2_5[0],
                      selectedGame
                    )
                  }
                >
                  1-Over(2.5)
                  <strong className="text-warning"> {RTG_2_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_2.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_X",
                      RTG_2_5[1],
                      selectedGame
                    )
                  }
                >
                  x-Over(2.5)
                  <strong className="text-warning"> {RTG_2_5[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_2.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_2.5_T2",
                      RTG_2_5[2],
                      selectedGame
                    )
                  }
                >
                  2-Over(2.5)
                  <strong className="text-warning"> {RTG_2_5[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Under_2.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_2.5_T1",
                      RTG_2_5[3],
                      selectedGame
                    )
                  }
                >
                  1-Under(2.5)
                  <strong className="text-warning"> {RTG_2_5[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_2.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_2.5_X",
                      RTG_2_5[4],
                      selectedGame
                    )
                  }
                >
                  x-Under(2.5)
                  <strong className="text-warning"> {RTG_2_5[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_2.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_2.5_T2",
                      RTG_2_5[5],
                      selectedGame
                    )
                  }
                >
                  2-Under(2.5)
                  <strong className="text-warning"> {RTG_2_5[5]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Over_3.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_3.5_T1",
                      RTG_3_5[0],
                      selectedGame
                    )
                  }
                >
                  1-Over(3.5)
                  <strong className="text-warning"> {RTG_3_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_3.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_3.5_X",
                      RTG_3_5[1],
                      selectedGame
                    )
                  }
                >
                  x-Over(3.5)
                  <strong className="text-warning"> {RTG_3_5[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_3.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_3.5_T2",
                      RTG_3_5[2],
                      selectedGame
                    )
                  }
                >
                  2-Over(3.5)
                  <strong className="text-warning"> {RTG_3_5[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Under_3.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_3.5_T1",
                      RTG_3_5[3],
                      selectedGame
                    )
                  }
                >
                  1-Under(3.5)
                  <strong className="text-warning"> {RTG_3_5[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_3.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_3.5_X",
                      RTG_3_5[4],
                      selectedGame
                    )
                  }
                >
                  x-Under(3.5)
                  <strong className="text-warning"> {RTG_3_5[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_3.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_3.5_T2",
                      RTG_3_5[5],
                      selectedGame
                    )
                  }
                >
                  2-Under(3.5)
                  <strong className="text-warning"> {RTG_3_5[5]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Over_4.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_4.5_T1",
                      RTG_4_5[0],
                      selectedGame
                    )
                  }
                >
                  1-Over(4.5)
                  <strong className="text-warning"> {RTG_4_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_4.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_4.5_X",
                      RTG_4_5[1],
                      selectedGame
                    )
                  }
                >
                  x-Over(4.5)
                  <strong className="text-warning"> {RTG_4_5[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_4.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_4.5_T2",
                      RTG_4_5[2],
                      selectedGame
                    )
                  }
                >
                  2-Over(4.5)
                  <strong className="text-warning"> {RTG_4_5[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Under_4.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_4.5_T1",
                      RTG_4_5[3],
                      selectedGame
                    )
                  }
                >
                  1-Under(4.5)
                  <strong className="text-warning"> {RTG_4_5[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_4.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_4.5_X",
                      RTG_0_5[4],
                      selectedGame
                    )
                  }
                >
                  x-Under(4.5)
                  <strong className="text-warning"> {RTG_4_5[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_4.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_4.5_T2",
                      RTG_4_5[5],
                      selectedGame
                    )
                  }
                >
                  2-Under(4.5)
                  <strong className="text-warning"> {RTG_4_5[5]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Over_5.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_5.5_T1",
                      RTG_5_5[0],
                      selectedGame
                    )
                  }
                >
                  1-Over(5.5)
                  <strong className="text-warning"> {RTG_5_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_5.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_5.5_X",
                      RTG_5_5[1],
                      selectedGame
                    )
                  }
                >
                  x-Over(5.5)
                  <strong className="text-warning"> {RTG_5_5[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Over_5.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Over_5.5_T2",
                      RTG_5_5[2],
                      selectedGame
                    )
                  }
                >
                  2-Over(5.5)
                  <strong className="text-warning"> {RTG_5_5[2]}</strong>
                </td>
              </tr>

              <tr className="text-center">
                <td
                  className="col-4"
                  title={`Under_5.5_T1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_5.5_T1",
                      RTG_5_5[3],
                      selectedGame
                    )
                  }
                >
                  1-Under(5.5)
                  <strong className="text-warning"> {RTG_5_5[3]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_5.5_X`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_5.5_X",
                      RTG_5_5[4],
                      selectedGame
                    )
                  }
                >
                  x-Under(5.5)
                  <strong className="text-warning"> {RTG_5_5[4]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`Under_5.5_T2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "Under_5.5_T2",
                      RTG_5_5[5],
                      selectedGame
                    )
                  }
                >
                  2-Under(5.5)
                  <strong className="text-warning"> {RTG_5_5[5]}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE  */}

        <div className="right left col-6 p-2">
          <table className="col-12">
            <tbody>
              <tr className="column">
                <td className="py-1" colSpan={2}>
                  Double Chance
                </td>
              </tr>
              <tr>
                <td className="col-6">{currentGame[0].event.T1} or X </td>
                <td
                  className="col-6 text-end"
                  title={`DC_T1/X`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_T1/X", DC_odds[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_odds[0]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-6">
                  {currentGame[0].event.T1} or {currentGame[0].event.T2}
                </td>
                <td
                  className="col-6 text-end"
                  title={`DC_T1/T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_T1/T2", DC_odds[1], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_odds[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-6">X or {currentGame[0].event.T2}</td>
                <td
                  className="col-6 text-end"
                  title={`DC_X/T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_X/T2", DC_odds[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_odds[2]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  Half Time Dauble Chance
                </td>
              </tr>
              <tr>
                <td className="col-6">{currentGame[0].event.T1} or X</td>
                <td
                  className="col-6 text-end"
                  title={`DC_T1/X_H1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_T1/X_H1", DC_H1[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_H1[0]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-6">
                  {currentGame[0].event.T1} or {currentGame[0].event.T2}
                </td>
                <td
                  className="col-6 text-end"
                  title={`DC_T1/T2_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "DC_T1/T2_H1",
                      DC_H1[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning"> {DC_H1[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-6">X or {currentGame[0].event.T2}</td>
                <td
                  className="col-6 text-end"
                  title={`DC_X/T2_H1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_X/T2_H1", DC_H1[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_H1[2]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td className="py-1" colSpan={2}>
                  2nd Half Double Chance
                </td>
              </tr>
              <tr>
                <td className="col-6">{currentGame[0].event.T1} or X</td>
                <td
                  className="col-6 text-end"
                  title={`DC_T1/X_H2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_T1/X_H2", DC_H2[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_H2[0]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-6">
                  {currentGame[0].event.T1} or {currentGame[0].event.T2}
                </td>
                <td
                  className="col-6 text-end"
                  title={`DC_T1/T2_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "DC_T1/T2_H2",
                      DC_H2[1],
                      selectedGame
                    )
                  }
                >
                  <strong className="text-warning"> {DC_H2[1]}</strong>
                </td>
              </tr>
              <tr>
                <td className="col-6">X or {currentGame[0].event.T2}</td>
                <td
                  className="col-6 text-end"
                  title={`DC_X/T2_H2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DC_X/T2_H2", DC_H2[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {DC_H2[2]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="mt-3 col-12">
            <tbody>
              <tr className="column">
                <td colSpan={3} className="py-1">
                  Heighest Scoring Half
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-4"
                  title={`HSH_H1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "HSH_H1", HSH_odds[0], selectedGame)
                  }
                >
                  1st Half{" "}
                  <strong className="text-warning"> {HSH_odds[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HSH_ENOG`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "HSH_ENOG",
                      HSH_odds[1],
                      selectedGame
                    )
                  }
                >
                  Equal number of goals{" "}
                  <strong className="text-warning"> {HSH_odds[1]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`HSH_H2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "HSH_H2", HSH_odds[2], selectedGame)
                  }
                >
                  2nd Half{" "}
                  <strong className="text-warning"> {HSH_odds[2]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  Both Teams To Score
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`BTS_YES`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "BTS_YES", BTS_odds[0], selectedGame)
                  }
                >
                  Yes <strong className="text-warning"> {BTS_odds[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`BTS_NO`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "BTS_NO", BTS_odds[1], selectedGame)
                  }
                >
                  No <strong className="text-warning"> {BTS_odds[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  First Half Both Teams To Score
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`BTS_YES_H1`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "BTS_YES_H1",
                      BTS_H1[0],
                      selectedGame
                    )
                  }
                >
                  Yes <strong className="text-warning"> {BTS_H1[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`BTS_NO_H1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "BTS_NO_H1", BTS_H1[1], selectedGame)
                  }
                >
                  No <strong className="text-warning"> {BTS_H1[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  Second Half Both Teams To Score
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`BTS_YES_H2`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "BTS_YES_H2",
                      BTS_H2[0],
                      selectedGame
                    )
                  }
                >
                  Yes <strong className="text-warning"> {BTS_H2[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`BTS_NO_H2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "BTS_NO_H2", BTS_H2[1], selectedGame)
                  }
                >
                  No <strong className="text-warning"> {BTS_H2[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  Odd Even
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`OE_ODD_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "OE_ODD_FT",
                      OE_odds[0],
                      selectedGame
                    )
                  }
                >
                  Odd <strong className="text-warning"> {OE_odds[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`OE_EVEN_FT`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "OE_EVEN_FT",
                      OE_odds[1],
                      selectedGame
                    )
                  }
                >
                  Even <strong className="text-warning"> {OE_odds[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  First Half Odd Even
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`OE_ODD_H1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "OE_ODD_H1", OE_H1[0], selectedGame)
                  }
                >
                  Odd <strong className="text-warning"> {OE_H1[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`OE_EVEN_H1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "OE_EVEN_H1", OE_H1[1], selectedGame)
                  }
                >
                  Even <strong className="text-warning"> {OE_H1[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  Second Half Odd Even
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`OE_ODD_H2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "OE_ODD_H2", OE_H2[0], selectedGame)
                  }
                >
                  Odd <strong className="text-warning"> {OE_H2[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`OE_EVEN_H2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "OE_EVEN_H2", OE_H2[1], selectedGame)
                  }
                >
                  Even <strong className="text-warning"> {OE_H2[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3">
            <tbody>
              <tr className="column">
                <td colSpan={2} className="py-1">
                  Draw No Bet
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-6"
                  title={`DNB_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DNB_T1", DNB_odds[0], selectedGame)
                  }
                >
                  {currentGame[0].event.T1}{" "}
                  <strong className="text-warning"> {DNB_odds[0]}</strong>
                </td>
                <td
                  className="col-6"
                  title={`DNB_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "DNB_T2", DNB_odds[1], selectedGame)
                  }
                >
                  {currentGame[0].event.T2}{" "}
                  <strong className="text-warning"> {DNB_odds[1]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="col-12 mt-3 table-border">
            <tbody>
              <tr className="column">
                <td colSpan={1} className="py-1">
                  EH
                </td>
                <td colSpan={1} className="py-1 text-center">
                  T1
                </td>
                <td colSpan={1} className="py-1 text-center">
                  T2
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">5:0</td>
                <td
                  className="col-4"
                  title={`EH_5.0_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_5.0_T1", EH_5_0[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_5_0[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_5.0_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_5.0_T2", EH_5_0[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_5_0[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">4:0</td>
                <td
                  className="col-4"
                  title={`EH_4.0_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_4.0_T1", EH_4_0[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_4_0[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_4.0_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_4.0_T2", EH_4_0[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_4_0[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">3:0</td>
                <td
                  className="col-4"
                  title={`EH_3.0_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_3.0_T1", EH_3_0[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_3_0[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_3.0_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_3.0_T2", EH_3_0[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_3_0[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">2:0</td>
                <td
                  className="col-4"
                  title={`EH_2.0_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_2.0_T1", EH_2_0[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_2_0[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_2.0_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_2.0_T2", EH_2_0[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_2_0[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">1:0</td>
                <td
                  className="col-4"
                  title={`EH_1.0_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_1.0_T1", EH_1_0[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_1_0[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_1.0_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_1.0_T2", EH_1_0[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_1_0[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">0:1</td>
                <td
                  className="col-4"
                  title={`EH_0.1_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.1_T1", EH_0_1[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_1[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_0.1_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.1_T2", EH_0_1[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_1[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">0:2</td>
                <td
                  className="col-4"
                  title={`EH_0.2_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.2_T1", EH_0_2[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_2[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_0.2_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.2_T2", EH_0_2[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_2[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">0:3</td>
                <td className="col-4">
                  <strong
                    className="text-warning"
                    title={`EH_0.3_T1`}
                    onClick={() =>
                      setOddsOnClick(
                        ids[0],
                        "EH_0.3_T1",
                        EH_0_3[0],
                        selectedGame
                      )
                    }
                  >
                    {" "}
                    {EH_0_3[0]}
                  </strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_0.3_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.3_T2", EH_0_3[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_3[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">0:4</td>
                <td
                  className="col-4"
                  title={`EH_0.4_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.4_T1", EH_0_4[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_4[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_0.4_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.4_T2", EH_0_4[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_4[2]}</strong>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-4">0:5</td>
                <td
                  className="col-4"
                  title={`EH_0.5_T1`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.5_T1", EH_0_5[0], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_5[0]}</strong>
                </td>
                <td
                  className="col-4"
                  title={`EH_0.5_T2`}
                  onClick={() =>
                    setOddsOnClick(ids[0], "EH_0.5_T2", EH_0_5[2], selectedGame)
                  }
                >
                  <strong className="text-warning"> {EH_0_5[2]}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* <table className="col-12 mt-3 table-border">
            <tbody>
              <tr className="column">
                <td colSpan={6} className="py-1">
                  Total Goals Both Teams To Score
                </td>
              </tr>
              <tr className="text-center">
                <td
                  className="col-3"
                  title={`TGBTS_Y-O`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "TGBTS_Y-O",
                      TGBTS_odds[0],
                      selectedGame
                    )
                  }
                >
                  Yes & Over
                  <strong className="text-warning"> {TGBTS_odds[0]}</strong>
                </td>
                <td
                  className="col-3"
                  title={`TGBTS_N-O`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "TGBTS_N-O",
                      TGBTS_odds[1],
                      selectedGame
                    )
                  }
                >
                  No & Over
                  <strong className="text-warning"> {TGBTS_odds[1]}</strong>
                </td>
                <td
                  className="col-3"
                  title={`TGBTS_Y-U`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "TGBTS_Y-U",
                      TGBTS_odds[2],
                      selectedGame
                    )
                  }
                >
                  Yes & Under
                  <strong className="text-warning"> {TGBTS_odds[2]}</strong>
                </td>
                <td
                  className="col-3"
                  title={`TGBTS_N-U`}
                  onClick={() =>
                    setOddsOnClick(
                      ids[0],
                      "TGBTS_N-U",
                      TGBTS_odds[3],
                      selectedGame
                    )
                  }
                >
                  No & Under
                  <strong className="text-warning"> {TGBTS_odds[3]}</strong>
                </td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
