const FetchCreditBalance = (res, dbConn, user_id) => {
  const query =
    "SELECT SUM(CASE WHEN credit_type = ? AND given_to=? THEN credit_amount ELSE 0 END + CASE WHEN credit_type = ? AND given_by=? THEN credit_amount ELSE 0 END)-SUM(CASE WHEN credit_type = ? AND given_to=? THEN credit_amount ELSE 0 END + CASE WHEN credit_type = ? AND given_by=? THEN credit_amount ELSE 0 END) AS available_credit FROM credit;";

  dbConn.query(
    query,
    ["plus", user_id, "minus", user_id, "minus", user_id, "plus", user_id],
    (error, results) => {
      if (error) {
        return res
          .status(200)
          .json({ message: error.sqlMessage, status: "error" });
      } else {
        return res
          .status(200)
          .json({ credit_balance: results[0], status: "success" });
      }
    }
  );
};

export default FetchCreditBalance;
