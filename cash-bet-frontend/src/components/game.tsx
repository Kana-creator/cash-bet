import React, { useEffect, useState } from "react";
import { GameModule } from "./modules/game-module";
import ButtonText from "./buttons/button-text";
import { SelectedGameModule } from "./modules/selected-game-module";
import { GameNumber } from "./modules/game_number_module";

interface Props {
  game: GameModule;
  selectedGame: SelectedGameModule;
  setSelectedGame: React.Dispatch<React.SetStateAction<SelectedGameModule>>;
  receiptGames: SelectedGameModule[];
  setReceiptGames: React.Dispatch<React.SetStateAction<SelectedGameModule[]>>;
  setShowGameDetails: React.Dispatch<React.SetStateAction<boolean>>;
  // setOdds: React.Dispatch<React.SetStateAction<number[]>>;
  odds: number[];
  setCurrentGame: React.Dispatch<React.SetStateAction<GameModule[]>>;
  game_index: number;
  eventNumbers: GameNumber[];
}

const Game: React.FC<Props> = ({
  game,
  setShowGameDetails,
  setCurrentGame,
  eventNumbers,
}) => {
  const [ids, setIds] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // setTimeout(() => {
    eventNumbers && eventNumbers.length > 0
      ? eventNumbers.forEach((eventNumber: GameNumber) => {
          if (eventNumber.event_number === Number(game.event.I)) {
            setIds([eventNumber.id]);
          }
        })
      : setIds([]);

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

    setTime(hours + ":" + minutes + " " + AmPm);
    setDates(date1);
    // const time = date1[1].slice(0, 4);
    // }, 1000);
  }, [eventNumbers]);

  return (
    <div className="game px-4 py-2 col-11 d-flex align-items-center justify-content-start position-relative">
      <h4>{ids[0]}</h4>
      <div className="px-4">
        <div className="d-flex align-items-center">
          <h5>{game.league_name} : </h5>
          <h6> {game.event.T1 + " Vs " + game.event.T2}</h6>
        </div>
        <p>Date: {new Date(dates[0]).toDateString()}</p>
        <p>Time: {time}</p>
      </div>

      <div className="position-absolute end-0">
        <ButtonText
          value="Add"
          className="form-group my-4 px-4"
          id="signin__button"
          action={(e: React.FormEvent) => {
            e.preventDefault();
            setShowGameDetails(true);
            setCurrentGame([game]);
          }}
        />
      </div>
    </div>
  );
};

export default Game;
