import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import FixtureRow from "./fixture-row";
import { GameModule } from "./modules/game-module";
import { useReactToPrint } from "react-to-print";
import ScreenPreloader from "./screen-preloader";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { UserModule } from "./modules/user-module";

interface Props {
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
  games: GameModule[];
  refreshGameIDs: () => any;
  exportToExcel: () => any;
  loading: boolean;
}

const FixtureComponent: React.FC<Props> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
  games,
  refreshGameIDs,
  exportToExcel,
  loading,
}) => {
  const [groupedGames, setGroupedGame] = useState<any[]>([]);

  const [partner, setPartner] = useState<{
    company_name: string | null;
    logo: string | null;
  }>({ company_name: null, logo: null });

  const [initialDate] = useState<string>(new Date().getDate().toString());
  const [fromDate, setFromDate] = useState<string | null>(String(initialDate));
  const [toDate, setToDate] = useState<string | null>(null);

  const [filteredGames, setFilteredGames] = useState<any[]>([]);

  let componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    refreshGameIDs();
    const groupByDate = games
      .sort((a, b) => {
        return Number(a.event_number) - Number(b.event_number);
      })
      .reduce((acc: any, obj) => {
        const key = new Date(obj.event.DT).getDate(); // Grouping based on age
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    const groupedArray = Object.values(groupByDate);
    setGroupedGame(groupedArray);
  }, [games]);

  // handle fetch partner details
  const fetchPartnerDetails = useCallback((partner_id: number | null) => {
    axios
      .get(`${AppUrl()}/fetch-partner-details/${partner_id}`)
      .then((res) => {
        setPartner(res.data.partner);
      })
      .catch((error) => console.log(error));
  }, []);

  // fetch partner details on component rendering
  useEffect(() => {
    const current_user: UserModule = JSON.parse(
      localStorage.getItem("user") as string
    );

    const partnerId =
      current_user.user_role !== "partner"
        ? current_user.linked_to
        : current_user.user_id;

    fetchPartnerDetails(Number(partnerId));
  }, []);

  // set filtered games
  useEffect(() => {
    const originalGames = groupedGames;
    if (
      (fromDate !== null && fromDate !== "" && toDate === "") ||
      toDate === null
    ) {
      // setFilteredGames(groupedGames.filter);
    }
  }, [groupedGames]);

  return (
    <div className=" col-12 d-flex flex-wrap justify-content-center">
      <div
        className="page-heading col-10 d-flex justify-content-between mb-4 p-4"
        style={{ height: "fit" }}
      >
        <h4>Fixture {initialDate.toString()}</h4>
        <button
          className="btn btn-info"
          style={{ height: "40px" }}
          onClick={() => refreshGameIDs()}
        >
          Refresh game IDs
        </button>
        <div className="col-4 d-flex justify-content-around align-items-center">
          <input
            type="date"
            name="fromTime"
            id="fromtTime"
            value={fromDate?.toString()}
            className="p-2"
            onChange={(e) => setFromDate(e.target.value)}
          />
          TO
          <input
            type="date"
            name="toTime"
            id="toTime"
            className="p-2"
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          className="btn btn-secondary"
          style={{ height: "40px" }}
          onClick={handlePrint}
        >
          Print fixture
        </button>

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
        <h1 className="col-12 fixture-head">{partner.company_name}</h1>
        <h1>{games.length !== 0}</h1>

        {games.length > 0 ? (
          groupedGames.map((gg, index) => {
            const sortedGames = gg.sort(
              (a: any, b: any) => Number(a.event.I) - Number(b.event.I)
            );
            return (
              <table key={index} className="table-bordered my-5">
                <thead>
                  <tr>
                    <th
                      className="fs-5 py-3 border-bottom-0"
                      key={index}
                      colSpan={31}
                    >
                      {new Date(gg[0].event.DT).toDateString()}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={5} className="border-top-0"></th>
                    <th colSpan={7}>FULL TIME</th>
                    <th colSpan={7}>HALF TIME</th>
                    <th colSpan={12} className="border-top-0"></th>
                  </tr>
                  <tr>
                    <th rowSpan={2}>No</th>
                    <th rowSpan={2}>Time</th>
                    <th rowSpan={2}>League</th>
                    <th rowSpan={2}>Home</th>
                    <th rowSpan={2}>Away</th>
                    <th colSpan={3}>1x2</th>
                    <th colSpan={2}>2.5</th>
                    <th colSpan={2}>1.5</th>
                    <th colSpan={3}>1x2</th>
                    <th colSpan={2}>1.5</th>
                    <th colSpan={2}>0.5</th>
                    <th colSpan={3}>Double Chance</th>
                    <th colSpan={3}>Half With Most Goals</th>
                    <th colSpan={2}>BTS</th>
                    <th colSpan={4}>Handicap</th>
                  </tr>
                  <tr>
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
                    <th>1X</th>
                    <th>12</th>
                    <th>X2</th>
                    <th>1st</th>
                    <th>X</th>
                    <th>2nd</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Arg</th>
                    <th>1</th>
                    <th>X</th>
                    <th>2</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGames.map((game: GameModule, index: number) => {
                    return <FixtureRow key={index} game={game} />;
                  })}
                </tbody>
              </table>
            );
          })
        ) : (
          <div className="main d-flex justify-content-center align-items-center w-100 h-30">
            <ScreenPreloader />
          </div>
        )}
      </div>
    </div>
  );
};

export default FixtureComponent;
