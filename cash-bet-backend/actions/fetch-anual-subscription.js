const FetchAnualSubscription = (res, dbConn, user_role, user_id) => {
  const yearsArray = [];
  for (
    let year = new Date().getFullYear() - 9;
    year <= new Date().getFullYear();
    year++
  ) {
    yearsArray.push(year);
  }

  let query = "";

  if (user_role === "partner") {
    query =
      "SELECT SUM(credit.credit_amount) AS subscription, YEAR(credit.transaction_date) AS year FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE user.user_role=? AND credit.credit_type=? AND given_to=? GROUP BY YEAR(transaction_date) ORDER BY YEAR(transaction_date) DESC";
  } else {
    query =
      "SELECT SUM(credit.credit_amount) AS subscription, YEAR(credit.transaction_date) AS year FROM credit RIGHT JOIN user ON user.user_id=credit.given_to WHERE user.user_role=? AND credit.credit_type=? GROUP BY YEAR(credit.transaction_date) ORDER BY YEAR(credit.transaction_date) DESC";
  }

  const subscription = [];
  dbConn.query(query, ["partner", "plus", user_id], (error, result) => {
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
};

export default FetchAnualSubscription;
