const FetchResultGames = (req, res, dbConn) => {
  const { receipt_number } = req.params;

  const query = "SELECT * FROM game g WHERE g.receipt_number = ?";

  dbConn.query(query, [receipt_number], (error, results) => {
    if (error) {
      res.json({ message: error.sqlMessage, status: "error" });
    } else {
      if (results.length < 1) {
        res.json({ message: "No game was found.", status: "error" });
      } else {
        res.json({ resultGames: results, status: "success" });
      }
    }
  });
};

export default FetchResultGames;
