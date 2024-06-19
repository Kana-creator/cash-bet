const FetchMonthlySubscription = (res, dbConn, year, user_role, user_id) => {
  let query = "";

  if (user_role === "partner") {
    query =
      "SELECT SUM(credit.credit_amount) AS credit_amount, MONTH(credit.transaction_date) AS transaction_month FROM credit INNER JOIN user ON user.user_id=credit.given_to WHERE YEAR(credit.transaction_date)=? AND user.user_role=? AND credit.credit_type=? AND given_to=? GROUP BY MONTH(transaction_date) ORDER BY MONTH(transaction_date)";
  } else {
    query =
      "SELECT SUM(credit.credit_amount) AS credit_amount, MONTH(credit.transaction_date) AS transaction_month FROM credit INNER JOIN user ON user.user_id=credit.given_to WHERE YEAR(credit.transaction_date)=? AND user.user_role=? AND credit.credit_type=? GROUP BY MONTH(transaction_date) ORDER BY MONTH(transaction_date)";
  }

  dbConn.query(query, [year, "partner", "plus", user_id], (error, result) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const MyResults = [];
      for (let i = 1; i <= months.length; i++) {
        MyResults.push(
          result
            .map((r) =>
              months[r.transaction_month] === months[i] ? r.credit_amount : 0
            )
            .reduce(
              (calculator, previousNumber) => calculator + previousNumber,
              0
            )
        );
      }

      return res.json({
        monthly_subscription: MyResults.map((m, i) => {
          return { month: months[i], subscription: m };
        }),
        status: "success",
      });
    }
  });
};

export default FetchMonthlySubscription;
