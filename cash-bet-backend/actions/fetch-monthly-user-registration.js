const FetchMonthlyUserRegistration = (
  res,
  dbConn,
  user_role,
  user_id,
  year
) => {
  let query = "";

  if (user_role === "Admin" || user_role === "other admin") {
    query =
      "SELECT COUNT(user_id) AS number_of_users, MONTH(date_added) AS registration_month FROM user WHERE YEAR(date_added)=? GROUP BY MONTH(date_added) ORDER BY MONTH(date_added)";
  } else {
    query =
      "SELECT COUNT(user_id) AS number_of_users, MONTH(date_added) AS registration_month FROM user WHERE YEAR(date_added)=? AND user.linked_to=? GROUP BY MONTH(date_added) ORDER BY MONTH(date_added)";
  }

  dbConn.query(query, [year, user_id], (error, result) => {
    if (error) {
      console.log(error.sqlMessage);
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
              months[r.registration_month] === months[i] ? r.number_of_users : 0
            )
            .reduce(
              (calculator, previousNumber) => calculator + previousNumber,
              0
            )
        );
      }

      return res.json({
        usersRegRate: MyResults.map((m, i) => {
          return { name: months[i], value: m };
        }),
        status: "success",
      });
    }
  });
};

export default FetchMonthlyUserRegistration;
