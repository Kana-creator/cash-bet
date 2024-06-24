const FetchAllSystemUsers = (res, dbConn, user_role, user_id) => {
  console.log(user_id);
  let query = "";

  if (user_role === "Admin") {
    query = "SELECT COUNT(user_id) AS allSystemUsers FROM user";
  } else {
    query =
      "SELECT COUNT(user_id) AS allSystemUsers FROM user WHERE linked_to=?";
  }

  dbConn.query(query, [user_id], (error, result) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({
        allSystemUsers: result[0].allSystemUsers,
        status: "success",
      });
    }
  });
};

export default FetchAllSystemUsers;
