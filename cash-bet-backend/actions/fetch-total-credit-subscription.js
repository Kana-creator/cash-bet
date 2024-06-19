const FetchTotalCreditSubscription = (res, dbConn, user_role, user_id) => {
  console.log(user_id);
  let query = "";

  if (user_role === "partner") {
    query =
      "SELECT SUM(credit.credit_amount) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE credit.credit_type=? AND user.user_role=? AND given_to=?";
  } else {
    query =
      "SELECT SUM(credit.credit_amount) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE credit.credit_type=? AND user.user_role=?";
  }
  // const query =
  //   "SELECT SUM(CASE WHEN credit.credit_type = ? THEN credit.credit_amount ELSE 0 END - CASE WHEN credit.credit_type = ? AND credit.given_by=? THEN credit.credit_amount ELSE 0 END) AS total_credit FROM credit INNER JOIN user ON user.user_id=credit.given_to WHERE user.user_role=?";

  dbConn.query(query, ["plus", "partner", user_id], (error, results) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.json({
        total_credit: results[0].total_credit,
        status: "success",
      });
    }
  });
};

export default FetchTotalCreditSubscription;
