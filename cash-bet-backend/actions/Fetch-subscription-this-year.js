const FetchSubscriptionThisYear = (res, dbConn) => {
  const query =
    "SELECT SUM(credit.credit_amount) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE credit.credit_type=? AND user.user_role=? AND YEAR(credit.transaction_date)=?";
  dbConn.query(
    query,
    ["plus", "partner", new Date().getFullYear()],
    (error, results) => {
      if (error) {
        return res.json({ message: error.sqlMessage, status: "error" });
      } else {
        return res.json({
          subscription: results[0].total_credit,
          status: "success",
        });
      }
    }
  );
};

export default FetchSubscriptionThisYear;
