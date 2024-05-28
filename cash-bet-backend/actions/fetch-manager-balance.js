const FetchManagerBalance = (req, res, dbConn) => {
  const { user_id } = req.params;
  const date = new Date();
  const query =
    "SELECT SUM(stake) AS manager_balance FROM receipt WHERE cashier_id=? AND YEAR(date_added)=? AND MONTH(date_added)=? AND DAY(date_added)=?";

  dbConn.query(
    query,
    [user_id, date.getFullYear(), date.getMonth() + 1, date.getDate()],
    (error, results) => {
      if (error) {
        console.log(error);
        res.json({ message: error.sqlMessage, status: "error" });
      } else {
        res.json({
          manager_balance: results[0].manager_balance,
          status: "success",
        });
      }
    }
  );
};

export default FetchManagerBalance;
