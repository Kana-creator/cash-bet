const FetchDatabaseResults = (res, dbConn) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const query =
    "SELECT DISTINCT game_number, league, home, away, date_played, short_score FROM game WHERE short_score LIKE ? AND YEAR(date_played)=? AND MONTH(date_played)=? AND DAY(date_played)>=? AND home!=?";

  dbConn.query(query, ["%(%", year, month, date - 1, ""], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({ databaseResults: results });
    }
  });
};

export default FetchDatabaseResults;
