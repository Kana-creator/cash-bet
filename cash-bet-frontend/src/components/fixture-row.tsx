import React, { useEffect, useState } from "react";
import { GameModule } from "./modules/game-module";
import { GameNumber } from "./modules/game_number_module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";

interface Props {
  game: GameModule;
  // eventNumbers: GameNumber[];
}

const FixtureRow: React.FC<Props> = ({ game }) => {
  const [dateTime, setDateTime] = useState<string[]>(["", ""]);

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
  const [eventNumbers, setEventNumbers] = useState<GameNumber[]>([]);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setTimeout(() => {
      axios
        .get(`${AppUrl()}/fetch-event-numbers`)
        .then((res) => {
          setEventNumbers(res.data.event_IDs);
        })
        .catch((error) => console.log(error));
    }, 3000);
    return () => clearTimeout(interval);
  }, []);

  useEffect(() => {
    // setTimeout(() => {
    eventNumbers.length > 0
      ? eventNumbers.forEach((eventNumber: GameNumber) => {
          if (eventNumber.event_number === Number(game.event.I)) {
            setIds([eventNumber.id]);
          }
        })
      : setIds([]);
    // }, 1000);
  }, [eventNumbers]);

  useEffect(() => {
    const allOdds: any[] = [];
    const mkts: any[] = [game.markets];
    mkts.forEach((mkt: any[]) =>
      mkt.forEach((mk) =>
        mk.B.map((bookmark: any) => {
          allOdds.push({ market: mk.$, odds: bookmark.O });
          // console.log({ event: game.event.I, bookmaker: bookmark.$.I });
        })
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
      allOdds.filter((odds) => odds.market.K == "EH" && odds.market.H == 1)
        .length !== 0
        ? allOdds
            .filter((odds) => odds.market.K == "EH" && odds.market.H == 1)[0]
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
  }, []);

  useEffect(() => {
    const dateString = game.event.DT;
    const date = new Date(dateString);
    const offsetInMinutes = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offsetInMinutes * 60000);
    const localDateString = new Date(localDate).toLocaleString();
    const date1: string[] = localDateString.split(", ");

    const TimeArray = date1[1].split(":");
    const hours = TimeArray[0];
    const minutes = TimeArray[1];

    const timeSession = TimeArray[2].split(" ");
    const AmPm = timeSession[1];

    setDateTime(date1);
    setTime(hours + ":" + minutes + " " + AmPm);
  }, []);

  return (
    <tr>
      <td>{ids[0]}</td>
      <td>{time}</td>
      <td className="fixed-column">{game.league_name}</td>
      <td>{game.event.T1}</td>
      <td>{game.event.T2}</td>
      <td>{x2Odds[0]}</td>
      <td>{x2Odds[1]}</td>
      <td>{x2Odds[2]}</td>
      <td>{OU_2_5[1]}</td>
      <td>{OU_2_5[0]}</td>
      <td>{OU_1_5[1]}</td>
      <td>{OU_1_5[0]}</td>
      <td>{x2_H1Odds[0]}</td>
      <td>{x2_H1Odds[1]}</td>
      <td>{x2_H1Odds[2]}</td>
      <td>{OU_1_5_H1[1]}</td>
      <td>{OU_1_5_H1[0]}</td>
      <td>{OU_0_5_H1[1]}</td>
      <td>{OU_0_5_H1[0]}</td>
      <td>{DC_odds[0]}</td>
      <td>{DC_odds[1]}</td>
      <td>{DC_odds[2]}</td>
      <td>{HSH_odds[0]}</td>
      <td>{HSH_odds[1]}</td>
      <td>{HSH_odds[2]}</td>
      <td>{BTS_odds[0]}</td>
      <td>{BTS_odds[1]}</td>
      <td>0:1</td>
      <td>{EH_1_0[0]}</td>
      <td>{EH_1_0[1]}</td>
      <td>{EH_1_0[2]}</td>
    </tr>
  );
};

export default FixtureRow;
