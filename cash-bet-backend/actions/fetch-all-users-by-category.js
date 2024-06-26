const FetchAllUsersByCatecgory = (res, dbConn, user_role, user_d) => {
  const query =
    "SELECT COUNT(user_id) AS number_of_users, user_role FROM user GROUP BY user_role";

  dbConn.query(query, (error, result) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.json({
        usersByCategory: result,
        status: "success",
      });
    }
  });
};

export default FetchAllUsersByCatecgory;
