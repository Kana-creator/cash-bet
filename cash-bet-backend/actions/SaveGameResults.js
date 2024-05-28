const SaveGameResults = (req, res, dbConn) => {
  const results = [req.body];

  results.forEach((result) => {
    const query = "SELECT short_score FROM game WHERE event_id=?";

    dbConn.query(query, [result.event_id], (error, res) => {
      if (error) {
        console.log(error.sqlMessage);
      } else if (res[0].short_score !== null) {
        const query =
          "UPDATE game SET short_score=?, long_score=?, date_played=?, league=? WHERE event_id=?";

        dbConn.query(
          query,
          [
            result.short_score,
            result.long_score,
            result.date_played,
            result.league,
            result.event_id,
          ],
          (error) => {
            if (error) {
              console.log(error.sqlMessage);
            }
          }
        );
      }
    });
  });

  return res.json({ status: "success" });
};

export default SaveGameResults;
