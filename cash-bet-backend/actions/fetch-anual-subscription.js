const FetchAnualSubscription = (res, dbConn, user_role, user_id) => {
  const yearsArray = [];
  for (
    let year = new Date().getFullYear() - 9;
    year <= new Date().getFullYear();
    year++
  ) {
    yearsArray.push(year);
  }

  let query = "SELECT user_id FROM user WHERE user_role=?";
  dbConn.query(query, ["Admin"], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      if (results.length < 1) {
        return res.json({ message: "No admin acount found.", status: "error" });
      } else {
        let arrayValues = [];
        if (user_role === "partner" || user_role === "internal partner") {
          query =
            "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END) - (CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS subscription, YEAR(credit.transaction_date) AS year FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE given_to=? GROUP BY YEAR(transaction_date) ORDER BY YEAR(transaction_date) DESC";

          arrayValues = [
            "plus",
            results[0].user_id,
            "minus",
            results[0].user_id,
            user_id,
          ];
        } else {
          query =
            "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END) - (CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS subscription, YEAR(credit.transaction_date) AS year FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE user.user_role=? GROUP BY YEAR(transaction_date) ORDER BY YEAR(transaction_date) DESC";

          arrayValues = [
            "plus",
            results[0].user_id,
            "minus",
            results[0].user_id,
            "partner",
          ];
        }

        const subscription = [];
        dbConn.query(query, arrayValues, (error, result) => {
          if (error) {
            return res.json({ message: error.sqlMessage, status: "error" });
          } else {
            for (let i = yearsArray.length - 1; i >= 0; i--) {
              subscription.push(
                result
                  .map((r, index) =>
                    yearsArray[index] === yearsArray[i] ? r.subscription : 0
                  )
                  .reduce((a, b) => a + b, 0)
              );
            }

            return res.json({
              annual_subscription: subscription.map((s, i) => {
                return { year: yearsArray[i], subscription: s };
              }),
              status: "success",
            });
          }
        });
      }
    }
  });
};

export default FetchAnualSubscription;
