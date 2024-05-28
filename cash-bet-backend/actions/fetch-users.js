const FetchUsers = (res, dbConn, user_id, user_role, linked_to) => {
  let linkedTo = 0;
  let query = "";
  if (user_role === "Admin") {
    linkedTo = user_id;
    query =
      "SELECT * FROM user WHERE user_role != ? AND user_role!=? AND linked_to=? ORDER BY user.user_id DESC";
  } else if (user_role === "partner" || user_role === "internal partner") {
    linkedTo = user_id;
    query =
      "SELECT * FROM user INNER JOIN shop ON user.duty_station=shop.shop_id WHERE user_role != ? AND user_role!=? AND linked_to=? ORDER BY user.user_id DESC";
  } else {
    linkedTo = linked_to;
    query =
      "SELECT * FROM user WHERE user_role != ? AND user_role!=? AND linked_to=? AND user_id !=? ORDER BY user.user_id DESC";
  }

  dbConn.query(
    query,
    ["Admin", "partner", linkedTo, user_id],
    (error, results) => {
      if (error) {
        return res
          .status(201)
          .json({ message: error.sqlMessage, status: "error" });
      } else if (results.length === 0) {
        return res
          .status(201)
          .json({ message: "No user found !", status: "error" });
      } else {
        return res.status(200).json({ users: results, status: "success" });
      }
    }
  );
};

export default FetchUsers;
