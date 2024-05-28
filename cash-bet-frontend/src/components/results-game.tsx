import React, { useEffect, useState } from "react";
import { SelectedGameModule } from "./modules/selected-game-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import xml2js from "xml2js";
import { EventModule } from "./modules/event-module";

interface Props {
  resultsGame: any;
  updateParentArray: (newValue: string, index: number) => void;
  index: number;
}

const ResultsGame: React.FC<Props> = ({
  resultsGame,
  updateParentArray,
  index,
}) => {
  const [game, setGame] = useState<EventModule[]>([]);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [win, setWin] = useState<boolean>(false);

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

  const saveResults = (
    event_id: string,
    short_score: string,
    long_score: string,
    date_played: string,
    league: string
  ) => {
    axios
      .put(`${AppUrl()}/save-results`, {
        event_id: event_id,
        short_score: short_score,
        long_score: long_score,
        date_played: date_played,
        league: league,
      })
      .then(() => {})
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    // const interval = setInterval(() => {

    if (
      resultsGame.short_score === "Not started" ||
      resultsGame.short_score === null
    ) {
      axios
        .get(`${AppUrl()}/fetch-api-results/${resultsGame.event_id}`)
        .then(async (res) => {
          const result = await parseXml(res.data.game);
          const event: EventModule[] = [];

          if (result.markets.$.CNT === "0") {
            setGame([
              {
                A: "",
                BKS: "",
                DT: "0",
                I: "",
                ISH: "",
                MN: "",
                PR: "",
                T1: "",
                T1I: "",
                T2: "",
                T2I: "",
                sc: "",
                sce: "",
              },
            ]);
            console.log("Game not found");
            setGameStatus("Missing");
            updateParentArray("Missing", index);
          } else {
            const result_game = [
              ...result.markets.S.map((s: any) =>
                s.C.map((c: any) =>
                  c.L.map((l: any) =>
                    l.E.map((e: any, i: number) => {
                      event.push(e.$);
                      saveResults(e.$.I, e.$.sc, e.$.sce, e.$.DT, l.$.N);
                    })
                  )
                )
              ),
            ];

            setGame(event);

            const period = event[0].PR;

            if (
              period === "-1" ||
              period === "0" ||
              period === "356" ||
              period === "355" ||
              period === "357"
            ) {
              setGameStatus("Pending");
              updateParentArray("Pending", index);
            } else if (period === "255") {
              setGameStatus(event[0].sc);
              const scoreArray = event[0].sc.split(" ");
              const fullTimeScore = scoreArray[0].split(":");
              const HalfTimeScore = scoreArray[1].split("");
              const halfTime: any = HalfTimeScore.filter(
                (hts) => hts !== "(" && hts !== ")" && hts !== ":"
              );
              const seconHalfT1: number =
                Number(fullTimeScore[0]) - Number(halfTime[0]);
              const seconHalfT2: number =
                Number(fullTimeScore[1]) - Number(halfTime[1]);
              const secondHalfScore = [seconHalfT1, seconHalfT2];

              // 1X2 MARKET
              // CHECKING GAME RESULTS FOR 1X2 FULL TIME
              if (
                resultsGame.bet === "FT_1x2: 1" &&
                fullTimeScore[0] > fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "FT_1x2: 1" &&
                fullTimeScore[0] <= fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              } else if (
                resultsGame.bet === "FT_1x2: 2" &&
                fullTimeScore[0] < fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "FT_1x2: 2" &&
                fullTimeScore[0] >= fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              } else if (
                resultsGame.bet === "1x2_FT: X" &&
                fullTimeScore[0] === fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_FT: X" &&
                fullTimeScore[0] !== fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING GAME RESULTS FOR 1x2 FIRST HALF
              if (
                resultsGame.bet === "1x2_H1: 1" &&
                halfTime[0] > halfTime[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_H1: 1" &&
                halfTime[0] <= halfTime[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              } else if (
                resultsGame.bet === "1x2_H1: 2" &&
                halfTime[0] < halfTime[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_H1: 2" &&
                halfTime[0] >= halfTime[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              } else if (
                resultsGame.bet === "1x2_H1: X" &&
                halfTime[0] === halfTime[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_H1: X" &&
                halfTime[0] !== halfTime[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING GAME RESULTS FOR 1X2 SECOND HALF
              if (
                resultsGame.bet === "1x2_H2: 1" &&
                secondHalfScore[0] > secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_H2: 1" &&
                secondHalfScore[0] <= secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              } else if (
                resultsGame.bet === "1x2_H2: 2" &&
                secondHalfScore[0] < secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_H2: 1" &&
                secondHalfScore[0] >= secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              } else if (
                resultsGame.bet === "1x2_H2: X" &&
                secondHalfScore[0] === secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "1x2_H2: X" &&
                secondHalfScore[0] !== secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER/UNDER MARKET
              // CHEKING GAME RESULTS FOR OVER/UNDER FULL TIME
              // UNDER 0.5 FULL TIME
              if (
                resultsGame.bet === "Under_0.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_0.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 1.5 FULL TIME
              if (
                resultsGame.bet === "Under_1.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_1.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 2.5 FULL TIME
              if (
                resultsGame.bet === "Under_2.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_2.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 FULL TIME
              if (
                resultsGame.bet === "Under_3.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_3.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 4.5 FULL TIME
              if (
                resultsGame.bet === "Under_4.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_4.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 5.5 FULLT TIME
              if (
                resultsGame.bet === "Under_5.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_5.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 0.5 FULL TIME
              if (
                resultsGame.bet === "Over_0.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_0.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) < 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 1.5 FULL TIME
              if (
                resultsGame.bet === "Over_1.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_1.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 2.5 FULL TIME
              if (
                resultsGame.bet === "Over_2.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_2.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 3.5 FULL TIME
              if (
                resultsGame.bet === "Over_3.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_3.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 4.5 FULL TIME
              if (
                resultsGame.bet === "Over_4.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_4.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 5.5 FULL TIME
              if (
                resultsGame.bet === "Over_5.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_5.5_FT" &&
                Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHEKING GAME RESULTS FOR OVER/UNDER FIRST HALF
              // UNDER 0.5 FIRST HALF
              if (
                resultsGame.bet === "Under_0.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_0.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 1.5 FIRST HALF
              if (
                resultsGame.bet === "Under_1.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_1.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 2.5 FIRST HALF
              if (
                resultsGame.bet === "Under_2.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_2.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 FIRST HALF
              if (
                resultsGame.bet === "Under_3.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_3.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 4.5 FIRST HALF
              if (
                resultsGame.bet === "Under_4.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_4.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 5.5 FIRST HALF
              if (
                resultsGame.bet === "Under_5.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_5.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 0.5 FIRST HALF
              if (
                resultsGame.bet === "Over_0.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_0.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 1.5 FIRST HALF
              if (
                resultsGame.bet === "Over_1.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_1.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 2.5 FIRST HALF
              if (
                resultsGame.bet === "Over_2.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_2.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 3.5 FIRST HALF
              if (
                resultsGame.bet === "Over_3.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_3.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 4.5 FIRST HALF
              if (
                resultsGame.bet === "Over_4.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_4.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 5.5 FIRST HALF
              if (
                resultsGame.bet === "Over_5.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) > 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_5.5_H1" &&
                Number(halfTime[0]) + Number(halfTime[1]) <= 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER/UNDER SECOND HALF
              // UNDER 0.5 SECOND HALF
              if (
                resultsGame.bet === "Under_0.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_0.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 1.5 SECOND HALF
              if (
                resultsGame.bet === "Under_1.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_1.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 2.5 SECOND HALF
              if (
                resultsGame.bet === "Under_2.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_2.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 SECOND HALF
              if (
                resultsGame.bet === "Under_3.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_3.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 4.5 SECOND HALF
              if (
                resultsGame.bet === "Under_4.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_4.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 5.5 SECOND HALF
              if (
                resultsGame.bet === "Under_5.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_5.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 0.5 SECOND HALF
              if (
                resultsGame.bet === "Over_0.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_0.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 1.5 SECOND HALF
              if (
                resultsGame.bet === "Over_1.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_1.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 2.5 SECOND HALF
              if (
                resultsGame.bet === "Over_2.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_2.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 3.5 SECOND HALF
              if (
                resultsGame.bet === "Over_3.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_3.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 4.5 SECOND HALF
              if (
                resultsGame.bet === "Over_4.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_4.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 5.5 SECOND HALF
              if (
                resultsGame.bet === "Over_5.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] > 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_5.5_H2" &&
                secondHalfScore[0] + secondHalfScore[1] <= 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME MARKET
              //CHECKING GAME RESULTS FOR HALFTIME/FULLTIME
              // HALFTIME/FULLTIME T1/T1
              if (
                resultsGame.bet === "HTFT_1/1" &&
                halfTime[0] > halfTime[1] &&
                fullTimeScore[0] > fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "HTFT_1/1" &&
                halfTime[0] <= halfTime[1] &&
                fullTimeScore[0] <= fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME T1/X
              if (
                resultsGame.bet === "HTFT_1/X" &&
                halfTime[0] > halfTime[1] &&
                fullTimeScore[0] === fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "HTFT_1/X" &&
                  halfTime[0] <= halfTime[1]) ||
                (resultsGame.bet === "HTFT_1/X" &&
                  fullTimeScore[0] !== fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME T1/T2
              if (
                resultsGame.bet === "HTFT_1/2" &&
                halfTime[0] > halfTime[1] &&
                fullTimeScore[0] < fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "HTFT_1/2" &&
                halfTime[0] <= halfTime[1] &&
                fullTimeScore[0] >= fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME X/T1
              if (
                resultsGame.bet === "HTFT_X/1" &&
                halfTime[0] === halfTime[1] &&
                fullTimeScore[0] > fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "HTFT_X/1" &&
                  halfTime[0] !== halfTime[1]) ||
                (resultsGame.bet === "HTFT_X/1" &&
                  fullTimeScore[0] >= fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME X/X
              if (
                resultsGame.bet === "HTFT_X/X" &&
                halfTime[0] === halfTime[1] &&
                fullTimeScore[0] === fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "HTFT_X/X" &&
                  halfTime[0] !== halfTime[1]) ||
                (resultsGame.bet === "HTFT_X/X" &&
                  fullTimeScore[0] !== fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME X/T2
              if (
                resultsGame.bet === "HTFT_X/2" &&
                halfTime[0] === halfTime[1] &&
                fullTimeScore[0] < fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "HTFT_X/2" &&
                  halfTime[0] !== halfTime[1]) ||
                (resultsGame.bet === "HTFT_X/2" &&
                  fullTimeScore[0] >= fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME T2/T1
              if (
                resultsGame.bet === "HTFT_2/1" &&
                halfTime[0] < halfTime[1] &&
                fullTimeScore[0] > fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "HTFT_2/1" &&
                  halfTime[0] >= halfTime[1]) ||
                (resultsGame.bet === "HTFT_2/1" &&
                  fullTimeScore[0] <= fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME T2/X
              if (
                resultsGame.bet === "HTFT_2/X" &&
                halfTime[0] < halfTime[1] &&
                fullTimeScore[0] === fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "HTFT_2/X" &&
                  halfTime[0] >= halfTime[1]) ||
                (resultsGame.bet === "HTFT_2/X" &&
                  fullTimeScore[0] !== fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // HALFTIME/FULLTIME T2/T2
              if (
                resultsGame.bet === "HTFT_2/2" &&
                halfTime[0] < halfTime[1] &&
                fullTimeScore[0] < fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "HTFT_2/2" &&
                halfTime[0] >= halfTime[1] &&
                fullTimeScore[0] >= fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE MARKET
              // CHECKING GAME RESULTS FOR DOUBLE CHANCE FULL TIME
              // DOUBLE CHANCE T1/X FULL TIME

              if (
                resultsGame.bet === "DC_T1/X" &&
                fullTimeScore[0] >= fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_T1/X" &&
                fullTimeScore[0] < fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE T1/T2 FULL TIME
              if (
                resultsGame.bet === "DC_T1/T2" &&
                fullTimeScore[0] !== fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_T1/T2" &&
                fullTimeScore[0] === fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE X/T2 FULL TIME
              if (
                resultsGame.bet === "DC_X/T2" &&
                fullTimeScore[0] <= fullTimeScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_X/T2" &&
                fullTimeScore[0] > fullTimeScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING GAME RESULTS FOR DOUBLE CHANCE FIRST HALF
              // DOUBLE CHANCE T1/X FIRST HALF
              if (
                resultsGame.bet === "DC_T1/X_H1" &&
                halfTime[0] >= halfTime[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_T1/X_H1" &&
                halfTime[0] < halfTime[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE T1/T2 FIRST HALF
              if (
                resultsGame.bet === "DC_T1/T2_H1" &&
                halfTime[0] !== halfTime[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_T1/T2_H1" &&
                halfTime[0] === halfTime[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE X/T2 FIRST HALF
              if (
                resultsGame.bet === "DC_X/T2_H1" &&
                halfTime[0] <= halfTime[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_X/T2_H1" &&
                halfTime[0] > halfTime[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING FOR GAME RESULTS DOUBLE CHANCE SECOND HALF
              // DOUBLE CHANCE T1/T1 SECOND HALF
              if (
                resultsGame.bet === "DC_T1/X_H2" &&
                secondHalfScore[0] >= secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_T1/X_H2" &&
                secondHalfScore[0] < secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE T1/T2 SECOND HALF
              if (
                resultsGame.bet === "DC_T1/T2_H2" &&
                secondHalfScore[0] !== secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_T1/T2_H2" &&
                secondHalfScore[0] === secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DOUBLE CHANCE X/T2 SECOND HALF
              if (
                resultsGame.bet === "DC_X/T2_H2" &&
                secondHalfScore[0] <= secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DC_X/T2_H2" &&
                secondHalfScore[0] > secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              //HIGHEST SCORING HALF MARKET
              // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF FULL TIME
              // HIGHEST SCORING HALF FIRST HALF
              if (
                resultsGame.bet === "HSH_H1" &&
                halfTime[0] + halfTime[1] >
                  secondHalfScore[0] + secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "HSH_H1" &&
                halfTime[0] + halfTime[1] <=
                  secondHalfScore[0] + secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING FOR GAME RESULT HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
              // HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
              if (
                resultsGame.bet === "HSH_H1" &&
                halfTime[0] + halfTime[1] ===
                  secondHalfScore[0] + secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "HSH_H1" &&
                halfTime[0] + halfTime[1] !==
                  secondHalfScore[0] + secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF SECOND HALF
              // HIGHEST SCORING HALF SECOND HALF
              if (
                resultsGame.bet === "HSH_H1" &&
                halfTime[0] + halfTime[1] <
                  secondHalfScore[0] + secondHalfScore[1]
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "HSH_H1" &&
                halfTime[0] + halfTime[1] >=
                  secondHalfScore[0] + secondHalfScore[1]
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // BOTH TEAMS TO SCORE MARKET
              //CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE FULL TIME
              // BOTH TEAMS TO SCORE YES FULL TIME
              if (
                resultsGame.bet === "BTS_YES" &&
                Number(fullTimeScore[0]) > 0 &&
                Number(fullTimeScore[1]) > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "BTS_YES" &&
                  Number(fullTimeScore[0]) === 0) ||
                (resultsGame.bet === "BTS_YES" &&
                  Number(fullTimeScore[1]) === 0)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // BOTH TEAMS TO SCORE NO FULL TIME
              if (
                resultsGame.bet === "BTS_NO" &&
                Number(fullTimeScore[0]) === 0 &&
                Number(fullTimeScore[1]) === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "BTS_NO" &&
                  Number(fullTimeScore[0]) === 0) ||
                (resultsGame.bet === "BTS_NO" && Number(fullTimeScore[1]) === 0)
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "BTS_NO" &&
                Number(fullTimeScore[0]) > 0 &&
                Number(fullTimeScore[1]) > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING FOR GAME RESULTS BOTH TEAMS TO SCORE FIRST HALF
              // BOTH TEAMS TO SCORE YES FIRST HALF
              if (
                resultsGame.bet === "BTS_YES_H1" &&
                Number(halfTime[0]) > 0 &&
                Number(halfTime[1]) > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "BTS_YES_H1" &&
                  Number(halfTime[0]) === 0) ||
                (resultsGame.bet === "BTS_YES_H1" && Number(halfTime[1]) === 0)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // BOTH TEAMS TO SCORE NO FIRST HALF
              if (
                resultsGame.bet === "BTS_NO_H1" &&
                Number(halfTime[0]) === 0 &&
                Number(halfTime[1]) === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "BTS_NO_H1" &&
                  Number(halfTime[0]) === 0) ||
                (resultsGame.bet === "BTS_NO_H1" && Number(halfTime[1]) === 0)
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "BTS_NO_H1" &&
                Number(halfTime[0]) > 0 &&
                Number(halfTime[1]) > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE SECOND HALF
              // BOTH TEAMS TO SCORE YES SECOND HALF
              if (
                resultsGame.bet === "BTS_YES_H2" &&
                Number(secondHalfScore[0]) > 0 &&
                Number(secondHalfScore[1]) > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "BTS_YES_H2" &&
                  Number(secondHalfScore[0]) === 0) ||
                (resultsGame.bet === "BTS_YES_H2" &&
                  Number(secondHalfScore[1]) === 0)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // BOTH TEAMS TO SCORE NO SECOND HALF
              if (
                resultsGame.bet === "BTS_NO_H2" &&
                Number(secondHalfScore[0]) === 0 &&
                Number(secondHalfScore[1]) === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "BTS_NO_H2" &&
                  Number(secondHalfScore[0]) === 0) ||
                (resultsGame.bet === "BTS_NO_H2" &&
                  Number(secondHalfScore[1]) === 0)
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "BTS_NO_H2" &&
                Number(secondHalfScore[0]) > 0 &&
                Number(secondHalfScore[1]) > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // ODD EVEN MARKET
              // CHECKING GAME RESULTS FOR ODD EVEN FULL TIME
              // ODD FULL TIME
              if (
                resultsGame.bet === "OE_ODD_FT" &&
                Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "OE_ODD_FT" &&
                Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EVEN FULL TIME
              if (
                resultsGame.bet === "OE_EVEN_FT" &&
                Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "OE_EVEN_FT" &&
                Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING ODD EVEN RESULTS FIRST HALF
              // ODD HALF TIME
              if (
                resultsGame.bet === "OE_ODD_H1" &&
                Number(halfTime[0] + halfTime[1]) % 2 !== 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "OE_ODD_H1" &&
                Number(halfTime[0] + halfTime[1]) % 2 === 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EVEN HALF TIME
              if (
                resultsGame.bet === "OE_EVEN_H1" &&
                Number(halfTime[0] + halfTime[1]) % 2 === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "OE_EVEN_H1" &&
                Number(halfTime[0] + halfTime[1]) % 2 !== 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // CHECKING ODD EVEN RESULTS FOR SECOND HALF
              // ODD SECOND HALF
              if (
                resultsGame.bet === "OE_ODD_H2" &&
                Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "OE_ODD_H2" &&
                Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EVEN SECOND HALF
              if (
                resultsGame.bet === "OE_EVEN_H2" &&
                Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "OE_EVEN_H2" &&
                Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // 1x2 AND OVER/UNDER MARKET
              // CHECKING GAME RESULTS FOR 1X2 AND OVER/UNDER FULL TIME
              // OVER/UNDER T1 FULL TIME
              // OVER 0.5 T1 FULLTIME
              if (
                resultsGame.bet === "Over_0.5_T1" &&
                Number(fullTimeScore[0]) >= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_0.5_T1" &&
                Number(fullTimeScore[0]) < 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 0.5 T1 FULL TIME
              if (
                resultsGame.bet === "Under_0.5_T1" &&
                Number(fullTimeScore[0]) <= 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_0.5_T1" &&
                Number(fullTimeScore[0]) > 0
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 1.5 T1 FULL TIME
              if (
                resultsGame.bet === "Over_1.5_T1" &&
                Number(fullTimeScore[0]) >= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_1.5_T1" &&
                Number(fullTimeScore[0]) < 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 1.5 T1 FULL TIME
              if (
                resultsGame.bet === "Under_1.5_T1" &&
                Number(fullTimeScore[0]) <= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_1.5_T1" &&
                Number(fullTimeScore[0]) > 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 2.5 T1 FULL TIME
              if (
                resultsGame.bet === "Over_2.5_T1" &&
                Number(fullTimeScore[0]) >= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_2.5_T1" &&
                Number(fullTimeScore[0]) < 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 2.5 T1 FULL TIME
              if (
                resultsGame.bet === "Under_2.5_T1" &&
                Number(fullTimeScore[0]) <= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_2.5_T1" &&
                Number(fullTimeScore[0]) > 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 3.5 T1 FULL TIME
              if (
                resultsGame.bet === "Over_3.5_T1" &&
                Number(fullTimeScore[0]) >= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_3.5_T1" &&
                Number(fullTimeScore[0]) < 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 T1 FULL TIME
              if (
                resultsGame.bet === "Under_3.5_T1" &&
                Number(fullTimeScore[0]) <= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_3.5_T1" &&
                Number(fullTimeScore[0]) > 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 4.5 T1 FULL TIME
              if (
                resultsGame.bet === "Over_4.5_T1" &&
                Number(fullTimeScore[0]) >= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_4.5_T1" &&
                Number(fullTimeScore[0]) < 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 4.5 T1 FULL TIME
              if (
                resultsGame.bet === "Under_4.5_T1" &&
                Number(fullTimeScore[0]) <= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_4.5_T1" &&
                Number(fullTimeScore[0]) > 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 5.5 T1 FULL TIME
              if (
                resultsGame.bet === "Over_5.5_T1" &&
                Number(fullTimeScore[0]) >= 6
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_5.5_T1" &&
                Number(fullTimeScore[0]) < 6
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 5.5 T1 FULL TIME
              if (
                resultsGame.bet === "Under_5.5_T1" &&
                Number(fullTimeScore[0]) <= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_5.5_T1" &&
                Number(fullTimeScore[0]) > 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER/UNDER T2 FULL TIME
              // OVER 0.5 T2 FULL TIME
              if (
                resultsGame.bet === "Over_0.5_T2" &&
                Number(fullTimeScore[1]) >= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_0.5_T2" &&
                Number(fullTimeScore[1]) < 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 0.5 T2 FULL TIME
              if (
                resultsGame.bet === "Under_0.5_T2" &&
                Number(fullTimeScore[1]) < 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_0.5_T2" &&
                Number(fullTimeScore[1]) >= 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 1.5 T2 FULL TIME
              if (
                resultsGame.bet === "Over_1.5_T2" &&
                Number(fullTimeScore[1]) > 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_1.5_T2" &&
                Number(fullTimeScore[1]) <= 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 1.5 T2 FULL TIME
              if (
                resultsGame.bet === "Under_1.5_T2" &&
                Number(fullTimeScore[1]) <= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_1.5_T2" &&
                Number(fullTimeScore[1]) > 1
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              //  OVER 2.5 T2 FULL TIME
              if (
                resultsGame.bet === "Over_2.5_T2" &&
                Number(fullTimeScore[1]) > 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_2.5_T2" &&
                Number(fullTimeScore[1]) <= 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 2.5 T2 FULL TIME
              if (
                resultsGame.bet === "Under_2.5_T2" &&
                Number(fullTimeScore[1]) <= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_2.5_T2" &&
                Number(fullTimeScore[1]) > 2
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 T2 FULL TIME
              if (
                resultsGame.bet === "Over_3.5_T2" &&
                Number(fullTimeScore[1]) > 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_3.5_T2" &&
                Number(fullTimeScore[1]) <= 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 T2 FULL TIME
              if (
                resultsGame.bet === "Under_3.5_T2" &&
                Number(fullTimeScore[1]) <= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_3.5_T2" &&
                Number(fullTimeScore[1]) > 3
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 4.5 T2 FULL TIME
              if (
                resultsGame.bet === "Over_4.5_T2" &&
                Number(fullTimeScore[1]) > 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_4.5_T2" &&
                Number(fullTimeScore[1]) <= 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 4.5 T2 FULL TIME
              if (
                resultsGame.bet === "Under_4.5_T2" &&
                Number(fullTimeScore[1]) <= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_4.5_T2" &&
                Number(fullTimeScore[1]) < 4
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 5.5 T2 FULL TIME
              if (
                resultsGame.bet === "Over_5.5_T2" &&
                Number(fullTimeScore[1]) >= 6
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Over_0.5_T2" &&
                Number(fullTimeScore[1]) < 6
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 5.5 T2 FULL TIME
              if (
                resultsGame.bet === "Under_5.5_T2" &&
                Number(fullTimeScore[1]) <= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "Under_5.5_T2" &&
                Number(fullTimeScore[1]) > 5
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER/UNDER X FULL TIME
              // OVER 0.5 X FULL TIME
              if (
                resultsGame.bet === "Over_0.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Over_0.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_0.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) <= 0)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 0.5 X FULL TIME
              if (
                resultsGame.bet === "Under_0.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 0
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Under_0.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_0.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) > 0)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 1.5 X FULL TIME
              if (
                resultsGame.bet === "Over_1.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Over_1.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_1.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) <= 1)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 1.5 X FULL TIME
              if (
                resultsGame.bet === "Under_1.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 1
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Under_1.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Under_1.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) > 1)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 2.5 X FULL
              if (
                resultsGame.bet === "Over_2.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Over_2.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_2.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) <= 2)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 2.5 X FULL TIME
              if (
                resultsGame.bet === "Under_2.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Under_2.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Under_2.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) > 2)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 3.5 X FULL TIME
              if (
                resultsGame.bet === "Over_3.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Over_3.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_3.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) <= 3)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 3.5 X FULL TIME
              if (
                resultsGame.bet === "Under_3.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Under_3.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Under_3.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) > 3)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 4.5 X FULL TIME
              if (
                resultsGame.bet === "Over_4.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Over_4.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_4.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) <= 4)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 4.5 X FULL TIME
              if (
                resultsGame.bet === "Under_4.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Under_4.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Under_4.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) > 4)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // OVER 5.5 X FULL TIME
              if (
                resultsGame.bet === "Over_5.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Over_5.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Over_5.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) <= 5)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // UNDER 5.5 X FULL TIME
              if (
                resultsGame.bet === "Under_5.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "Under_5.5_X" &&
                  Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
                (resultsGame.bet === "Under_5.5_X" &&
                  Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                  Number(fullTimeScore[0]) > 5)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DRAW NO BET MARKET
              // DRAW NO BET T1 FULL TIME
              if (
                resultsGame.bet === "DNB_T1" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1])
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DNB_T1" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // DRAW NO BET T2
              if (
                resultsGame.bet === "DNB_T2" &&
                Number(fullTimeScore[0]) < Number(fullTimeScore[1])
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                resultsGame.bet === "DNB_T2" &&
                Number(fullTimeScore[0]) >= Number(fullTimeScore[1])
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EUROPEAN HANDICAP MARKET
              // CHECKING GAME RESULTS FOR EH -5
              // EH -5 T1

              if (
                resultsGame.bet === "EH_5.0_T1" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_5.0_T1" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_5.0_T1" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -5 T2
              if (
                resultsGame.bet === "EH_5.0_T2" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_5.0_T2" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_5.0_T2" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -4 T1
              if (
                resultsGame.bet === "EH_4.0_T1" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_4.0_T1" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_4.0_T1" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -4 T2
              if (
                resultsGame.bet === "EH_4.0_T2" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_4.0_T2" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_4.0_T2" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -3 T1
              if (
                resultsGame.bet === "EH_3.0_T1" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_3.0_T1" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_3.0_T1" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -3 T2
              if (
                resultsGame.bet === "EH_3.0_T2" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_3.0_T2" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_3.0_T2" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -2 T1
              if (
                resultsGame.bet === "EH_2.0_T1" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_2.0_T1" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_2.0_T1" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) <= 3)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -2 T2
              if (
                resultsGame.bet === "EH_2.0_T2" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_2.0_T2" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_2.0_T2" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -1 T1
              if (
                resultsGame.bet === "EH_1.0_T1" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_1.0_T1" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_1.0_T1" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH -1 T2
              if (
                resultsGame.bet === "EH_1.0_T2" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_1.0_T2" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_1.0_T2" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 1 T1
              if (
                resultsGame.bet === "EH_0.1_T1" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.1_T1" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_0.1_T1" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 1 T2
              if (
                resultsGame.bet === "EH_0.1_T2" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.1_T2" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_0.1_T2" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 2 T1
              if (
                resultsGame.bet === "EH_0.2_T1" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.2_T1" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_0.2_T1" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 2 T2
              if (
                resultsGame.bet === "EH_0.2_T2" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.2_T2" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_0.2_T2" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 3)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 3 T1
              if (
                resultsGame.bet === "EH_0.3_T1" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.3_T1" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_0.3_T1" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 3 T2
              if (
                resultsGame.bet === "EH_0.3_T2" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.3_T2" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_0.3_T2" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 4 T1
              if (
                resultsGame.bet === "EH_0.4_T1" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.4_T1" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_0.4_T1" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 4 T2
              if (
                resultsGame.bet === "EH_0.4_T2" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.4_T2" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_0.4_T2" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 5 T1
              if (
                resultsGame.bet === "EH_0.5_T1" &&
                Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.5_T1" &&
                  Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
                (resultsGame.bet === "EH_0.5_T1" &&
                  Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }

              // EH 5 T2
              if (
                resultsGame.bet === "EH_0.5_T2" &&
                Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
              ) {
                setWin(true);
                updateParentArray("Win", index);
              } else if (
                (resultsGame.bet === "EH_0.5_T2" &&
                  Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
                (resultsGame.bet === "EH_0.5_T2" &&
                  Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
              ) {
                setWin(false);
                updateParentArray("Loss", index);
              }
            } else if (period === "256") {
              setGameStatus("Postponed");
            } else if (period === "258") {
              setGameStatus("Walkover 1");
            } else if (period === "259") {
              setGameStatus("Walkover 2");
            } else if (period === "260") {
              setGameStatus("Retire 1");
            } else if (period === "261") {
              setGameStatus("Retire 2");
            } else if (period === "355") {
              setGameStatus("No result");
              updateParentArray("Pending", index);
            } else if (period === "356") {
              setGameStatus("Under review");
              updateParentArray("Pending", index);
            } else if (period === "357") {
              setGameStatus("Interupted");
            }
          }

          setLoading(false);
        })
        .catch((error) => console.log(error));
    } else {
      setLoading(false);

      const scoreArray = resultsGame.short_score.split(" ");
      const fullTimeScore = scoreArray[0].split(":");
      const HalfTimeScore = scoreArray[1].split("");
      const halfTime: any = HalfTimeScore.filter(
        (hts: any) => hts !== "(" && hts !== ")" && hts !== ":"
      );
      const seconHalfT1: number =
        Number(fullTimeScore[0]) - Number(halfTime[0]);
      const seconHalfT2: number =
        Number(fullTimeScore[1]) - Number(halfTime[1]);
      const secondHalfScore = [seconHalfT1, seconHalfT2];

      // 1X2 MARKET
      // CHECKING GAME RESULTS FOR 1X2 FULL TIME
      if (
        resultsGame.bet === "FT_1x2: 1" &&
        fullTimeScore[0] > fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "FT_1x2: 1" &&
        fullTimeScore[0] <= fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      } else if (
        resultsGame.bet === "FT_1x2: 2" &&
        fullTimeScore[0] < fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "FT_1x2: 2" &&
        fullTimeScore[0] >= fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      } else if (
        resultsGame.bet === "1x2_FT: X" &&
        fullTimeScore[0] === fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_FT: X" &&
        fullTimeScore[0] !== fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING GAME RESULTS FOR 1x2 FIRST HALF
      if (resultsGame.bet === "1x2_H1: 1" && halfTime[0] > halfTime[1]) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_H1: 1" &&
        halfTime[0] <= halfTime[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      } else if (resultsGame.bet === "1x2_H1: 2" && halfTime[0] < halfTime[1]) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_H1: 2" &&
        halfTime[0] >= halfTime[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      } else if (
        resultsGame.bet === "1x2_H1: X" &&
        halfTime[0] === halfTime[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_H1: X" &&
        halfTime[0] !== halfTime[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING GAME RESULTS FOR 1X2 SECOND HALF
      if (
        resultsGame.bet === "1x2_H2: 1" &&
        secondHalfScore[0] > secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_H2: 1" &&
        secondHalfScore[0] <= secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      } else if (
        resultsGame.bet === "1x2_H2: 2" &&
        secondHalfScore[0] < secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_H2: 1" &&
        secondHalfScore[0] >= secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      } else if (
        resultsGame.bet === "1x2_H2: X" &&
        secondHalfScore[0] === secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "1x2_H2: X" &&
        secondHalfScore[0] !== secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER/UNDER MARKET
      // CHEKING GAME RESULTS FOR OVER/UNDER FULL TIME
      // UNDER 0.5 FULL TIME
      if (
        resultsGame.bet === "Under_0.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_0.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 1.5 FULL TIME
      if (
        resultsGame.bet === "Under_1.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_1.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 2.5 FULL TIME
      if (
        resultsGame.bet === "Under_2.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_2.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 FULL TIME
      if (
        resultsGame.bet === "Under_3.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_3.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 4.5 FULL TIME
      if (
        resultsGame.bet === "Under_4.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_4.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 5.5 FULLT TIME
      if (
        resultsGame.bet === "Under_5.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_5.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 0.5 FULL TIME
      if (
        resultsGame.bet === "Over_0.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_0.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) < 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 1.5 FULL TIME
      if (
        resultsGame.bet === "Over_1.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_1.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 2.5 FULL TIME
      if (
        resultsGame.bet === "Over_2.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_2.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 3.5 FULL TIME
      if (
        resultsGame.bet === "Over_3.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_3.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 4.5 FULL TIME
      if (
        resultsGame.bet === "Over_4.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_4.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 5.5 FULL TIME
      if (
        resultsGame.bet === "Over_5.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_5.5_FT" &&
        Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHEKING GAME RESULTS FOR OVER/UNDER FIRST HALF
      // UNDER 0.5 FIRST HALF
      if (
        resultsGame.bet === "Under_0.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_0.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 1.5 FIRST HALF
      if (
        resultsGame.bet === "Under_1.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_1.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 2.5 FIRST HALF
      if (
        resultsGame.bet === "Under_2.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_2.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 FIRST HALF
      if (
        resultsGame.bet === "Under_3.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_3.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 4.5 FIRST HALF
      if (
        resultsGame.bet === "Under_4.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_4.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 5.5 FIRST HALF
      if (
        resultsGame.bet === "Under_5.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_5.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 0.5 FIRST HALF
      if (
        resultsGame.bet === "Over_0.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_0.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 1.5 FIRST HALF
      if (
        resultsGame.bet === "Over_1.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_1.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 2.5 FIRST HALF
      if (
        resultsGame.bet === "Over_2.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_2.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 3.5 FIRST HALF
      if (
        resultsGame.bet === "Over_3.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_3.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 4.5 FIRST HALF
      if (
        resultsGame.bet === "Over_4.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_4.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 5.5 FIRST HALF
      if (
        resultsGame.bet === "Over_5.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) > 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_5.5_H1" &&
        Number(halfTime[0]) + Number(halfTime[1]) <= 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER/UNDER SECOND HALF
      // UNDER 0.5 SECOND HALF
      if (
        resultsGame.bet === "Under_0.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_0.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 1.5 SECOND HALF
      if (
        resultsGame.bet === "Under_1.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_1.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 2.5 SECOND HALF
      if (
        resultsGame.bet === "Under_2.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_2.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 SECOND HALF
      if (
        resultsGame.bet === "Under_3.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_3.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 4.5 SECOND HALF
      if (
        resultsGame.bet === "Under_4.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_4.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 5.5 SECOND HALF
      if (
        resultsGame.bet === "Under_5.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_5.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 0.5 SECOND HALF
      if (
        resultsGame.bet === "Over_0.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_0.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 1.5 SECOND HALF
      if (
        resultsGame.bet === "Over_1.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_1.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 2.5 SECOND HALF
      if (
        resultsGame.bet === "Over_2.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_2.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 3.5 SECOND HALF
      if (
        resultsGame.bet === "Over_3.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_3.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 4.5 SECOND HALF
      if (
        resultsGame.bet === "Over_4.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_4.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 5.5 SECOND HALF
      if (
        resultsGame.bet === "Over_5.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] > 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_5.5_H2" &&
        secondHalfScore[0] + secondHalfScore[1] <= 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME MARKET
      //CHECKING GAME RESULTS FOR HALFTIME/FULLTIME
      // HALFTIME/FULLTIME T1/T1
      if (
        resultsGame.bet === "HTFT_1/1" &&
        halfTime[0] > halfTime[1] &&
        fullTimeScore[0] > fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "HTFT_1/1" &&
        halfTime[0] <= halfTime[1] &&
        fullTimeScore[0] <= fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME T1/X
      if (
        resultsGame.bet === "HTFT_1/X" &&
        halfTime[0] > halfTime[1] &&
        fullTimeScore[0] === fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "HTFT_1/X" && halfTime[0] <= halfTime[1]) ||
        (resultsGame.bet === "HTFT_1/X" &&
          fullTimeScore[0] !== fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME T1/T2
      if (
        resultsGame.bet === "HTFT_1/2" &&
        halfTime[0] > halfTime[1] &&
        fullTimeScore[0] < fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "HTFT_1/2" &&
        halfTime[0] <= halfTime[1] &&
        fullTimeScore[0] >= fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME X/T1
      if (
        resultsGame.bet === "HTFT_X/1" &&
        halfTime[0] === halfTime[1] &&
        fullTimeScore[0] > fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "HTFT_X/1" && halfTime[0] !== halfTime[1]) ||
        (resultsGame.bet === "HTFT_X/1" && fullTimeScore[0] >= fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME X/X
      if (
        resultsGame.bet === "HTFT_X/X" &&
        halfTime[0] === halfTime[1] &&
        fullTimeScore[0] === fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "HTFT_X/X" && halfTime[0] !== halfTime[1]) ||
        (resultsGame.bet === "HTFT_X/X" &&
          fullTimeScore[0] !== fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME X/T2
      if (
        resultsGame.bet === "HTFT_X/2" &&
        halfTime[0] === halfTime[1] &&
        fullTimeScore[0] < fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "HTFT_X/2" && halfTime[0] !== halfTime[1]) ||
        (resultsGame.bet === "HTFT_X/2" && fullTimeScore[0] >= fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME T2/T1
      if (
        resultsGame.bet === "HTFT_2/1" &&
        halfTime[0] < halfTime[1] &&
        fullTimeScore[0] > fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "HTFT_2/1" && halfTime[0] >= halfTime[1]) ||
        (resultsGame.bet === "HTFT_2/1" && fullTimeScore[0] <= fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME T2/X
      if (
        resultsGame.bet === "HTFT_2/X" &&
        halfTime[0] < halfTime[1] &&
        fullTimeScore[0] === fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "HTFT_2/X" && halfTime[0] >= halfTime[1]) ||
        (resultsGame.bet === "HTFT_2/X" &&
          fullTimeScore[0] !== fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // HALFTIME/FULLTIME T2/T2
      if (
        resultsGame.bet === "HTFT_2/2" &&
        halfTime[0] < halfTime[1] &&
        fullTimeScore[0] < fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "HTFT_2/2" &&
        halfTime[0] >= halfTime[1] &&
        fullTimeScore[0] >= fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE MARKET
      // CHECKING GAME RESULTS FOR DOUBLE CHANCE FULL TIME
      // DOUBLE CHANCE T1/X FULL TIME

      if (
        resultsGame.bet === "DC_T1/X" &&
        fullTimeScore[0] >= fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_T1/X" &&
        fullTimeScore[0] < fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE T1/T2 FULL TIME
      if (
        resultsGame.bet === "DC_T1/T2" &&
        fullTimeScore[0] !== fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_T1/T2" &&
        fullTimeScore[0] === fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE X/T2 FULL TIME
      if (
        resultsGame.bet === "DC_X/T2" &&
        fullTimeScore[0] <= fullTimeScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_X/T2" &&
        fullTimeScore[0] > fullTimeScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING GAME RESULTS FOR DOUBLE CHANCE FIRST HALF
      // DOUBLE CHANCE T1/X FIRST HALF
      if (resultsGame.bet === "DC_T1/X_H1" && halfTime[0] >= halfTime[1]) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_T1/X_H1" &&
        halfTime[0] < halfTime[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE T1/T2 FIRST HALF
      if (resultsGame.bet === "DC_T1/T2_H1" && halfTime[0] !== halfTime[1]) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_T1/T2_H1" &&
        halfTime[0] === halfTime[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE X/T2 FIRST HALF
      if (resultsGame.bet === "DC_X/T2_H1" && halfTime[0] <= halfTime[1]) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_X/T2_H1" &&
        halfTime[0] > halfTime[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING FOR GAME RESULTS DOUBLE CHANCE SECOND HALF
      // DOUBLE CHANCE T1/T1 SECOND HALF
      if (
        resultsGame.bet === "DC_T1/X_H2" &&
        secondHalfScore[0] >= secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_T1/X_H2" &&
        secondHalfScore[0] < secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE T1/T2 SECOND HALF
      if (
        resultsGame.bet === "DC_T1/T2_H2" &&
        secondHalfScore[0] !== secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_T1/T2_H2" &&
        secondHalfScore[0] === secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DOUBLE CHANCE X/T2 SECOND HALF
      if (
        resultsGame.bet === "DC_X/T2_H2" &&
        secondHalfScore[0] <= secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DC_X/T2_H2" &&
        secondHalfScore[0] > secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      //HIGHEST SCORING HALF MARKET
      // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF FULL TIME
      // HIGHEST SCORING HALF FIRST HALF
      if (
        resultsGame.bet === "HSH_H1" &&
        halfTime[0] + halfTime[1] > secondHalfScore[0] + secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "HSH_H1" &&
        halfTime[0] + halfTime[1] <= secondHalfScore[0] + secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING FOR GAME RESULT HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
      // HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
      if (
        resultsGame.bet === "HSH_H1" &&
        halfTime[0] + halfTime[1] === secondHalfScore[0] + secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "HSH_H1" &&
        halfTime[0] + halfTime[1] !== secondHalfScore[0] + secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF SECOND HALF
      // HIGHEST SCORING HALF SECOND HALF
      if (
        resultsGame.bet === "HSH_H1" &&
        halfTime[0] + halfTime[1] < secondHalfScore[0] + secondHalfScore[1]
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "HSH_H1" &&
        halfTime[0] + halfTime[1] >= secondHalfScore[0] + secondHalfScore[1]
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // BOTH TEAMS TO SCORE MARKET
      //CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE FULL TIME
      // BOTH TEAMS TO SCORE YES FULL TIME
      if (
        resultsGame.bet === "BTS_YES" &&
        Number(fullTimeScore[0]) > 0 &&
        Number(fullTimeScore[1]) > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "BTS_YES" && Number(fullTimeScore[0]) === 0) ||
        (resultsGame.bet === "BTS_YES" && Number(fullTimeScore[1]) === 0)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // BOTH TEAMS TO SCORE NO FULL TIME
      if (
        resultsGame.bet === "BTS_NO" &&
        Number(fullTimeScore[0]) === 0 &&
        Number(fullTimeScore[1]) === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "BTS_NO" && Number(fullTimeScore[0]) === 0) ||
        (resultsGame.bet === "BTS_NO" && Number(fullTimeScore[1]) === 0)
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "BTS_NO" &&
        Number(fullTimeScore[0]) > 0 &&
        Number(fullTimeScore[1]) > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING FOR GAME RESULTS BOTH TEAMS TO SCORE FIRST HALF
      // BOTH TEAMS TO SCORE YES FIRST HALF
      if (
        resultsGame.bet === "BTS_YES_H1" &&
        Number(halfTime[0]) > 0 &&
        Number(halfTime[1]) > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "BTS_YES_H1" && Number(halfTime[0]) === 0) ||
        (resultsGame.bet === "BTS_YES_H1" && Number(halfTime[1]) === 0)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // BOTH TEAMS TO SCORE NO FIRST HALF
      if (
        resultsGame.bet === "BTS_NO_H1" &&
        Number(halfTime[0]) === 0 &&
        Number(halfTime[1]) === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "BTS_NO_H1" && Number(halfTime[0]) === 0) ||
        (resultsGame.bet === "BTS_NO_H1" && Number(halfTime[1]) === 0)
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "BTS_NO_H1" &&
        Number(halfTime[0]) > 0 &&
        Number(halfTime[1]) > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE SECOND HALF
      // BOTH TEAMS TO SCORE YES SECOND HALF
      if (
        resultsGame.bet === "BTS_YES_H2" &&
        Number(secondHalfScore[0]) > 0 &&
        Number(secondHalfScore[1]) > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "BTS_YES_H2" &&
          Number(secondHalfScore[0]) === 0) ||
        (resultsGame.bet === "BTS_YES_H2" && Number(secondHalfScore[1]) === 0)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // BOTH TEAMS TO SCORE NO SECOND HALF
      if (
        resultsGame.bet === "BTS_NO_H2" &&
        Number(secondHalfScore[0]) === 0 &&
        Number(secondHalfScore[1]) === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "BTS_NO_H2" && Number(secondHalfScore[0]) === 0) ||
        (resultsGame.bet === "BTS_NO_H2" && Number(secondHalfScore[1]) === 0)
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "BTS_NO_H2" &&
        Number(secondHalfScore[0]) > 0 &&
        Number(secondHalfScore[1]) > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // ODD EVEN MARKET
      // CHECKING GAME RESULTS FOR ODD EVEN FULL TIME
      // ODD FULL TIME
      if (
        resultsGame.bet === "OE_ODD_FT" &&
        Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "OE_ODD_FT" &&
        Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EVEN FULL TIME
      if (
        resultsGame.bet === "OE_EVEN_FT" &&
        Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "OE_EVEN_FT" &&
        Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING ODD EVEN RESULTS FIRST HALF
      // ODD HALF TIME
      if (
        resultsGame.bet === "OE_ODD_H1" &&
        Number(halfTime[0] + halfTime[1]) % 2 !== 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "OE_ODD_H1" &&
        Number(halfTime[0] + halfTime[1]) % 2 === 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EVEN HALF TIME
      if (
        resultsGame.bet === "OE_EVEN_H1" &&
        Number(halfTime[0] + halfTime[1]) % 2 === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "OE_EVEN_H1" &&
        Number(halfTime[0] + halfTime[1]) % 2 !== 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // CHECKING ODD EVEN RESULTS FOR SECOND HALF
      // ODD SECOND HALF
      if (
        resultsGame.bet === "OE_ODD_H2" &&
        Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "OE_ODD_H2" &&
        Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EVEN SECOND HALF
      if (
        resultsGame.bet === "OE_EVEN_H2" &&
        Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "OE_EVEN_H2" &&
        Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // 1x2 AND OVER/UNDER MARKET
      // CHECKING GAME RESULTS FOR 1X2 AND OVER/UNDER FULL TIME
      // OVER/UNDER T1 FULL TIME
      // OVER 0.5 T1 FULLTIME
      if (resultsGame.bet === "Over_0.5_T1" && Number(fullTimeScore[0]) >= 1) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_0.5_T1" &&
        Number(fullTimeScore[0]) < 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 0.5 T1 FULL TIME
      if (resultsGame.bet === "Under_0.5_T1" && Number(fullTimeScore[0]) <= 0) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_0.5_T1" &&
        Number(fullTimeScore[0]) > 0
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 1.5 T1 FULL TIME
      if (resultsGame.bet === "Over_1.5_T1" && Number(fullTimeScore[0]) >= 2) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_1.5_T1" &&
        Number(fullTimeScore[0]) < 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 1.5 T1 FULL TIME
      if (resultsGame.bet === "Under_1.5_T1" && Number(fullTimeScore[0]) <= 1) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_1.5_T1" &&
        Number(fullTimeScore[0]) > 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 2.5 T1 FULL TIME
      if (resultsGame.bet === "Over_2.5_T1" && Number(fullTimeScore[0]) >= 3) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_2.5_T1" &&
        Number(fullTimeScore[0]) < 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 2.5 T1 FULL TIME
      if (resultsGame.bet === "Under_2.5_T1" && Number(fullTimeScore[0]) <= 2) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_2.5_T1" &&
        Number(fullTimeScore[0]) > 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 3.5 T1 FULL TIME
      if (resultsGame.bet === "Over_3.5_T1" && Number(fullTimeScore[0]) >= 4) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_3.5_T1" &&
        Number(fullTimeScore[0]) < 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 T1 FULL TIME
      if (resultsGame.bet === "Under_3.5_T1" && Number(fullTimeScore[0]) <= 3) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_3.5_T1" &&
        Number(fullTimeScore[0]) > 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 4.5 T1 FULL TIME
      if (resultsGame.bet === "Over_4.5_T1" && Number(fullTimeScore[0]) >= 5) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_4.5_T1" &&
        Number(fullTimeScore[0]) < 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 4.5 T1 FULL TIME
      if (resultsGame.bet === "Under_4.5_T1" && Number(fullTimeScore[0]) <= 4) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_4.5_T1" &&
        Number(fullTimeScore[0]) > 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 5.5 T1 FULL TIME
      if (resultsGame.bet === "Over_5.5_T1" && Number(fullTimeScore[0]) >= 6) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_5.5_T1" &&
        Number(fullTimeScore[0]) < 6
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 5.5 T1 FULL TIME
      if (resultsGame.bet === "Under_5.5_T1" && Number(fullTimeScore[0]) <= 5) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_5.5_T1" &&
        Number(fullTimeScore[0]) > 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER/UNDER T2 FULL TIME
      // OVER 0.5 T2 FULL TIME
      if (resultsGame.bet === "Over_0.5_T2" && Number(fullTimeScore[1]) >= 1) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_0.5_T2" &&
        Number(fullTimeScore[1]) < 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 0.5 T2 FULL TIME
      if (resultsGame.bet === "Under_0.5_T2" && Number(fullTimeScore[1]) < 1) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_0.5_T2" &&
        Number(fullTimeScore[1]) >= 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 1.5 T2 FULL TIME
      if (resultsGame.bet === "Over_1.5_T2" && Number(fullTimeScore[1]) > 1) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_1.5_T2" &&
        Number(fullTimeScore[1]) <= 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 1.5 T2 FULL TIME
      if (resultsGame.bet === "Under_1.5_T2" && Number(fullTimeScore[1]) <= 1) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_1.5_T2" &&
        Number(fullTimeScore[1]) > 1
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      //  OVER 2.5 T2 FULL TIME
      if (resultsGame.bet === "Over_2.5_T2" && Number(fullTimeScore[1]) > 2) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_2.5_T2" &&
        Number(fullTimeScore[1]) <= 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 2.5 T2 FULL TIME
      if (resultsGame.bet === "Under_2.5_T2" && Number(fullTimeScore[1]) <= 2) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_2.5_T2" &&
        Number(fullTimeScore[1]) > 2
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 T2 FULL TIME
      if (resultsGame.bet === "Over_3.5_T2" && Number(fullTimeScore[1]) > 3) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_3.5_T2" &&
        Number(fullTimeScore[1]) <= 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 T2 FULL TIME
      if (resultsGame.bet === "Under_3.5_T2" && Number(fullTimeScore[1]) <= 3) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_3.5_T2" &&
        Number(fullTimeScore[1]) > 3
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 4.5 T2 FULL TIME
      if (resultsGame.bet === "Over_4.5_T2" && Number(fullTimeScore[1]) > 4) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_4.5_T2" &&
        Number(fullTimeScore[1]) <= 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 4.5 T2 FULL TIME
      if (resultsGame.bet === "Under_4.5_T2" && Number(fullTimeScore[1]) <= 4) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_4.5_T2" &&
        Number(fullTimeScore[1]) < 4
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 5.5 T2 FULL TIME
      if (resultsGame.bet === "Over_5.5_T2" && Number(fullTimeScore[1]) >= 6) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Over_0.5_T2" &&
        Number(fullTimeScore[1]) < 6
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 5.5 T2 FULL TIME
      if (resultsGame.bet === "Under_5.5_T2" && Number(fullTimeScore[1]) <= 5) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "Under_5.5_T2" &&
        Number(fullTimeScore[1]) > 5
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER/UNDER X FULL TIME
      // OVER 0.5 X FULL TIME
      if (
        resultsGame.bet === "Over_0.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) > 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Over_0.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_0.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) <= 0)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 0.5 X FULL TIME
      if (
        resultsGame.bet === "Under_0.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) <= 0
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Under_0.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_0.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) > 0)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 1.5 X FULL TIME
      if (
        resultsGame.bet === "Over_1.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) > 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Over_1.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_1.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) <= 1)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 1.5 X FULL TIME
      if (
        resultsGame.bet === "Under_1.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) <= 1
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Under_1.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Under_1.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) > 1)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 2.5 X FULL
      if (
        resultsGame.bet === "Over_2.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) > 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Over_2.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_2.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) <= 2)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 2.5 X FULL TIME
      if (
        resultsGame.bet === "Under_2.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) <= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Under_2.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Under_2.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) > 2)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 3.5 X FULL TIME
      if (
        resultsGame.bet === "Over_3.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) > 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Over_3.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_3.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) <= 3)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 3.5 X FULL TIME
      if (
        resultsGame.bet === "Under_3.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) <= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Under_3.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Under_3.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) > 3)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 4.5 X FULL TIME
      if (
        resultsGame.bet === "Over_4.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) > 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Over_4.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_4.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) <= 4)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 4.5 X FULL TIME
      if (
        resultsGame.bet === "Under_4.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) <= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Under_4.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Under_4.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) > 4)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // OVER 5.5 X FULL TIME
      if (
        resultsGame.bet === "Over_5.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) > 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Over_5.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Over_5.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) <= 5)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // UNDER 5.5 X FULL TIME
      if (
        resultsGame.bet === "Under_5.5_X" &&
        Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) <= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "Under_5.5_X" &&
          Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
        (resultsGame.bet === "Under_5.5_X" &&
          Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
          Number(fullTimeScore[0]) > 5)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DRAW NO BET MARKET
      // DRAW NO BET T1 FULL TIME
      if (
        resultsGame.bet === "DNB_T1" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1])
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DNB_T1" &&
        Number(fullTimeScore[0]) <= Number(fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // DRAW NO BET T2
      if (
        resultsGame.bet === "DNB_T2" &&
        Number(fullTimeScore[0]) < Number(fullTimeScore[1])
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        resultsGame.bet === "DNB_T2" &&
        Number(fullTimeScore[0]) >= Number(fullTimeScore[1])
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EUROPEAN HANDICAP MARKET
      // CHECKING GAME RESULTS FOR EH -5
      // EH -5 T1

      if (
        resultsGame.bet === "EH_5.0_T1" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_5.0_T1" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_5.0_T1" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -5 T2
      if (
        resultsGame.bet === "EH_5.0_T2" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_5.0_T2" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_5.0_T2" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -4 T1
      if (
        resultsGame.bet === "EH_4.0_T1" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_4.0_T1" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_4.0_T1" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -4 T2
      if (
        resultsGame.bet === "EH_4.0_T2" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_4.0_T2" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_4.0_T2" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -3 T1
      if (
        resultsGame.bet === "EH_3.0_T1" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_3.0_T1" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_3.0_T1" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -3 T2
      if (
        resultsGame.bet === "EH_3.0_T2" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_3.0_T2" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_3.0_T2" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -2 T1
      if (
        resultsGame.bet === "EH_2.0_T1" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_2.0_T1" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_2.0_T1" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) <= 3)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -2 T2
      if (
        resultsGame.bet === "EH_2.0_T2" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_2.0_T2" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_2.0_T2" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -1 T1
      if (
        resultsGame.bet === "EH_1.0_T1" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_1.0_T1" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_1.0_T1" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH -1 T2
      if (
        resultsGame.bet === "EH_1.0_T2" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_1.0_T2" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_1.0_T2" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 1 T1
      if (
        resultsGame.bet === "EH_0.1_T1" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.1_T1" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_0.1_T1" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 1 T2
      if (
        resultsGame.bet === "EH_0.1_T2" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.1_T2" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_0.1_T2" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 2 T1
      if (
        resultsGame.bet === "EH_0.2_T1" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.2_T1" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_0.2_T1" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 2 T2
      if (
        resultsGame.bet === "EH_0.2_T2" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.2_T2" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_0.2_T2" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 3)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 3 T1
      if (
        resultsGame.bet === "EH_0.3_T1" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.3_T1" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_0.3_T1" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 3 T2
      if (
        resultsGame.bet === "EH_0.3_T2" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.3_T2" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_0.3_T2" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 4 T1
      if (
        resultsGame.bet === "EH_0.4_T1" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.4_T1" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_0.4_T1" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 4 T2
      if (
        resultsGame.bet === "EH_0.4_T2" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.4_T2" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_0.4_T2" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 5 T1
      if (
        resultsGame.bet === "EH_0.5_T1" &&
        Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
        Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.5_T1" &&
          Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
        (resultsGame.bet === "EH_0.5_T1" &&
          Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }

      // EH 5 T2
      if (
        resultsGame.bet === "EH_0.5_T2" &&
        Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
        Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
      ) {
        setWin(true);
        updateParentArray("Win", index);
      } else if (
        (resultsGame.bet === "EH_0.5_T2" &&
          Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
        (resultsGame.bet === "EH_0.5_T2" &&
          Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
      ) {
        setWin(false);
        updateParentArray("Loss", index);
      }
    }
    // }, 10000);
    // return () => clearInterval(interval);
    console.log(resultsGame);
  }, [resultsGame.event_id]);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="bets col-12 py-2">
      <p className="mb-2 p-0 d-flex justify-content-between align-items-center ">
        <span className="px-1 text-center">{resultsGame.game_number}</span>
        <span className="col-5 pe-4 text-left">
          <span className="col-12">
            {resultsGame.home + " - " + resultsGame.away}
          </span>
          <br />
          <span className="col-md-12">{resultsGame.bet}</span>
        </span>
        <span className="col-md-2 text-left">
          {new Date(resultsGame.date_played).toDateString()} <br />
          {new Date(resultsGame.date_played).toTimeString().slice(0, 9)}
        </span>
        <strong className="col-1 px-2 text-center">{resultsGame.odd}</strong>
        {gameStatus === "Pending" ? (
          <span className="col-2 text-center text-info">{gameStatus}</span>
        ) : win ? (
          <span className="col-2 text-center">
            {gameStatus} <br />
            <b className="text-success fs-4">&#10003;</b>
          </span>
        ) : (
          <span className="col-2 text-center">
            {gameStatus} <br />
            <b className="text-danger fs-4">&times;</b>
          </span>
        )}
      </p>
    </div>
  );
};

export default ResultsGame;
