import React, { useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import { useReactToPrint } from "react-to-print";
import ResultsRow from "./results-row";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import xml2js from "xml2js";
import { SelectedGameModule } from "./modules/selected-game-module";
import ScreenPreloader from "./screen-preloader";

interface Props {
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
  refreshGameIDs: () => any;
  // exportToExcel: () => any;
}

const ResultsTable: React.FC<Props> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
  refreshGameIDs,
  // exportToExcel,
}) => {
  const [groupedGames, setGroupedGame] = useState<any[]>([]);
  const [receiptStatus, setReceiptStatus] = useState<number>(0);

  let componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  // const updateReceiptStatus = (
  //   receipt_number: number,
  //   game_status: string[],
  //   receipt_status: string
  // ) => {
  //   axios
  //     .get(`${AppUrl()}/fetch-results/${receipt_number}`)
  //     .then((res) => {
  //       res.data.games.forEach((game: SelectedGameModule) => {
  //         if (game.short_score === "Not started") {
  //           game_status.push("0");
  //         } else {
  //           const scoreArray = game.short_score.split(" ");
  //           const fullTimeScore = scoreArray[0].split(":");
  //           const HalfTimeScore = scoreArray[1].split("");
  //           const halfTime: any = HalfTimeScore.filter(
  //             (hts) => hts !== "(" && hts !== ")" && hts !== ":"
  //           );
  //           const seconHalfT1: number =
  //             Number(fullTimeScore[0]) - Number(halfTime[0]);
  //           const seconHalfT2: number =
  //             Number(fullTimeScore[1]) - Number(halfTime[1]);
  //           const secondHalfScore = [seconHalfT1, seconHalfT2];

  //           // 1X2 MARKET
  //           // CHECKING GAME RESULTS FOR 1X2 FULL TIME
  //           if (
  //             game.bet === "FT_1x2: 1" &&
  //             fullTimeScore[0] > fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "FT_1x2: 1" &&
  //             fullTimeScore[0] <= fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           } else if (
  //             game.bet === "FT_1x2: 2" &&
  //             fullTimeScore[0] < fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "FT_1x2: 2" &&
  //             fullTimeScore[0] >= fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           } else if (
  //             game.bet === "1x2_FT: X" &&
  //             fullTimeScore[0] === fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "1x2_FT: X" &&
  //             fullTimeScore[0] !== fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING GAME RESULTS FOR 1x2 FIRST HALF
  //           if (game.bet === "1x2_H1: 1" && halfTime[0] > halfTime[1]) {
  //             game_status.push("1");
  //           } else if (game.bet === "1x2_H1: 1" && halfTime[0] <= halfTime[1]) {
  //             game_status.push("2");
  //           } else if (game.bet === "1x2_H1: 2" && halfTime[0] < halfTime[1]) {
  //             game_status.push("1");
  //           } else if (game.bet === "1x2_H1: 2" && halfTime[0] >= halfTime[1]) {
  //             game_status.push("2");
  //           } else if (
  //             game.bet === "1x2_H1: X" &&
  //             halfTime[0] === halfTime[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "1x2_H1: X" &&
  //             halfTime[0] !== halfTime[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING GAME RESULTS FOR 1X2 SECOND HALF
  //           if (
  //             game.bet === "1x2_H2: 1" &&
  //             secondHalfScore[0] > secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "1x2_H2: 1" &&
  //             secondHalfScore[0] <= secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           } else if (
  //             game.bet === "1x2_H2: 2" &&
  //             secondHalfScore[0] < secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "1x2_H2: 1" &&
  //             secondHalfScore[0] >= secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           } else if (
  //             game.bet === "1x2_H2: X" &&
  //             secondHalfScore[0] === secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "1x2_H2: X" &&
  //             secondHalfScore[0] !== secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER/UNDER MARKET
  //           // CHEKING GAME RESULTS FOR OVER/UNDER FULL TIME
  //           // UNDER 0.5 FULL TIME
  //           if (
  //             game.bet === "Under_O.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_O.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 1.5 FULL TIME
  //           if (
  //             game.bet === "Under_1.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_1.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 2.5 FULL TIME
  //           if (
  //             game.bet === "Under_2.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_2.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 FULL TIME
  //           if (
  //             game.bet === "Under_3.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_3.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 4.5 FULL TIME
  //           if (
  //             game.bet === "Under_4.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_4.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 5.5 FULLT TIME
  //           if (
  //             game.bet === "Under_5.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_5.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 0.5 FULL TIME
  //           if (
  //             game.bet === "Over_O.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_O.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) < 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 1.5 FULL TIME
  //           if (
  //             game.bet === "Over_1.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_1.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 2.5 FULL TIME
  //           if (
  //             game.bet === "Over_2.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_2.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 3.5 FULL TIME
  //           if (
  //             game.bet === "Over_3.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_3.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 4.5 FULL TIME
  //           if (
  //             game.bet === "Over_4.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_4.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 5.5 FULL TIME
  //           if (
  //             game.bet === "Over_5.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_5.5_FT" &&
  //             Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHEKING GAME RESULTS FOR OVER/UNDER FIRST HALF
  //           // UNDER 0.5 FIRST HALF
  //           if (
  //             game.bet === "Under_0.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_0.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 1.5 FIRST HALF
  //           if (
  //             game.bet === "Under_1.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_1.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 2.5 FIRST HALF
  //           if (
  //             game.bet === "Under_2.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_2.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 FIRST HALF
  //           if (
  //             game.bet === "Under_3.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_3.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 4.5 FIRST HALF
  //           if (
  //             game.bet === "Under_4.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_4.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 5.5 FIRST HALF
  //           if (
  //             game.bet === "Under_5.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_5.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 0.5 FIRST HALF
  //           if (
  //             game.bet === "Over_0.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_0.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 1.5 FIRST HALF
  //           if (
  //             game.bet === "Over_1.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_1.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 2.5 FIRST HALF
  //           if (
  //             game.bet === "Over_2.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_2.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 3.5 FIRST HALF
  //           if (
  //             game.bet === "Over_3.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_3.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 4.5 FIRST HALF
  //           if (
  //             game.bet === "Over_4.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_4.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 5.5 FIRST HALF
  //           if (
  //             game.bet === "Over_5.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) > 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_5.5_H1" &&
  //             Number(halfTime[0]) + Number(halfTime[1]) <= 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER/UNDER SECOND HALF
  //           // UNDER 0.5 SECOND HALF
  //           if (
  //             game.bet === "Under_0.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_0.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 1.5 SECOND HALF
  //           if (
  //             game.bet === "Under_1.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_1.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 2.5 SECOND HALF
  //           if (
  //             game.bet === "Under_2.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_2.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 SECOND HALF
  //           if (
  //             game.bet === "Under_3.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_3.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 4.5 SECOND HALF
  //           if (
  //             game.bet === "Under_4.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_4.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 5.5 SECOND HALF
  //           if (
  //             game.bet === "Under_5.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_5.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 0.5 SECOND HALF
  //           if (
  //             game.bet === "Over_0.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_0.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 1.5 SECOND HALF
  //           if (
  //             game.bet === "Over_1.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_1.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 2.5 SECOND HALF
  //           if (
  //             game.bet === "Over_2.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_2.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 3.5 SECOND HALF
  //           if (
  //             game.bet === "Over_3.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_3.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 4.5 SECOND HALF
  //           if (
  //             game.bet === "Over_4.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_4.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 5.5 SECOND HALF
  //           if (
  //             game.bet === "Over_5.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] > 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_5.5_H2" &&
  //             secondHalfScore[0] + secondHalfScore[1] <= 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME MARKET
  //           //CHECKING GAME RESULTS FOR HALFTIME/FULLTIME
  //           // HALFTIME/FULLTIME T1/T1
  //           if (
  //             game.bet === "HTFT_1/1" &&
  //             halfTime[0] > halfTime[1] &&
  //             fullTimeScore[0] > fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "HTFT_1/1" &&
  //             halfTime[0] <= halfTime[1] &&
  //             fullTimeScore[0] <= fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME T1/X
  //           if (
  //             game.bet === "HTFT_1/X" &&
  //             halfTime[0] > halfTime[1] &&
  //             fullTimeScore[0] === fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "HTFT_1/X" && halfTime[0] <= halfTime[1]) ||
  //             (game.bet === "HTFT_1/X" && fullTimeScore[0] !== fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME T1/T2
  //           if (
  //             game.bet === "HTFT_1/2" &&
  //             halfTime[0] > halfTime[1] &&
  //             fullTimeScore[0] < fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "HTFT_1/2" &&
  //             halfTime[0] <= halfTime[1] &&
  //             fullTimeScore[0] >= fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME X/T1
  //           if (
  //             game.bet === "HTFT_X/1" &&
  //             halfTime[0] === halfTime[1] &&
  //             fullTimeScore[0] > fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "HTFT_X/1" && halfTime[0] !== halfTime[1]) ||
  //             (game.bet === "HTFT_X/1" && fullTimeScore[0] >= fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME X/X
  //           if (
  //             game.bet === "HTFT_X/X" &&
  //             halfTime[0] === halfTime[1] &&
  //             fullTimeScore[0] === fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "HTFT_X/X" && halfTime[0] !== halfTime[1]) ||
  //             (game.bet === "HTFT_X/X" && fullTimeScore[0] !== fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME X/T2
  //           if (
  //             game.bet === "HTFT_X/2" &&
  //             halfTime[0] === halfTime[1] &&
  //             fullTimeScore[0] < fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "HTFT_X/2" && halfTime[0] !== halfTime[1]) ||
  //             (game.bet === "HTFT_X/2" && fullTimeScore[0] >= fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME T2/T1
  //           if (
  //             game.bet === "HTFT_2/1" &&
  //             halfTime[0] < halfTime[1] &&
  //             fullTimeScore[0] > fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "HTFT_2/1" && halfTime[0] >= halfTime[1]) ||
  //             (game.bet === "HTFT_2/1" && fullTimeScore[0] <= fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME T2/X
  //           if (
  //             game.bet === "HTFT_2/X" &&
  //             halfTime[0] < halfTime[1] &&
  //             fullTimeScore[0] === fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "HTFT_2/X" && halfTime[0] >= halfTime[1]) ||
  //             (game.bet === "HTFT_2/X" && fullTimeScore[0] !== fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // HALFTIME/FULLTIME T2/T2
  //           if (
  //             game.bet === "HTFT_2/2" &&
  //             halfTime[0] < halfTime[1] &&
  //             fullTimeScore[0] < fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "HTFT_2/2" &&
  //             halfTime[0] >= halfTime[1] &&
  //             fullTimeScore[0] >= fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE MARKET
  //           // CHECKING GAME RESULTS FOR DOUBLE CHANCE FULL TIME
  //           // DOUBLE CHANCE T1/X FULL TIME

  //           if (
  //             game.bet === "DC_T1/X" &&
  //             fullTimeScore[0] >= fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_T1/X" &&
  //             fullTimeScore[0] < fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE T1/T2 FULL TIME
  //           if (
  //             game.bet === "DC_T1/T2" &&
  //             fullTimeScore[0] !== fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_T1/T2" &&
  //             fullTimeScore[0] === fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE X/T2 FULL TIME
  //           if (
  //             game.bet === "DC_X/T2" &&
  //             fullTimeScore[0] <= fullTimeScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_X/T2" &&
  //             fullTimeScore[0] > fullTimeScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING GAME RESULTS FOR DOUBLE CHANCE FIRST HALF
  //           // DOUBLE CHANCE T1/X FIRST HALF
  //           if (game.bet === "DC_T1/X_H1" && halfTime[0] >= halfTime[1]) {
  //             game_status.push("1");
  //           } else if (game.bet === "DC_T1/X_H1" && halfTime[0] < halfTime[1]) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE T1/T2 FIRST HALF
  //           if (game.bet === "DC_T1/T2_H1" && halfTime[0] !== halfTime[1]) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_T1/T2_H1" &&
  //             halfTime[0] === halfTime[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE X/T2 FIRST HALF
  //           if (game.bet === "DC_X/T2_H1" && halfTime[0] <= halfTime[1]) {
  //             game_status.push("1");
  //           } else if (game.bet === "DC_X/T2_H1" && halfTime[0] > halfTime[1]) {
  //             game_status.push("2");
  //           }

  //           // CHECKING FOR GAME RESULTS DOUBLE CHANCE SECOND HALF
  //           // DOUBLE CHANCE T1/T1 SECOND HALF
  //           if (
  //             game.bet === "DC_T1/X_H2" &&
  //             secondHalfScore[0] >= secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_T1/X_H2" &&
  //             secondHalfScore[0] < secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE T1/T2 SECOND HALF
  //           if (
  //             game.bet === "DC_T1/T2_H2" &&
  //             secondHalfScore[0] !== secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_T1/T2_H2" &&
  //             secondHalfScore[0] === secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DOUBLE CHANCE X/T2 SECOND HALF
  //           if (
  //             game.bet === "DC_X/T2_H2" &&
  //             secondHalfScore[0] <= secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DC_X/T2_H2" &&
  //             secondHalfScore[0] > secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           //HIGHEST SCORING HALF MARKET
  //           // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF FULL TIME
  //           // HIGHEST SCORING HALF FIRST HALF
  //           if (
  //             game.bet === "HSH_H1" &&
  //             halfTime[0] + halfTime[1] >
  //               secondHalfScore[0] + secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "HSH_H1" &&
  //             halfTime[0] + halfTime[1] <=
  //               secondHalfScore[0] + secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING FOR GAME RESULT HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
  //           // HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
  //           if (
  //             game.bet === "HSH_H1" &&
  //             halfTime[0] + halfTime[1] ===
  //               secondHalfScore[0] + secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "HSH_H1" &&
  //             halfTime[0] + halfTime[1] !==
  //               secondHalfScore[0] + secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF SECOND HALF
  //           // HIGHEST SCORING HALF SECOND HALF
  //           if (
  //             game.bet === "HSH_H1" &&
  //             halfTime[0] + halfTime[1] <
  //               secondHalfScore[0] + secondHalfScore[1]
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "HSH_H1" &&
  //             halfTime[0] + halfTime[1] >=
  //               secondHalfScore[0] + secondHalfScore[1]
  //           ) {
  //             game_status.push("2");
  //           }

  //           // BOTH TEAMS TO SCORE MARKET
  //           //CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE FULL TIME
  //           // BOTH TEAMS TO SCORE YES FULL TIME
  //           if (
  //             game.bet === "BTS_YES" &&
  //             Number(fullTimeScore[0]) > 0 &&
  //             Number(fullTimeScore[1]) > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "BTS_YES" && Number(fullTimeScore[0]) === 0) ||
  //             (game.bet === "BTS_YES" && Number(fullTimeScore[1]) === 0)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // BOTH TEAMS TO SCORE NO FULL TIME
  //           if (
  //             game.bet === "BTS_NO" &&
  //             Number(fullTimeScore[0]) === 0 &&
  //             Number(fullTimeScore[1]) === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "BTS_NO" && Number(fullTimeScore[0]) === 0) ||
  //             (game.bet === "BTS_NO" && Number(fullTimeScore[1]) === 0)
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "BTS_NO" &&
  //             Number(fullTimeScore[0]) > 0 &&
  //             Number(fullTimeScore[1]) > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING FOR GAME RESULTS BOTH TEAMS TO SCORE FIRST HALF
  //           // BOTH TEAMS TO SCORE YES FIRST HALF
  //           if (
  //             game.bet === "BTS_YES_H1" &&
  //             Number(halfTime[0]) > 0 &&
  //             Number(halfTime[1]) > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "BTS_YES_H1" && Number(halfTime[0]) === 0) ||
  //             (game.bet === "BTS_YES_H1" && Number(halfTime[1]) === 0)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // BOTH TEAMS TO SCORE NO FIRST HALF
  //           if (
  //             game.bet === "BTS_NO_H1" &&
  //             Number(halfTime[0]) === 0 &&
  //             Number(halfTime[1]) === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "BTS_NO_H1" && Number(halfTime[0]) === 0) ||
  //             (game.bet === "BTS_NO_H1" && Number(halfTime[1]) === 0)
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "BTS_NO_H1" &&
  //             Number(halfTime[0]) > 0 &&
  //             Number(halfTime[1]) > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE SECOND HALF
  //           // BOTH TEAMS TO SCORE YES SECOND HALF
  //           if (
  //             game.bet === "BTS_YES_H2" &&
  //             Number(secondHalfScore[0]) > 0 &&
  //             Number(secondHalfScore[1]) > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "BTS_YES_H2" && Number(secondHalfScore[0]) === 0) ||
  //             (game.bet === "BTS_YES_H2" && Number(secondHalfScore[1]) === 0)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // BOTH TEAMS TO SCORE NO SECOND HALF
  //           if (
  //             game.bet === "BTS_NO_H2" &&
  //             Number(secondHalfScore[0]) === 0 &&
  //             Number(secondHalfScore[1]) === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "BTS_NO_H2" && Number(secondHalfScore[0]) === 0) ||
  //             (game.bet === "BTS_NO_H2" && Number(secondHalfScore[1]) === 0)
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "BTS_NO_H2" &&
  //             Number(secondHalfScore[0]) > 0 &&
  //             Number(secondHalfScore[1]) > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // ODD EVEN MARKET
  //           // CHECKING GAME RESULTS FOR ODD EVEN FULL TIME
  //           // ODD FULL TIME
  //           if (
  //             game.bet === "OE_ODD_FT" &&
  //             Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "OE_ODD_FT" &&
  //             Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EVEN FULL TIME
  //           if (
  //             game.bet === "OE_EVEN_FT" &&
  //             Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "OE_EVEN_FT" &&
  //             Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING ODD EVEN RESULTS FIRST HALF
  //           // ODD HALF TIME
  //           if (
  //             game.bet === "OE_ODD_H1" &&
  //             Number(halfTime[0] + halfTime[1]) % 2 !== 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "OE_ODD_H1" &&
  //             Number(halfTime[0] + halfTime[1]) % 2 === 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EVEN HALF TIME
  //           if (
  //             game.bet === "OE_EVEN_H1" &&
  //             Number(halfTime[0] + halfTime[1]) % 2 === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "OE_EVEN_H1" &&
  //             Number(halfTime[0] + halfTime[1]) % 2 !== 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // CHECKING ODD EVEN RESULTS FOR SECOND HALF
  //           // ODD SECOND HALF
  //           if (
  //             game.bet === "OE_ODD_H2" &&
  //             Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "OE_ODD_H2" &&
  //             Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EVEN SECOND HALF
  //           if (
  //             game.bet === "OE_EVEN_H2" &&
  //             Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "OE_EVEN_H2" &&
  //             Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // 1x2 AND OVER/UNDER MARKET
  //           // CHECKING GAME RESULTS FOR 1X2 AND OVER/UNDER FULL TIME
  //           // OVER/UNDER T1 FULL TIME
  //           // OVER 0.5 T1 FULLTIME
  //           if (game.bet === "Over_0.5_T1" && Number(fullTimeScore[0]) >= 1) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_0.5_T1" &&
  //             Number(fullTimeScore[0]) < 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 0.5 T1 FULL TIME
  //           if (game.bet === "Under_0.5_T1" && Number(fullTimeScore[0]) <= 0) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_0.5_T1" &&
  //             Number(fullTimeScore[0]) > 0
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 1.5 T1 FULL TIME
  //           if (game.bet === "Over_1.5_T1" && Number(fullTimeScore[0]) >= 2) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_1.5_T1" &&
  //             Number(fullTimeScore[0]) < 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 1.5 T1 FULL TIME
  //           if (game.bet === "Under_1.5_T1" && Number(fullTimeScore[0]) <= 1) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_1.5_T1" &&
  //             Number(fullTimeScore[0]) > 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 2.5 T1 FULL TIME
  //           if (game.bet === "Over_2.5_T1" && Number(fullTimeScore[0]) >= 3) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_2.5_T1" &&
  //             Number(fullTimeScore[0]) < 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 2.5 T1 FULL TIME
  //           if (game.bet === "Under_2.5_T1" && Number(fullTimeScore[0]) <= 2) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_2.5_T1" &&
  //             Number(fullTimeScore[0]) > 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 3.5 T1 FULL TIME
  //           if (game.bet === "Over_3.5_T1" && Number(fullTimeScore[0]) >= 4) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_3.5_T1" &&
  //             Number(fullTimeScore[0]) < 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 T1 FULL TIME
  //           if (game.bet === "Under_3.5_T1" && Number(fullTimeScore[0]) <= 3) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_3.5_T1" &&
  //             Number(fullTimeScore[0]) > 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 4.5 T1 FULL TIME
  //           if (game.bet === "Over_4.5_T1" && Number(fullTimeScore[0]) >= 5) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_4.5_T1" &&
  //             Number(fullTimeScore[0]) < 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 4.5 T1 FULL TIME
  //           if (game.bet === "Under_4.5_T1" && Number(fullTimeScore[0]) <= 4) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_4.5_T1" &&
  //             Number(fullTimeScore[0]) > 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 5.5 T1 FULL TIME
  //           if (game.bet === "Over_5.5_T1" && Number(fullTimeScore[0]) >= 6) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_5.5_T1" &&
  //             Number(fullTimeScore[0]) < 6
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 5.5 T1 FULL TIME
  //           if (game.bet === "Under_5.5_T1" && Number(fullTimeScore[0]) <= 5) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_5.5_T1" &&
  //             Number(fullTimeScore[0]) > 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER/UNDER T2 FULL TIME
  //           // OVER 0.5 T2 FULL TIME
  //           if (game.bet === "Over_0.5_T2" && Number(fullTimeScore[1]) >= 1) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_0.5_T2" &&
  //             Number(fullTimeScore[1]) < 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 0.5 T2 FULL TIME
  //           if (game.bet === "Under_0.5_T2" && Number(fullTimeScore[1]) < 1) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_0.5_T2" &&
  //             Number(fullTimeScore[1]) >= 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 1.5 T2 FULL TIME
  //           if (game.bet === "Over_1.5_T2" && Number(fullTimeScore[1]) > 1) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_1.5_T2" &&
  //             Number(fullTimeScore[1]) <= 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 1.5 T2 FULL TIME
  //           if (game.bet === "Under_1.5_T2" && Number(fullTimeScore[1]) <= 1) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_1.5_T2" &&
  //             Number(fullTimeScore[1]) > 1
  //           ) {
  //             game_status.push("2");
  //           }

  //           //  OVER 2.5 T2 FULL TIME
  //           if (game.bet === "Over_2.5_T2" && Number(fullTimeScore[1]) > 2) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_2.5_T2" &&
  //             Number(fullTimeScore[1]) <= 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 2.5 T2 FULL TIME
  //           if (game.bet === "Under_2.5_T2" && Number(fullTimeScore[1]) <= 2) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_2.5_T2" &&
  //             Number(fullTimeScore[1]) > 2
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 T2 FULL TIME
  //           if (game.bet === "Over_3.5_T2" && Number(fullTimeScore[1]) > 3) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_3.5_T2" &&
  //             Number(fullTimeScore[1]) <= 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 T2 FULL TIME
  //           if (game.bet === "Under_3.5_T2" && Number(fullTimeScore[1]) <= 3) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_3.5_T2" &&
  //             Number(fullTimeScore[1]) > 3
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 4.5 T2 FULL TIME
  //           if (game.bet === "Over_4.5_T2" && Number(fullTimeScore[1]) > 4) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_4.5_T2" &&
  //             Number(fullTimeScore[1]) <= 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 4.5 T2 FULL TIME
  //           if (game.bet === "Under_4.5_T2" && Number(fullTimeScore[1]) <= 4) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_4.5_T2" &&
  //             Number(fullTimeScore[1]) < 4
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 5.5 T2 FULL TIME
  //           if (game.bet === "Over_5.5_T2" && Number(fullTimeScore[1]) >= 6) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Over_0.5_T2" &&
  //             Number(fullTimeScore[1]) < 6
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 5.5 T2 FULL TIME
  //           if (game.bet === "Under_5.5_T2" && Number(fullTimeScore[1]) <= 5) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "Under_5.5_T2" &&
  //             Number(fullTimeScore[1]) > 5
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER/UNDER X FULL TIME
  //           // OVER 0.5 X FULL TIME
  //           if (
  //             game.bet === "Over_0.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) > 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Over_0.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_0.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) <= 0)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 0.5 X FULL TIME
  //           if (
  //             game.bet === "Under_0.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) <= 0
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Under_0.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_0.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) > 0)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 1.5 X FULL TIME
  //           if (
  //             game.bet === "Over_1.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) > 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Over_1.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_1.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) <= 1)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 1.5 X FULL TIME
  //           if (
  //             game.bet === "Under_1.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) <= 1
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Under_1.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Under_1.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) > 1)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 2.5 X FULL
  //           if (
  //             game.bet === "Over_2.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) > 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Over_2.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_2.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) <= 2)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 2.5 X FULL TIME
  //           if (
  //             game.bet === "Under_2.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) <= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Under_2.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Under_2.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) > 2)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 3.5 X FULL TIME
  //           if (
  //             game.bet === "Over_3.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) > 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Over_3.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_3.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) <= 3)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 3.5 X FULL TIME
  //           if (
  //             game.bet === "Under_3.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) <= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Under_3.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Under_3.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) > 3)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 4.5 X FULL TIME
  //           if (
  //             game.bet === "Over_4.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) > 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Over_4.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_4.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) <= 4)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 4.5 X FULL TIME
  //           if (
  //             game.bet === "Under_4.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) <= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Under_4.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Under_4.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) > 4)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // OVER 5.5 X FULL TIME
  //           if (
  //             game.bet === "Over_5.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) > 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Over_5.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Over_5.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) <= 5)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // UNDER 5.5 X FULL TIME
  //           if (
  //             game.bet === "Under_5.5_X" &&
  //             Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) <= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "Under_5.5_X" &&
  //               Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
  //             (game.bet === "Under_5.5_X" &&
  //               Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
  //               Number(fullTimeScore[0]) > 5)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DRAW NO BET MARKET
  //           // DRAW NO BET T1 FULL TIME
  //           if (
  //             game.bet === "DNB_T1" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1])
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DNB_T1" &&
  //             Number(fullTimeScore[0]) <= Number(fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // DRAW NO BET T2
  //           if (
  //             game.bet === "DNB_T2" &&
  //             Number(fullTimeScore[0]) < Number(fullTimeScore[1])
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             game.bet === "DNB_T2" &&
  //             Number(fullTimeScore[0]) >= Number(fullTimeScore[1])
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EUROPEAN HANDICAP MARKET
  //           // CHECKING GAME RESULTS FOR EH -5
  //           // EH -5 T1

  //           if (
  //             game.bet === "EH_5.0_T1" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_5.0_T1" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_5.0_T1" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -5 T2
  //           if (
  //             game.bet === "EH_5.0_T2" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_5.0_T2" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_5.0_T2" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -4 T1
  //           if (
  //             game.bet === "EH_4.0_T1" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_4.0_T1" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_4.0_T1" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -4 T2
  //           if (
  //             game.bet === "EH_4.0_T2" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_4.0_T2" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_4.0_T2" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -3 T1
  //           if (
  //             game.bet === "EH_3.0_T1" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_3.0_T1" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_3.0_T1" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -3 T2
  //           if (
  //             game.bet === "EH_3.0_T2" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_3.0_T2" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_3.0_T2" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -2 T1
  //           if (
  //             game.bet === "EH_2.0_T1" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_2.0_T1" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_2.0_T1" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) <= 3)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -2 T2
  //           if (
  //             game.bet === "EH_2.0_T2" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_2.0_T2" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_2.0_T2" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -1 T1
  //           if (
  //             game.bet === "EH_1.0_T1" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_1.0_T1" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_1.0_T1" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH -1 T2
  //           if (
  //             game.bet === "EH_1.0_T2" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_1.0_T2" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_1.0_T2" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 1 T1
  //           if (
  //             game.bet === "EH_0.1_T1" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.1_T1" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_0.1_T1" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 1 T2
  //           if (
  //             game.bet === "EH_0.1_T2" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.1_T2" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_0.1_T2" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 2 T1
  //           if (
  //             game.bet === "EH_0.2_T1" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.2_T1" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_0.2_T1" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 2 T2
  //           if (
  //             game.bet === "EH_0.2_T2" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.2_T2" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_0.2_T2" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 3)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 3 T1
  //           if (
  //             game.bet === "EH_0.3_T1" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.3_T1" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_0.3_T1" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 3 T2
  //           if (
  //             game.bet === "EH_0.3_T2" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.3_T2" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_0.3_T2" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 4 T1
  //           if (
  //             game.bet === "EH_0.4_T1" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.4_T1" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_0.4_T1" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 4 T2
  //           if (
  //             game.bet === "EH_0.4_T2" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.4_T2" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_0.4_T2" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 5 T1
  //           if (
  //             game.bet === "EH_0.5_T1" &&
  //             Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
  //             Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.5_T1" &&
  //               Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
  //             (game.bet === "EH_0.5_T1" &&
  //               Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
  //           ) {
  //             game_status.push("2");
  //           }

  //           // EH 5 T2
  //           if (
  //             game.bet === "EH_0.5_T2" &&
  //             Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
  //             Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
  //           ) {
  //             game_status.push("1");
  //           } else if (
  //             (game.bet === "EH_0.5_T2" &&
  //               Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
  //             (game.bet === "EH_0.5_T2" &&
  //               Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
  //           ) {
  //             game_status.push("2");
  //           }
  //         }
  //       });
  //     })
  //     .catch((error) => console.log(error));

  //   // const pendingStatus = game_status.includes("0");
  //   // const lossStatus = game_status.includes("2");
  //   // const winStatus = game_status.includes("1");

  //   const pendingStatus = game_status.includes("0");
  //   const lossStatus = game_status.includes("2");
  //   const winStatus = game_status.includes("1");

  //   if (pendingStatus && !lossStatus) {
  //     receipt_status = "0";
  //   } else if (lossStatus) {
  //     receipt_status = "2";
  //   } else if (!pendingStatus && !lossStatus && winStatus) {
  //     receipt_status = "1";
  //   }

  //   console.log({
  //     receipt_status: receipt_status,
  //     games_status: game_status,
  //     pending: pendingStatus,
  //     win: winStatus,
  //     lossStatus: lossStatus,
  //   });
  // };

  // FETCH GAME IDS FROM THE DATABASE
  useEffect(() => {
    const today = new Date();
    const dates =
      today.getFullYear() + "-" + today.getMonth() + 1 + "-" + today.getDate();

    // const interval = setInterval(() => {
    axios
      .get(`${AppUrl()}/fetch-result-ids`)
      .then((res) => {
        res.data.IDs.forEach((id: any) => {
          axios
            .get(`${AppUrl()}/fetch-api-results/${id.event_id}`)
            .then(async (res) => {
              // window.alert(JSON.stringify(res.data));

              const result = await parseXml(res.data.game);

              if (result.markets.$.CNT !== "0") {
                const result_game = [
                  ...result.markets.S.map((s: any) =>
                    s.C.map((c: any) =>
                      c.L.map((l: any) =>
                        l.E.map((e: any, i: number) => {
                          saveResults(
                            e.$.I,
                            e.$.sc,
                            e.$.sce,
                            e.$.DT,
                            c.$.N + " " + l.$.N
                          );
                        })
                      )
                    )
                  ),
                ];
              }
            })

            .catch((error) => console.log(error));
        });
      })
      .catch((error) => console.log(error));
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);

  // FETCH DATABASE GAME RESULTS
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-database-results`)
        .then((res) => {
          const groupByDate = res.data.databaseResults.reduce(
            (acc: any, obj: any) => {
              const key = new Date(obj.date_played).getDate(); // Grouping based on age
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
            },
            {}
          );

          const groupedArray = Object.values(groupByDate);

          setGroupedGame(groupedArray);
        })
        .catch((error) => console.log(error));
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" col-12 d-flex flex-wrap justify-content-center">
      <div className="page-heading col-10 d-flex justify-content-between mb-4 p-4">
        <h4>Fixture</h4>
        <div
          className="days col-4 d-flex justify-content-between align-items-center"
          style={{ maxHeight: "30px" }}
        >
          <button className="btn btn-info" onClick={() => refreshGameIDs()}>
            Refresh results
          </button>
        </div>

        <div
          className="days col-4 d-flex justify-content-between align-items-center"
          style={{ maxHeight: "30px" }}
        >
          <button className="btn btn-secondary" onClick={handlePrint}>
            Print results
          </button>
        </div>

        <details
          className="position-relative  bg-dark px-3 py-1"
          style={{ width: "fit-content" }}
        >
          <summary>
            <span>
              {currentUserName} {<MdSettings />}
            </span>
          </summary>
          {/* <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p> */}
          <p
            className="btn btn-secondary px-2 py-2 col-12"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>
      <div
        ref={componentRef}
        className="text-center pt-5 pb-3 mt-5 col-12 d-flex flex-wrap justify-content-center overflow-x-auto px-3"
      >
        <h1 className="col-12 fixture-head">Xma Sports Betting</h1>
        <h1 className="col-12 fixture-head">{groupedGames.length}</h1>

        {
          // groupedGames.length > 0 ? (
          groupedGames.map((gg, index) => {
            const sortedGames = gg.sort(
              (a: any, b: any) => Number(a.game_number) - Number(b.game_number)
            );
            return (
              <table key={index} className="table-bordered my-5 col-12">
                <thead>
                  <tr>
                    <th
                      className="fs-5 py-3 border-bottom-0"
                      key={index}
                      colSpan={11}
                    >
                      {new Date(gg[0].date_played).toDateString()}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={5} className="border-top-0"></th>
                    <th colSpan={2}>FULL TIME</th>
                    <th colSpan={2}>FIRST HALF</th>
                    <th colSpan={2}>SECOND HALF</th>
                    {/* <th colSpan={12} className="border-top-0"></th> */}
                  </tr>
                  <tr>
                    <th rowSpan={2}>No</th>
                    <th rowSpan={2}>Time</th>
                    <th rowSpan={2}>League</th>
                    <th rowSpan={2}>Home Team</th>
                    <th rowSpan={2}>Away Team</th>
                    <th colSpan={1}>Home</th>
                    <th colSpan={1}>Away</th>
                    <th colSpan={1}>Home</th>
                    <th colSpan={1}>Away</th>
                    <th colSpan={1}>Home</th>
                    <th colSpan={1}>Away</th>
                  </tr>
                  {/* <tr>
                  <th>1</th>
                  <th>X</th>
                  <th>2</th>
                  <th>Under</th>
                  <th>Over</th>
                  <th>Under</th>
                  <th>Over</th>
                  <th>1</th>
                  <th>X</th>
                  <th>2</th>
                  <th>Under</th>
                  <th>Over</th>
                  <th>Under</th>
                  <th>Over</th>
                </tr> */}
                </thead>
                <tbody>
                  {sortedGames.map((dbResult: any, index: number) => {
                    return (
                      <ResultsRow
                        key={index}
                        dbResult={dbResult}
                        index={index}
                        // updateReceiptStatus={updateReceiptStatus}
                      />
                    );
                  })}
                </tbody>
              </table>
            );
          })
          // ) : (
          //   <div className="main d-flex justify-content-center align-items-center w-100 h-30">
          //     <ScreenPreloader />
          //   </div>
          // )
        }
      </div>
    </div>
  );
};

export default ResultsTable;
