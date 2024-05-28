const FetchResults = (req, res, dbConn) => {
  const { receiptNumber } = req.params;
  const query = "SELECT * FROM game where receipt_number=?";
  dbConn.query(query, [receiptNumber], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({ games: results, status: "error" });
    }
  });
};

export default FetchResults;
