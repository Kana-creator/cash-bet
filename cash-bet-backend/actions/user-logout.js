const UserLogOut = (req, res, dbConn) => {
  const query = "UPDATE user SET login_status=? WHERE user_id=?";
  dbConn.query(query, [0, req.body.user_id], (error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.status(200).json({ status: "success" });
    }
  });
};

export default UserLogOut;
