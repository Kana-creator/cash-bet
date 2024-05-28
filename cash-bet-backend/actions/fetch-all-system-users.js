const FetchAllSystemUsers = (res, dbConn, user_role, view_dashboard) => {
  
    const query = "SELECT COUNT(user_id) AS allSystemUsers FROM user";

    dbConn.query(query, (error, result) => {
      if (error) {
        return res.json({ message: error.sqlMessage, status: "error" });
      } else {
        return res.json({
          allSystemUsers: result[0].allSystemUsers,
          status: "success",
        });
      }
    });
  
};

export default FetchAllSystemUsers;
