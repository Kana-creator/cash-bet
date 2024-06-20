const FetchSubscriptionThisYear = (res, dbConn, user_role, user_id) => {
  let query = "SELECT user_id FROM user WHERE user_role=?";

  dbConn.query(query, ["Admin"], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      let arrayValues = [];

      if (user_role === "partner" || user_role === "internal partner") {
        query =
          "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)-(CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE YEAR(credit.transaction_date)=? AND given_to=?";
        arrayValues = [
          "plus",
          results[0].user_id,
          "minus",
          results[0].user_id,
          new Date().getFullYear(),
          user_id,
        ];
      } else {
        query =
          "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)-(CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS total_credit FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE YEAR(credit.transaction_date)=? AND user.user_role=? ";
        arrayValues = [
          "plus",
          results[0].user_id,
          "minus",
          results[0].user_id,
          new Date().getFullYear(),
          "partner",
        ];
      }

      dbConn.query(query, arrayValues, (error, results) => {
        if (error) {
          return res.json({ message: error.sqlMessage, status: "error" });
        } else {
          return res.json({
            subscription: results[0].total_credit,
            status: "success",
          });
        }
      });
    }
  });
};

export default FetchSubscriptionThisYear;
