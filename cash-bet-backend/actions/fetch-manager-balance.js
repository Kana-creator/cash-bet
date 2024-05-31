const FetchManagerBalance = (req, res, dbConn) => {
  const { user_id } = req.params;
  console.log(user_id);
  const date = new Date();
  const query =
    "SELECT SUM(stake) AS manager_balance FROM receipt WHERE cashier_id=?";

  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      console.log(error);
      res.json({ message: error.sqlMessage, status: "error" });
    } else {
      res.json({
        manager_balance: results[0].manager_balance,
        status: "success",
      });
    }
  });
};

export default FetchManagerBalance;
