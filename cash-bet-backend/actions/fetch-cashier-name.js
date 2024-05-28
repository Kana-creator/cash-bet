const FetchCashierName = (req, res, dbConn) => {
  const { userId } = req.params;
  const query = "SELECT first_name, last_name FROM user WHERE user_id=?";
  dbConn.query(query, [userId], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({
        cashierName: results[0].first_name + " " + results[0].last_name,
      });
    }
  });
};

export default FetchCashierName;
