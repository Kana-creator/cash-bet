import React, { useEffect, useState } from "react";
import Game from "./game";
import { GameModule } from "./modules/game-module";
import TextField from "./form-fields/text-field";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import ScreenPreloader from "./screen-preloader";
import { SelectedGameModule } from "./modules/selected-game-module";
import { GameNumber } from "./modules/game_number_module";

interface Props {
  receiptGames: SelectedGameModule[];
  setReceiptGames: React.Dispatch<React.SetStateAction<SelectedGameModule[]>>;
  setShowGameDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setManagerCreditBalance: React.Dispatch<React.SetStateAction<number>>;
  setSelectedGame: React.Dispatch<React.SetStateAction<SelectedGameModule>>;
  selectedGame: SelectedGameModule;
  // setOdds: React.Dispatch<React.SetStateAction<number[]>>;
  odds: number[];
  games: GameModule[];
  setCurrentGame: React.Dispatch<React.SetStateAction<GameModule[]>>;
  eventNumbers: GameNumber[];
  setEventNumbers: React.Dispatch<React.SetStateAction<GameNumber[]>>;
  loading: boolean;
}

interface User {
  block_status: number;
  date_added: string;
  date_updated: string;
  duty_station: string;
  first_name: string;
  last_name: string;
  linked_to: number;
  login_status: number;
  max_payout: number;
  max_stake: number;
  min_stake: number;
  operator: number;
  sales_limit: number;
  shop_id: number;
  shop_location: string;
  shop_name: string;
  user_email: string;
  user_id: number;
  user_password: string;
  user_role: string;
  user_telephone: string;
}

const Games: React.FC<Props> = ({
  receiptGames,
  setReceiptGames,
  setShowGameDetails,
  setManagerCreditBalance,
  setSelectedGame,
  selectedGame,
  // setOdds,
  odds,
  games,
  setCurrentGame,
  eventNumbers,
  setEventNumbers,
  loading,
}) => {
  const [searchResults, setSearchResults] = useState<GameModule[]>([]);
  const [searches, setSearches] = useState<string>("");
  const [sortedGames, setSortedGames] = useState<GameModule[]>([]);

  const handleSearch = (search: string) => {
    setSearches(search);
    const searchedId: GameNumber[] =
      eventNumbers && eventNumbers.length > 0
        ? eventNumbers.filter((en) => en.id == Number(search))
        : [];

    setSearchResults(
      search.length > 0
        ? games.filter((g) =>
            searchedId.length > 0
              ? g.event.I.toString() == searchedId[0].event_number.toString()
              : []
          )
        : []
    );
  };

  // SAVE EVENT IDS IF THE GAMES LIST CHANGES OR UPDATED.
  useEffect(() => {
    setSortedGames(
      games.sort(
        (a, b) =>
          Number(new Date(a.event.DT).getTime()) -
          Number(new Date(b.event.DT).getTime())
      )
    );

    //   if (games.length > 0) {
    //     axios
    //       .post(`${AppUrl()}/save-event-numbers`, {
    //         event_numbers: games.map((g) => g.event.I),
    //       })
    //       .then()
    //       .catch((error) => console.log(error));
    //   }
  }, []);

  useEffect(() => {
    axios
      .get(`${AppUrl()}/fetch-event-numbers`)
      .then((res) => {
        setEventNumbers(res.data.results);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: User = JSON.parse(user);

    const userToken: string = localStorage.getItem("token") as string;
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-credit-balance/${current_user.user_id}`, {
          headers: { "x-access-token": userToken },
        })
        .then((res) => {
          if (res.data.status === "success") {
            setManagerCreditBalance(res.data.credit_balance.available_credit);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return loading ? (
    <div className="main d-flex justify-content-center align-items-center">
      <ScreenPreloader />
    </div>
  ) : (
    <div className="games-list col-12">
      {/* <h1>{games.length}</h1> */}
      <form
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
        className="col-12 mb-4 justify-content-center"
      >
        <TextField
          span=""
          className="form-group px-4 col-10 "
          label=""
          type="search"
          id="search-game"
          value=""
          autoFocus={true}
          placeholder="Serach for a game"
          onChange={(e: React.FormEvent) => {
            e.preventDefault();
            const search = document.getElementById(
              "search-game"
            ) as HTMLInputElement;
            setSearches(search.value);
            handleSearch(search.value);
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            const search = document.getElementById(
              "search-game"
            ) as HTMLInputElement;
            if (e.key === "Enter") {
              if (search.value.trim().length < 1) {
                document.getElementById("stake")?.focus();
                return;
              }
              if (searchResults.length === 1) {
                setShowGameDetails(true);
                setCurrentGame([searchResults[0]]);
              } else {
                setShowGameDetails(false);
              }
            }
          }}
        />
      </form>
      <div className="col-12 ">
        {searches.length < 1
          ? games.slice(0, 50).map((game, index) => (
              <Game
                key={index}
                game={game}
                selectedGame={selectedGame}
                receiptGames={receiptGames}
                setReceiptGames={setReceiptGames}
                setShowGameDetails={setShowGameDetails}
                // setOdds={setOdds}
                odds={odds}
                setCurrentGame={setCurrentGame}
                setSelectedGame={setSelectedGame}
                game_index={index}
                eventNumbers={eventNumbers}
              />
            ))
          : searchResults.slice(0, 50).map((res, index) => (
              <Game
                key={index}
                game={res}
                selectedGame={selectedGame}
                receiptGames={receiptGames}
                setReceiptGames={setReceiptGames}
                setShowGameDetails={setShowGameDetails}
                // setOdds={setOdds}
                odds={odds}
                setCurrentGame={setCurrentGame}
                setSelectedGame={setSelectedGame}
                game_index={index}
                eventNumbers={eventNumbers}
              />
            ))}
      </div>
    </div>
  );
};

export default Games;
