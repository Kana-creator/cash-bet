const FetchSubscriptionThisMonth = (res, dbConn, user_role, user_id) => {
  let query = "";

  if (user_role === "partner") {
    query =
      "SELECT SUM(credit.credit_amount) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE credit.credit_type=? AND user.user_role=? AND MONTH(credit.transaction_date)=? AND given_to=?";
  } else {
    query =
      "SELECT SUM(credit.credit_amount) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE credit.credit_type=? AND user.user_role=? AND MONTH(credit.transaction_date)=?";
  }

  dbConn.query(
    query,
    ["plus", "partner", new Date().getMonth() + 1, user_id],
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

export default FetchSubscriptionThisMonth;
