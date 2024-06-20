const FetchTotalCreditSubscription = (res, dbConn, user_role, user_id) => {
  let query = "SELECT user_id FROM user WHERE user_role=?";

  dbConn.query(query, ["Admin"], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      let arrayValues = [];

      if (user_role === "partner" || user_role === "internal partner") {
        query =
          "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END) - (CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE given_to=?";
        arrayValues = [
          "plus",
          results[0].user_id,
          "minus",
          results[0].user_id,
          user_id,
        ];
      } else {
        query =
          "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END) - (CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE user.user_role=?";
        arrayValues = [
          "plus",
          results[0].user_id,
          "minus",
          results[0].user_id,
          "partner",
        ];
      }

      dbConn.query(query, arrayValues, (error, results) => {
        if (error) {
          return res.json({ message: error.sqlMessage, status: "error" });
        } else {
          return res.json({
            total_credit: results[0].total_credit,
            status: "success",
          });
        }
      });
    }
  });
};

export default FetchTotalCreditSubscription;
