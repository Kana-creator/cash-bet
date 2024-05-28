const FetchSingleUserSession = (res, dbConn, user_id) => {
  const query =
    "SELECT * FROM user_session WHERE user_id=? ORDER BY session_id DESC LIMIT 1";

  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      if (results.length > 0) {
        return res.json({
          session: results[0].session_status,
          status: "success",
        });
      } else {
        return res.json({
          session: 0,
          status: "success",
        });
      }
    }
  });
};

export default FetchSingleUserSession;
