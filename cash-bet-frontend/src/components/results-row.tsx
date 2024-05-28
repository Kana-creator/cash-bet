import React, { useState } from "react";
import { EventModule } from "./modules/event-module";
import { SelectedGameModule } from "./modules/selected-game-module";

interface Props {
  dbResult: any;
  index: number;
  // updateReceiptStatus: (
  //   receipt_number: number,
  //   game_status: string[],
  //   receipt_status: string
  // ) => any;
}
const ResultsRow: React.FC<Props> = ({
  dbResult,
  index,
  // updateReceiptStatus,
}) => {
  const scoreArray = dbResult.short_score.split(" ");
  const fullTimeScore = scoreArray[0].split(":");
  const HalfTimeScore = scoreArray[1].split("");
  const halfTime: any = HalfTimeScore.filter(
    (hts: any) => hts !== "(" && hts !== ")" && hts !== ":"
  );

  const seconHalfT1: number = Number(fullTimeScore[0]) - Number(halfTime[0]);
  const seconHalfT2: number = Number(fullTimeScore[1]) - Number(halfTime[1]);
  const secondHalfScore = [seconHalfT1, seconHalfT2];

  const dateString = dbResult.date_played;
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

  return (
    <tr>
      <td>{dbResult.game_number}</td>
      <td>{hours + ":" + minutes + " " + AmPm}</td>
      <td>{dbResult.league}</td>
      <td>{dbResult.home}</td>
      <td>{dbResult.away}</td>
      <td>{fullTimeScore[0]}</td>
      <td>{fullTimeScore[1]}</td>
      <td>{halfTime[0]}</td>
      <td>{halfTime[1]}</td>
      <td>{secondHalfScore[0]}</td>
      <td>{secondHalfScore[1]}</td>
    </tr>
  );
};

export default ResultsRow;
