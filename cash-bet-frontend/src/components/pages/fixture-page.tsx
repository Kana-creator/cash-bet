import React, { useEffect, useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import FixtureComponent from "../fixture-component";
import axios from "axios";
import { AppUrl } from "../activities/app-url";
import { GameModule } from "../modules/game-module";
import xml2js from "xml2js";
import { GameNumber } from "../modules/game_number_module";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

interface User {
  linked_to?: number;
  first_name: string;
  last_name: string;
  email?: string;
  telephone: string;
  user_role: string;
  dutyStation?: number;
  password: string;
  confirmPassword?: string;
  user_id: number;
  token: string;
}

const Fixture: React.FC = () => {
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/partner-dashboard",
      status: "",
    },

    {
      lable: "Users",
      link: "/partner-users",
    },

    {
      lable: "Shops",
      link: "/partner-shops",
    },

    {
      lable: "Fixture",
      link: "/fixture",
      status: "active",
    },
    {
      lable: "Results",
      link: "/partiner-results",
    },

    {
      lable: "Reports",
      link: "/partner-receipts",
    },
  ]);

  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [allPreMatchGames, setAllPreMatchGames] = useState<GameModule[]>([]);
  const [eventNumbers, setEventNumbers] = useState<GameNumber[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const refreshGameIDs = () => {
    const gameIDs: string[] = allPreMatchGames.map((g) => g.event.I);
    if (allPreMatchGames.length > 0) {
      axios
        .post(`${AppUrl()}/save-event-numbers`, {
          event_numbers: gameIDs,
        })
        .then()
        .catch((error) => console.log(error));
    }

    // return (window.location.href = "/fixture");
  };

  useEffect(() => {
    refreshGameIDs();
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    setCurrentUserId(currentUser.user_id);
    setCurrentUserName(currentUser.first_name);
    setCurrentUserRole(currentUser.user_role);
  }, []);

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
                    league_name: l.$.N,
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
    // }, 30000);
    // return () => clearInterval(interval);
  }, []);

  const exportToExcel = () => {
    const data: any = [];
    allPreMatchGames.map((game) => {
      const allOdds: any[] = [];
      const mkts: any[] = [game.markets];
      mkts.forEach((mkt: any[]) =>
        mkt.forEach((mk) =>
          mk.B.map((bookmark: any) => {
            allOdds.push({ market: mk.$, odds: [...bookmark.O] });
            // console.log({ event: game.event.I, bookmaker: bookmark.$.I });
          })
        )
      );

      const x2Odds: number[] =
        allOdds.filter((odds) => odds.market.K == "1x2").length !== 0
          ? allOdds
              .filter((odds) => odds.market.K == "1x2")[0]
              .odds.map((odd: any) => odd.$.V)
          : [0, 0, 0];

      const OUFullTime2_5: number[] =
        allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 2.5)
          .length !== 0
          ? allOdds
              .filter(
                (odds) => odds.market.K == "OU" && odds.market.H == 2.5
              )[0]
              .odds.map((odd: any) => odd.$.V)
          : [0, 0];

      const OUFullTime1_5: number[] =
        allOdds.filter((odds) => odds.market.K == "OU" && odds.market.H == 1.5)
          .length !== 0
          ? allOdds
              .filter(
                (odds) => odds.market.K == "OU" && odds.market.H == 1.5
              )[0]
              .odds.map((odd: any) => odd.$.V)
          : [0, 0];

      const time = game.event.DT.split("T");
      data.push(
        // { "1": "1", "2": "2", "3": "3", "4": "4", "5": "5" },
        {
          No: game.event_number,
          Time: time[1],
          League: game.league_name,
          Home: game.event.T1,
          Away: game.event.T2,
          T1: x2Odds[0],
          X: x2Odds[1],
          T2: x2Odds[2],
          UFT: OUFullTime2_5[1],
          OFT: OUFullTime2_5[0],
          Under: OUFullTime1_5[1],
          Over: OUFullTime1_5[0],
        }
      );
    });
    const worksheet = XLSX.utils.json_to_sheet(data);

    // worksheet["!merges"] = [
    //   { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } }, // Merge cells from A1 to C1
    // ];

    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(blob, "Fixtures.xlsx");
  };

  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">BETCRANE</h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />
        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          <FixtureComponent
            games={allPreMatchGames}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            refreshGameIDs={() => refreshGameIDs()}
            exportToExcel={exportToExcel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Fixture;
