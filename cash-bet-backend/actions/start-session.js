const StartSession = (res, dbConn, user_id) => {
  const values = [user_id, new Date(), 1];
  const query =
    "INSERT INTO user_session(user_id, session_started, session_status) VALUES(?)";

  dbConn.query(query, [values], (error) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.json({
        message: "Session started successfully.",
        status: "success",
      });
    }
  });
};

export default StartSession;
