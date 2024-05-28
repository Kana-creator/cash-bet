const EndSession = (res, dbConn, user_id) => {
  const query =
    "UPDATE user_session SET session_ended=?, session_status=? WHERE user_id=? AND session_ended IS NULL";

  dbConn.query(query, [new Date(), 0, user_id, null], (error) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.json({
        message: "Session ended successfully.",
        status: "success",
      });
    }
  });
};

export default EndSession;
