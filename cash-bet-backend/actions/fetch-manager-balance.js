const FetchManagerBalance = (req, res, dbConn) => {
  const { user_id } = req.params;
  let query =
    "SELECT SUM(stake) AS manager_balance FROM receipt WHERE cashier_id=?";

  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      console.log(error);
      res.json({ message: error.sqlMessage, status: "error" });
    } else {
      query =
        "SELECT SUM(amount) AS withdraw_amount FROM withdraw WHERE cashier_id=?";
      dbConn.query(query, [user_id], (error, withdraw_results) => {
        if (error) {
          console.log(error.sqlMessage);
        } else {
          if (
            withdraw_results[0].withdraw_amount <= 0 ||
            results[0].manager_balance - withdraw_results[0].withdraw_amount <=
              0
          ) {
            res.json({
              manager_balance: 0,
              status: "success",
            });
          } else {
            res.json({
              manager_balance:
                results[0].manager_balance -
                withdraw_results[0].withdraw_amount,
              status: "success",
            });
          }
        }
      });
    }
  });
};

export default FetchManagerBalance;
