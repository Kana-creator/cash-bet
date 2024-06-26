const FetchAllManagers = (res, dbConn, user_id) => {
  const query =
    "SELECT COUNT(user_id) AS allManagers FROM user WHERE user_role=? AND linked_to=?";

  dbConn.query(query, ["manager", user_id], (error, result) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      if (result.length < 1) {
        console.log("No manager for this particular partner.");
      } else {
        return res.json({
          allManagers: result[0].allManagers,
          status: "success",
        });
      }
    }
  });
};

export default FetchAllManagers;
