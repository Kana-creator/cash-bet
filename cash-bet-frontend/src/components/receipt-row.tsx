import React, { useEffect, useState } from "react";
import { ReceiptModule } from "./modules/receipt-module";
import ShopName from "./shop-name";
import CashierName from "./cashier-name";
import { FormatMoney } from "./activities/format-money";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { SelectedGameModule } from "./modules/selected-game-module";

interface Props {
  receipt: ReceiptModule;
  color: string;
  index: number;
  datePlayed: string | null;
  actionDate: string | null;
  status: string;
}

const ReceiptRow: React.FC<Props> = ({
  receipt,
  index,
  color,
  datePlayed,
  actionDate,
  status,
}) => {
  const [gameStatus, setGameStatus] = useState<string[]>([]);

  useEffect(() => {
    // const interval = setInterval(() => {
    axios
      .get(`${AppUrl()}/fetch-results/${receipt.receipt_number}`)
      .then((res) => {
        let game_status: string[] = [];
        res.data.games.forEach((game: SelectedGameModule) => {
          if (game.short_score === "Not started") {
            game_status.push("0");
          } else {
            const scoreArray = game.short_score.split(" ");
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
              game.bet === "FT_1x2: 1" &&
              fullTimeScore[0] > fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "FT_1x2: 1" &&
              fullTimeScore[0] <= fullTimeScore[1]
            ) {
              game_status.push("2");
            } else if (
              game.bet === "FT_1x2: 2" &&
              fullTimeScore[0] < fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "FT_1x2: 2" &&
              fullTimeScore[0] >= fullTimeScore[1]
            ) {
              game_status.push("2");
            } else if (
              game.bet === "1x2_FT: X" &&
              fullTimeScore[0] === fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "1x2_FT: X" &&
              fullTimeScore[0] !== fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // CHECKING GAME RESULTS FOR 1x2 FIRST HALF
            if (game.bet === "1x2_H1: 1" && halfTime[0] > halfTime[1]) {
              game_status.push("1");
            } else if (game.bet === "1x2_H1: 1" && halfTime[0] <= halfTime[1]) {
              game_status.push("2");
            } else if (game.bet === "1x2_H1: 2" && halfTime[0] < halfTime[1]) {
              game_status.push("1");
            } else if (game.bet === "1x2_H1: 2" && halfTime[0] >= halfTime[1]) {
              game_status.push("2");
            } else if (
              game.bet === "1x2_H1: X" &&
              halfTime[0] === halfTime[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "1x2_H1: X" &&
              halfTime[0] !== halfTime[1]
            ) {
              game_status.push("2");
            }

            // CHECKING GAME RESULTS FOR 1X2 SECOND HALF
            if (
              game.bet === "1x2_H2: 1" &&
              secondHalfScore[0] > secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "1x2_H2: 1" &&
              secondHalfScore[0] <= secondHalfScore[1]
            ) {
              game_status.push("2");
            } else if (
              game.bet === "1x2_H2: 2" &&
              secondHalfScore[0] < secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "1x2_H2: 1" &&
              secondHalfScore[0] >= secondHalfScore[1]
            ) {
              game_status.push("2");
            } else if (
              game.bet === "1x2_H2: X" &&
              secondHalfScore[0] === secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "1x2_H2: X" &&
              secondHalfScore[0] !== secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            // OVER/UNDER MARKET
            // CHEKING GAME RESULTS FOR OVER/UNDER FULL TIME
            // UNDER 0.5 FULL TIME
            if (
              game.bet === "Under_0.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) === 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_0.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
            ) {
              game_status.push("2");
            }

            // UNDER 1.5 FULL TIME
            if (
              game.bet === "Under_1.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_1.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
            ) {
              game_status.push("2");
            }

            // UNDER 2.5 FULL TIME
            if (
              game.bet === "Under_2.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_2.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 FULL TIME
            if (
              game.bet === "Under_3.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_3.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
            ) {
              game_status.push("2");
            }

            // UNDER 4.5 FULL TIME
            if (
              game.bet === "Under_4.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_4.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
            ) {
              game_status.push("2");
            }

            // UNDER 5.5 FULLT TIME
            if (
              game.bet === "Under_5.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_5.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
            ) {
              game_status.push("2");
            }

            // OVER 0.5 FULL TIME
            if (
              game.bet === "Over_0.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_0.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) < 1
            ) {
              game_status.push("2");
            }

            // OVER 1.5 FULL TIME
            if (
              game.bet === "Over_1.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 1
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_1.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 1
            ) {
              game_status.push("2");
            }

            // OVER 2.5 FULL TIME
            if (
              game.bet === "Over_2.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 2
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_2.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 2
            ) {
              game_status.push("2");
            }

            // OVER 3.5 FULL TIME
            if (
              game.bet === "Over_3.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 3
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_3.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 3
            ) {
              game_status.push("2");
            }

            // OVER 4.5 FULL TIME
            if (
              game.bet === "Over_4.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 4
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_4.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 4
            ) {
              game_status.push("2");
            }

            // OVER 5.5 FULL TIME
            if (
              game.bet === "Over_5.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) > 5
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_5.5_FT" &&
              Number(fullTimeScore[0]) + Number(fullTimeScore[1]) <= 5
            ) {
              game_status.push("2");
            }

            // CHEKING GAME RESULTS FOR OVER/UNDER FIRST HALF
            // UNDER 0.5 FIRST HALF
            if (
              game.bet === "Under_0.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) === 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_0.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 0
            ) {
              game_status.push("2");
            }

            // UNDER 1.5 FIRST HALF
            if (
              game.bet === "Under_1.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 1
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_1.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 1
            ) {
              game_status.push("2");
            }

            // UNDER 2.5 FIRST HALF
            if (
              game.bet === "Under_2.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 2
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_2.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 2
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 FIRST HALF
            if (
              game.bet === "Under_3.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 3
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_3.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 3
            ) {
              game_status.push("2");
            }

            // UNDER 4.5 FIRST HALF
            if (
              game.bet === "Under_4.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 4
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_4.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 4
            ) {
              game_status.push("2");
            }

            // UNDER 5.5 FIRST HALF
            if (
              game.bet === "Under_5.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 5
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_5.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 5
            ) {
              game_status.push("2");
            }

            // OVER 0.5 FIRST HALF
            if (
              game.bet === "Over_0.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_0.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 0
            ) {
              game_status.push("2");
            }

            // OVER 1.5 FIRST HALF
            if (
              game.bet === "Over_1.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 1
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_1.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 1
            ) {
              game_status.push("2");
            }

            // OVER 2.5 FIRST HALF
            if (
              game.bet === "Over_2.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 2
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_2.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 2
            ) {
              game_status.push("2");
            }

            // OVER 3.5 FIRST HALF
            if (
              game.bet === "Over_3.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 3
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_3.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 3
            ) {
              game_status.push("2");
            }

            // OVER 4.5 FIRST HALF
            if (
              game.bet === "Over_4.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 4
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_4.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 4
            ) {
              game_status.push("2");
            }

            // OVER 5.5 FIRST HALF
            if (
              game.bet === "Over_5.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) > 5
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_5.5_H1" &&
              Number(halfTime[0]) + Number(halfTime[1]) <= 5
            ) {
              game_status.push("2");
            }

            // OVER/UNDER SECOND HALF
            // UNDER 0.5 SECOND HALF
            if (
              game.bet === "Under_0.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_0.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 0
            ) {
              game_status.push("2");
            }

            // UNDER 1.5 SECOND HALF
            if (
              game.bet === "Under_1.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 1
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_1.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 1
            ) {
              game_status.push("2");
            }

            // UNDER 2.5 SECOND HALF
            if (
              game.bet === "Under_2.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 2
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_2.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 2
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 SECOND HALF
            if (
              game.bet === "Under_3.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 3
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_3.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 3
            ) {
              game_status.push("2");
            }

            // UNDER 4.5 SECOND HALF
            if (
              game.bet === "Under_4.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 4
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_4.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 4
            ) {
              game_status.push("2");
            }

            // UNDER 5.5 SECOND HALF
            if (
              game.bet === "Under_5.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 5
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Under_5.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 5
            ) {
              game_status.push("2");
            }

            // OVER 0.5 SECOND HALF
            if (
              game.bet === "Over_0.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_0.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 0
            ) {
              game_status.push("2");
            }

            // OVER 1.5 SECOND HALF
            if (
              game.bet === "Over_1.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 1
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_1.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 1
            ) {
              game_status.push("2");
            }

            // OVER 2.5 SECOND HALF
            if (
              game.bet === "Over_2.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 2
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_2.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 2
            ) {
              game_status.push("2");
            }

            // OVER 3.5 SECOND HALF
            if (
              game.bet === "Over_3.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 3
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_3.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 3
            ) {
              game_status.push("2");
            }

            // OVER 4.5 SECOND HALF
            if (
              game.bet === "Over_4.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 4
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_4.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 4
            ) {
              game_status.push("2");
            }

            // OVER 5.5 SECOND HALF
            if (
              game.bet === "Over_5.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] > 5
            ) {
              game_status.push("1");
            } else if (
              game.bet === "Over_5.5_H2" &&
              secondHalfScore[0] + secondHalfScore[1] <= 5
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME MARKET
            //CHECKING GAME RESULTS FOR HALFTIME/FULLTIME
            // HALFTIME/FULLTIME T1/T1
            if (
              game.bet === "HTFT_1/1" &&
              halfTime[0] > halfTime[1] &&
              fullTimeScore[0] > fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "HTFT_1/1" &&
              halfTime[0] <= halfTime[1] &&
              fullTimeScore[0] <= fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME T1/X
            if (
              game.bet === "HTFT_1/X" &&
              halfTime[0] > halfTime[1] &&
              fullTimeScore[0] === fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "HTFT_1/X" && halfTime[0] <= halfTime[1]) ||
              (game.bet === "HTFT_1/X" && fullTimeScore[0] !== fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME T1/T2
            if (
              game.bet === "HTFT_1/2" &&
              halfTime[0] > halfTime[1] &&
              fullTimeScore[0] < fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "HTFT_1/2" &&
              halfTime[0] <= halfTime[1] &&
              fullTimeScore[0] >= fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME X/T1
            if (
              game.bet === "HTFT_X/1" &&
              halfTime[0] === halfTime[1] &&
              fullTimeScore[0] > fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "HTFT_X/1" && halfTime[0] !== halfTime[1]) ||
              (game.bet === "HTFT_X/1" && fullTimeScore[0] >= fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME X/X
            if (
              game.bet === "HTFT_X/X" &&
              halfTime[0] === halfTime[1] &&
              fullTimeScore[0] === fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "HTFT_X/X" && halfTime[0] !== halfTime[1]) ||
              (game.bet === "HTFT_X/X" && fullTimeScore[0] !== fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME X/T2
            if (
              game.bet === "HTFT_X/2" &&
              halfTime[0] === halfTime[1] &&
              fullTimeScore[0] < fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "HTFT_X/2" && halfTime[0] !== halfTime[1]) ||
              (game.bet === "HTFT_X/2" && fullTimeScore[0] >= fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME T2/T1
            if (
              game.bet === "HTFT_2/1" &&
              halfTime[0] < halfTime[1] &&
              fullTimeScore[0] > fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "HTFT_2/1" && halfTime[0] >= halfTime[1]) ||
              (game.bet === "HTFT_2/1" && fullTimeScore[0] <= fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME T2/X
            if (
              game.bet === "HTFT_2/X" &&
              halfTime[0] < halfTime[1] &&
              fullTimeScore[0] === fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "HTFT_2/X" && halfTime[0] >= halfTime[1]) ||
              (game.bet === "HTFT_2/X" && fullTimeScore[0] !== fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // HALFTIME/FULLTIME T2/T2
            if (
              game.bet === "HTFT_2/2" &&
              halfTime[0] < halfTime[1] &&
              fullTimeScore[0] < fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "HTFT_2/2" &&
              halfTime[0] >= halfTime[1] &&
              fullTimeScore[0] >= fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // DOUBLE CHANCE MARKET
            // CHECKING GAME RESULTS FOR DOUBLE CHANCE FULL TIME
            // DOUBLE CHANCE T1/X FULL TIME

            if (
              game.bet === "DC_T1/X" &&
              fullTimeScore[0] >= fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DC_T1/X" &&
              fullTimeScore[0] < fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // DOUBLE CHANCE T1/T2 FULL TIME
            if (
              game.bet === "DC_T1/T2" &&
              fullTimeScore[0] !== fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DC_T1/T2" &&
              fullTimeScore[0] === fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // DOUBLE CHANCE X/T2 FULL TIME
            if (
              game.bet === "DC_X/T2" &&
              fullTimeScore[0] <= fullTimeScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DC_X/T2" &&
              fullTimeScore[0] > fullTimeScore[1]
            ) {
              game_status.push("2");
            }

            // CHECKING GAME RESULTS FOR DOUBLE CHANCE FIRST HALF
            // DOUBLE CHANCE T1/X FIRST HALF
            if (game.bet === "DC_T1/X_H1" && halfTime[0] >= halfTime[1]) {
              game_status.push("1");
            } else if (game.bet === "DC_T1/X_H1" && halfTime[0] < halfTime[1]) {
              game_status.push("2");
            }

            // DOUBLE CHANCE T1/T2 FIRST HALF
            if (game.bet === "DC_T1/T2_H1" && halfTime[0] !== halfTime[1]) {
              game_status.push("1");
            } else if (
              game.bet === "DC_T1/T2_H1" &&
              halfTime[0] === halfTime[1]
            ) {
              game_status.push("2");
            }

            // DOUBLE CHANCE X/T2 FIRST HALF
            if (game.bet === "DC_X/T2_H1" && halfTime[0] <= halfTime[1]) {
              game_status.push("1");
            } else if (game.bet === "DC_X/T2_H1" && halfTime[0] > halfTime[1]) {
              game_status.push("2");
            }

            // CHECKING FOR GAME RESULTS DOUBLE CHANCE SECOND HALF
            // DOUBLE CHANCE T1/T1 SECOND HALF
            if (
              game.bet === "DC_T1/X_H2" &&
              secondHalfScore[0] >= secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DC_T1/X_H2" &&
              secondHalfScore[0] < secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            // DOUBLE CHANCE T1/T2 SECOND HALF
            if (
              game.bet === "DC_T1/T2_H2" &&
              secondHalfScore[0] !== secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DC_T1/T2_H2" &&
              secondHalfScore[0] === secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            // DOUBLE CHANCE X/T2 SECOND HALF
            if (
              game.bet === "DC_X/T2_H2" &&
              secondHalfScore[0] <= secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DC_X/T2_H2" &&
              secondHalfScore[0] > secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            //HIGHEST SCORING HALF MARKET
            // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF FULL TIME
            // HIGHEST SCORING HALF FIRST HALF
            if (
              game.bet === "HSH_H1" &&
              halfTime[0] + halfTime[1] >
                secondHalfScore[0] + secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "HSH_H1" &&
              halfTime[0] + halfTime[1] <=
                secondHalfScore[0] + secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            // CHECKING FOR GAME RESULT HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
            // HIGHEST SCORING HALF EQUAL NUMBER OF GOALS
            if (
              game.bet === "HSH_H1" &&
              halfTime[0] + halfTime[1] ===
                secondHalfScore[0] + secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "HSH_H1" &&
              halfTime[0] + halfTime[1] !==
                secondHalfScore[0] + secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            // CHECKING FOR GAME RESULTS HIGHEST SCORING HALF SECOND HALF
            // HIGHEST SCORING HALF SECOND HALF
            if (
              game.bet === "HSH_H1" &&
              halfTime[0] + halfTime[1] <
                secondHalfScore[0] + secondHalfScore[1]
            ) {
              game_status.push("1");
            } else if (
              game.bet === "HSH_H1" &&
              halfTime[0] + halfTime[1] >=
                secondHalfScore[0] + secondHalfScore[1]
            ) {
              game_status.push("2");
            }

            // BOTH TEAMS TO SCORE MARKET
            //CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE FULL TIME
            // BOTH TEAMS TO SCORE YES FULL TIME
            if (
              game.bet === "BTS_YES" &&
              Number(fullTimeScore[0]) > 0 &&
              Number(fullTimeScore[1]) > 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "BTS_YES" && Number(fullTimeScore[0]) === 0) ||
              (game.bet === "BTS_YES" && Number(fullTimeScore[1]) === 0)
            ) {
              game_status.push("2");
            }

            // BOTH TEAMS TO SCORE NO FULL TIME
            if (
              game.bet === "BTS_NO" &&
              Number(fullTimeScore[0]) === 0 &&
              Number(fullTimeScore[1]) === 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "BTS_NO" && Number(fullTimeScore[0]) === 0) ||
              (game.bet === "BTS_NO" && Number(fullTimeScore[1]) === 0)
            ) {
              game_status.push("1");
            } else if (
              game.bet === "BTS_NO" &&
              Number(fullTimeScore[0]) > 0 &&
              Number(fullTimeScore[1]) > 0
            ) {
              game_status.push("2");
            }

            // CHECKING FOR GAME RESULTS BOTH TEAMS TO SCORE FIRST HALF
            // BOTH TEAMS TO SCORE YES FIRST HALF
            if (
              game.bet === "BTS_YES_H1" &&
              Number(halfTime[0]) > 0 &&
              Number(halfTime[1]) > 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "BTS_YES_H1" && Number(halfTime[0]) === 0) ||
              (game.bet === "BTS_YES_H1" && Number(halfTime[1]) === 0)
            ) {
              game_status.push("2");
            }

            // BOTH TEAMS TO SCORE NO FIRST HALF
            if (
              game.bet === "BTS_NO_H1" &&
              Number(halfTime[0]) === 0 &&
              Number(halfTime[1]) === 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "BTS_NO_H1" && Number(halfTime[0]) === 0) ||
              (game.bet === "BTS_NO_H1" && Number(halfTime[1]) === 0)
            ) {
              game_status.push("1");
            } else if (
              game.bet === "BTS_NO_H1" &&
              Number(halfTime[0]) > 0 &&
              Number(halfTime[1]) > 0
            ) {
              game_status.push("2");
            }

            // CHECKING GAME RESULTS FOR BOTH TEAMS TO SCORE SECOND HALF
            // BOTH TEAMS TO SCORE YES SECOND HALF
            if (
              game.bet === "BTS_YES_H2" &&
              Number(secondHalfScore[0]) > 0 &&
              Number(secondHalfScore[1]) > 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "BTS_YES_H2" && Number(secondHalfScore[0]) === 0) ||
              (game.bet === "BTS_YES_H2" && Number(secondHalfScore[1]) === 0)
            ) {
              game_status.push("2");
            }

            // BOTH TEAMS TO SCORE NO SECOND HALF
            if (
              game.bet === "BTS_NO_H2" &&
              Number(secondHalfScore[0]) === 0 &&
              Number(secondHalfScore[1]) === 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "BTS_NO_H2" && Number(secondHalfScore[0]) === 0) ||
              (game.bet === "BTS_NO_H2" && Number(secondHalfScore[1]) === 0)
            ) {
              game_status.push("1");
            } else if (
              game.bet === "BTS_NO_H2" &&
              Number(secondHalfScore[0]) > 0 &&
              Number(secondHalfScore[1]) > 0
            ) {
              game_status.push("2");
            }

            // ODD EVEN MARKET
            // CHECKING GAME RESULTS FOR ODD EVEN FULL TIME
            // ODD FULL TIME
            if (
              game.bet === "OE_ODD_FT" &&
              Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "OE_ODD_FT" &&
              Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
            ) {
              game_status.push("2");
            }

            // EVEN FULL TIME
            if (
              game.bet === "OE_EVEN_FT" &&
              Number(fullTimeScore[0] + fullTimeScore[1]) % 2 === 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "OE_EVEN_FT" &&
              Number(fullTimeScore[0] + fullTimeScore[1]) % 2 !== 0
            ) {
              game_status.push("2");
            }

            // CHECKING ODD EVEN RESULTS FIRST HALF
            // ODD HALF TIME
            if (
              game.bet === "OE_ODD_H1" &&
              Number(halfTime[0] + halfTime[1]) % 2 !== 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "OE_ODD_H1" &&
              Number(halfTime[0] + halfTime[1]) % 2 === 0
            ) {
              game_status.push("2");
            }

            // EVEN HALF TIME
            if (
              game.bet === "OE_EVEN_H1" &&
              Number(halfTime[0] + halfTime[1]) % 2 === 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "OE_EVEN_H1" &&
              Number(halfTime[0] + halfTime[1]) % 2 !== 0
            ) {
              game_status.push("2");
            }

            // CHECKING ODD EVEN RESULTS FOR SECOND HALF
            // ODD SECOND HALF
            if (
              game.bet === "OE_ODD_H2" &&
              Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "OE_ODD_H2" &&
              Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
            ) {
              game_status.push("2");
            }

            // EVEN SECOND HALF
            if (
              game.bet === "OE_EVEN_H2" &&
              Number(secondHalfScore[0] + secondHalfScore[1]) % 2 === 0
            ) {
              game_status.push("1");
            } else if (
              game.bet === "OE_EVEN_H2" &&
              Number(secondHalfScore[0] + secondHalfScore[1]) % 2 !== 0
            ) {
              game_status.push("2");
            }

            // 1x2 AND OVER/UNDER MARKET
            // CHECKING GAME RESULTS FOR 1X2 AND OVER/UNDER FULL TIME
            // OVER/UNDER T1 FULL TIME
            // OVER 0.5 T1 FULLTIME
            if (game.bet === "Over_0.5_T1" && Number(fullTimeScore[0]) >= 1) {
              game_status.push("1");
            } else if (
              game.bet === "Over_0.5_T1" &&
              Number(fullTimeScore[0]) < 1
            ) {
              game_status.push("2");
            }

            // UNDER 0.5 T1 FULL TIME
            if (game.bet === "Under_0.5_T1" && Number(fullTimeScore[0]) <= 0) {
              game_status.push("1");
            } else if (
              game.bet === "Under_0.5_T1" &&
              Number(fullTimeScore[0]) > 0
            ) {
              game_status.push("2");
            }

            // OVER 1.5 T1 FULL TIME
            if (game.bet === "Over_1.5_T1" && Number(fullTimeScore[0]) >= 2) {
              game_status.push("1");
            } else if (
              game.bet === "Over_1.5_T1" &&
              Number(fullTimeScore[0]) < 2
            ) {
              game_status.push("2");
            }

            // UNDER 1.5 T1 FULL TIME
            if (game.bet === "Under_1.5_T1" && Number(fullTimeScore[0]) <= 1) {
              game_status.push("1");
            } else if (
              game.bet === "Under_1.5_T1" &&
              Number(fullTimeScore[0]) > 1
            ) {
              game_status.push("2");
            }

            // OVER 2.5 T1 FULL TIME
            if (game.bet === "Over_2.5_T1" && Number(fullTimeScore[0]) >= 3) {
              game_status.push("1");
            } else if (
              game.bet === "Over_2.5_T1" &&
              Number(fullTimeScore[0]) < 3
            ) {
              game_status.push("2");
            }

            // UNDER 2.5 T1 FULL TIME
            if (game.bet === "Under_2.5_T1" && Number(fullTimeScore[0]) <= 2) {
              game_status.push("1");
            } else if (
              game.bet === "Under_2.5_T1" &&
              Number(fullTimeScore[0]) > 2
            ) {
              game_status.push("2");
            }

            // OVER 3.5 T1 FULL TIME
            if (game.bet === "Over_3.5_T1" && Number(fullTimeScore[0]) >= 4) {
              game_status.push("1");
            } else if (
              game.bet === "Over_3.5_T1" &&
              Number(fullTimeScore[0]) < 4
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 T1 FULL TIME
            if (game.bet === "Under_3.5_T1" && Number(fullTimeScore[0]) <= 3) {
              game_status.push("1");
            } else if (
              game.bet === "Under_3.5_T1" &&
              Number(fullTimeScore[0]) > 3
            ) {
              game_status.push("2");
            }

            // OVER 4.5 T1 FULL TIME
            if (game.bet === "Over_4.5_T1" && Number(fullTimeScore[0]) >= 5) {
              game_status.push("1");
            } else if (
              game.bet === "Over_4.5_T1" &&
              Number(fullTimeScore[0]) < 5
            ) {
              game_status.push("2");
            }

            // UNDER 4.5 T1 FULL TIME
            if (game.bet === "Under_4.5_T1" && Number(fullTimeScore[0]) <= 4) {
              game_status.push("1");
            } else if (
              game.bet === "Under_4.5_T1" &&
              Number(fullTimeScore[0]) > 4
            ) {
              game_status.push("2");
            }

            // OVER 5.5 T1 FULL TIME
            if (game.bet === "Over_5.5_T1" && Number(fullTimeScore[0]) >= 6) {
              game_status.push("1");
            } else if (
              game.bet === "Over_5.5_T1" &&
              Number(fullTimeScore[0]) < 6
            ) {
              game_status.push("2");
            }

            // UNDER 5.5 T1 FULL TIME
            if (game.bet === "Under_5.5_T1" && Number(fullTimeScore[0]) <= 5) {
              game_status.push("1");
            } else if (
              game.bet === "Under_5.5_T1" &&
              Number(fullTimeScore[0]) > 5
            ) {
              game_status.push("2");
            }

            // OVER/UNDER T2 FULL TIME
            // OVER 0.5 T2 FULL TIME
            if (game.bet === "Over_0.5_T2" && Number(fullTimeScore[1]) >= 1) {
              game_status.push("1");
            } else if (
              game.bet === "Over_0.5_T2" &&
              Number(fullTimeScore[1]) < 1
            ) {
              game_status.push("2");
            }

            // UNDER 0.5 T2 FULL TIME
            if (game.bet === "Under_0.5_T2" && Number(fullTimeScore[1]) < 1) {
              game_status.push("1");
            } else if (
              game.bet === "Under_0.5_T2" &&
              Number(fullTimeScore[1]) >= 1
            ) {
              game_status.push("2");
            }

            // OVER 1.5 T2 FULL TIME
            if (game.bet === "Over_1.5_T2" && Number(fullTimeScore[1]) > 1) {
              game_status.push("1");
            } else if (
              game.bet === "Over_1.5_T2" &&
              Number(fullTimeScore[1]) <= 1
            ) {
              game_status.push("2");
            }

            // UNDER 1.5 T2 FULL TIME
            if (game.bet === "Under_1.5_T2" && Number(fullTimeScore[1]) <= 1) {
              game_status.push("1");
            } else if (
              game.bet === "Under_1.5_T2" &&
              Number(fullTimeScore[1]) > 1
            ) {
              game_status.push("2");
            }

            //  OVER 2.5 T2 FULL TIME
            if (game.bet === "Over_2.5_T2" && Number(fullTimeScore[1]) > 2) {
              game_status.push("1");
            } else if (
              game.bet === "Over_2.5_T2" &&
              Number(fullTimeScore[1]) <= 2
            ) {
              game_status.push("2");
            }

            // UNDER 2.5 T2 FULL TIME
            if (game.bet === "Under_2.5_T2" && Number(fullTimeScore[1]) <= 2) {
              game_status.push("1");
            } else if (
              game.bet === "Under_2.5_T2" &&
              Number(fullTimeScore[1]) > 2
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 T2 FULL TIME
            if (game.bet === "Over_3.5_T2" && Number(fullTimeScore[1]) > 3) {
              game_status.push("1");
            } else if (
              game.bet === "Over_3.5_T2" &&
              Number(fullTimeScore[1]) <= 3
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 T2 FULL TIME
            if (game.bet === "Under_3.5_T2" && Number(fullTimeScore[1]) <= 3) {
              game_status.push("1");
            } else if (
              game.bet === "Under_3.5_T2" &&
              Number(fullTimeScore[1]) > 3
            ) {
              game_status.push("2");
            }

            // OVER 4.5 T2 FULL TIME
            if (game.bet === "Over_4.5_T2" && Number(fullTimeScore[1]) > 4) {
              game_status.push("1");
            } else if (
              game.bet === "Over_4.5_T2" &&
              Number(fullTimeScore[1]) <= 4
            ) {
              game_status.push("2");
            }

            // UNDER 4.5 T2 FULL TIME
            if (game.bet === "Under_4.5_T2" && Number(fullTimeScore[1]) <= 4) {
              game_status.push("1");
            } else if (
              game.bet === "Under_4.5_T2" &&
              Number(fullTimeScore[1]) < 4
            ) {
              game_status.push("2");
            }

            // OVER 5.5 T2 FULL TIME
            if (game.bet === "Over_5.5_T2" && Number(fullTimeScore[1]) >= 6) {
              game_status.push("1");
            } else if (
              game.bet === "Over_0.5_T2" &&
              Number(fullTimeScore[1]) < 6
            ) {
              game_status.push("2");
            }

            // UNDER 5.5 T2 FULL TIME
            if (game.bet === "Under_5.5_T2" && Number(fullTimeScore[1]) <= 5) {
              game_status.push("1");
            } else if (
              game.bet === "Under_5.5_T2" &&
              Number(fullTimeScore[1]) > 5
            ) {
              game_status.push("2");
            }

            // OVER/UNDER X FULL TIME
            // OVER 0.5 X FULL TIME
            if (
              game.bet === "Over_0.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) > 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Over_0.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_0.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 0)
            ) {
              game_status.push("2");
            }

            // UNDER 0.5 X FULL TIME
            if (
              game.bet === "Under_0.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) <= 0
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Under_0.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_0.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 0)
            ) {
              game_status.push("2");
            }

            // OVER 1.5 X FULL TIME
            if (
              game.bet === "Over_1.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) > 1
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Over_1.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_1.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 1)
            ) {
              game_status.push("2");
            }

            // UNDER 1.5 X FULL TIME
            if (
              game.bet === "Under_1.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) <= 1
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Under_1.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Under_1.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 1)
            ) {
              game_status.push("2");
            }

            // OVER 2.5 X FULL
            if (
              game.bet === "Over_2.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) > 2
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Over_2.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_2.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 2)
            ) {
              game_status.push("2");
            }

            // UNDER 2.5 X FULL TIME
            if (
              game.bet === "Under_2.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) <= 2
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Under_2.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Under_2.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 2)
            ) {
              game_status.push("2");
            }

            // OVER 3.5 X FULL TIME
            if (
              game.bet === "Over_3.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) > 3
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Over_3.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_3.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 3)
            ) {
              game_status.push("2");
            }

            // UNDER 3.5 X FULL TIME
            if (
              game.bet === "Under_3.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) <= 3
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Under_3.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Under_3.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 3)
            ) {
              game_status.push("2");
            }

            // OVER 4.5 X FULL TIME
            if (
              game.bet === "Over_4.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) > 4
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Over_4.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_4.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 4)
            ) {
              game_status.push("2");
            }

            // UNDER 4.5 X FULL TIME
            if (
              game.bet === "Under_4.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) <= 4
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Under_4.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Under_4.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 4)
            ) {
              game_status.push("2");
            }

            // OVER 5.5 X FULL TIME
            if (
              game.bet === "Over_5.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) > 5
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Over_5.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Over_5.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) <= 5)
            ) {
              game_status.push("2");
            }

            // UNDER 5.5 X FULL TIME
            if (
              game.bet === "Under_5.5_X" &&
              Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) <= 5
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "Under_5.5_X" &&
                Number(fullTimeScore[0]) !== Number(fullTimeScore[1])) ||
              (game.bet === "Under_5.5_X" &&
                Number(fullTimeScore[0]) === Number(fullTimeScore[1]) &&
                Number(fullTimeScore[0]) > 5)
            ) {
              game_status.push("2");
            }

            // DRAW NO BET MARKET
            // DRAW NO BET T1 FULL TIME
            if (
              game.bet === "DNB_T1" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1])
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DNB_T1" &&
              Number(fullTimeScore[0]) <= Number(fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // DRAW NO BET T2
            if (
              game.bet === "DNB_T2" &&
              Number(fullTimeScore[0]) < Number(fullTimeScore[1])
            ) {
              game_status.push("1");
            } else if (
              game.bet === "DNB_T2" &&
              Number(fullTimeScore[0]) >= Number(fullTimeScore[1])
            ) {
              game_status.push("2");
            }

            // EUROPEAN HANDICAP MARKET
            // CHECKING GAME RESULTS FOR EH -5
            // EH -5 T1

            if (
              game.bet === "EH_5.0_T1" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_5.0_T1" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_5.0_T1" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
            ) {
              game_status.push("2");
            }

            // EH -5 T2
            if (
              game.bet === "EH_5.0_T2" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_5.0_T2" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_5.0_T2" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
            ) {
              game_status.push("2");
            }

            // EH -4 T1
            if (
              game.bet === "EH_4.0_T1" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_4.0_T1" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_4.0_T1" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
            ) {
              game_status.push("2");
            }

            // EH -4 T2
            if (
              game.bet === "EH_4.0_T2" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_4.0_T2" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_4.0_T2" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
            ) {
              game_status.push("2");
            }

            // EH -3 T1
            if (
              game.bet === "EH_3.0_T1" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_3.0_T1" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_3.0_T1" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
            ) {
              game_status.push("2");
            }

            // EH -3 T2
            if (
              game.bet === "EH_3.0_T2" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_3.0_T2" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_3.0_T2" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
            ) {
              game_status.push("2");
            }

            // EH -2 T1
            if (
              game.bet === "EH_2.0_T1" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_2.0_T1" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_2.0_T1" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) <= 3)
            ) {
              game_status.push("2");
            }

            // EH -2 T2
            if (
              game.bet === "EH_2.0_T2" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_2.0_T2" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_2.0_T2" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
            ) {
              game_status.push("2");
            }

            // EH -1 T1
            if (
              game.bet === "EH_1.0_T1" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_1.0_T1" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_1.0_T1" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
            ) {
              game_status.push("2");
            }

            // EH -1 T2
            if (
              game.bet === "EH_1.0_T2" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_1.0_T2" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_1.0_T2" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
            ) {
              game_status.push("2");
            }

            // EH 1 T1
            if (
              game.bet === "EH_0.1_T1" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 2
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.1_T1" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_0.1_T1" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 2)
            ) {
              game_status.push("2");
            }

            // EH 1 T2
            if (
              game.bet === "EH_0.1_T2" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 2
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.1_T2" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_0.1_T2" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 2)
            ) {
              game_status.push("2");
            }

            // EH 2 T1
            if (
              game.bet === "EH_0.2_T1" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 3
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.2_T1" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_0.2_T1" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 3)
            ) {
              game_status.push("2");
            }

            // EH 2 T2
            if (
              game.bet === "EH_0.2_T2" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 3
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.2_T2" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_0.2_T2" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 3)
            ) {
              game_status.push("2");
            }

            // EH 3 T1
            if (
              game.bet === "EH_0.3_T1" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 4
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.3_T1" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_0.3_T1" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 4)
            ) {
              game_status.push("2");
            }

            // EH 3 T2
            if (
              game.bet === "EH_0.3_T2" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 4
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.3_T2" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_0.3_T2" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 4)
            ) {
              game_status.push("2");
            }

            // EH 4 T1
            if (
              game.bet === "EH_0.4_T1" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 5
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.4_T1" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_0.4_T1" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 5)
            ) {
              game_status.push("2");
            }

            // EH 4 T2
            if (
              game.bet === "EH_0.4_T2" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 5
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.4_T2" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_0.4_T2" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 5)
            ) {
              game_status.push("2");
            }

            // EH 5 T1
            if (
              game.bet === "EH_0.5_T1" &&
              Number(fullTimeScore[0]) > Number(fullTimeScore[1]) &&
              Number(fullTimeScore[0]) - Number(fullTimeScore[1]) >= 6
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.5_T1" &&
                Number(fullTimeScore[0]) <= Number(fullTimeScore[1])) ||
              (game.bet === "EH_0.5_T1" &&
                Number(fullTimeScore[0]) - Number(fullTimeScore[1]) < 6)
            ) {
              game_status.push("2");
            }

            // EH 5 T2
            if (
              game.bet === "EH_0.5_T2" &&
              Number(fullTimeScore[1]) > Number(fullTimeScore[0]) &&
              Number(fullTimeScore[1]) - Number(fullTimeScore[0]) >= 6
            ) {
              game_status.push("1");
            } else if (
              (game.bet === "EH_0.5_T2" &&
                Number(fullTimeScore[1]) <= Number(fullTimeScore[0])) ||
              (game.bet === "EH_0.5_T2" &&
                Number(fullTimeScore[1]) - Number(fullTimeScore[0]) < 6)
            ) {
              game_status.push("2");
            }
          }
        });
        setGameStatus(game_status);
      })
      .catch((error) => console.log(error));
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let receipt_status = 0;

    if (gameStatus.includes("0") && !gameStatus.includes("2")) {
      receipt_status = 0;
    } else if (gameStatus.includes("2")) {
      receipt_status = 2;
    } else if (
      gameStatus.includes("1") &&
      !gameStatus.includes("2") &&
      !gameStatus.includes("0")
    ) {
      receipt_status = 1;
    }

    axios
      .put(
        `${AppUrl()}/change-receipt-status/${receipt_status}/${
          receipt.receipt_number
        }`
      )
      .then((res) => {})
      .catch((error) => console.log(error));
  }, [gameStatus]);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{receipt.receipt_number}</td>
      <td>
        {receipt.date_added
          ? new Date(receipt.date_added).toDateString() + ", " + datePlayed
          : "NA"}
      </td>
      <td>{receipt.shop_id}</td>
      <ShopName shopId={receipt.shop_id} />
      <td>{receipt.cashier_id}</td>
      <CashierName cashierId={receipt.cashier_id} />
      <td>{FormatMoney(receipt.stake, 0)}</td>
      <td>{receipt.total_odds}</td>
      <td>{FormatMoney(receipt.possible_win, 0)}</td>
      <td>0</td>
      <td>
        {FormatMoney(
          receipt.receipt_status === 4 ? receipt.possible_win : 0,
          0
        )}
      </td>
      <td className={`${color}`}>{status}</td>
      <td>
        {receipt.action_date
          ? new Date(receipt.action_date).toDateString() + ", " + actionDate
          : "NA"}
      </td>
    </tr>
  );
};

export default ReceiptRow;
