const DeleteUser = (res, dbConn, user_id) => {
  const query = "DELETE FROM user WHERE user_id=?";

  dbConn.query(query, [user_id], (error) => {
    if (error) {
      return res
        .status(201)
        .json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.status(200).json({
        message: "User has been deleted successfully!",
        status: "success",
      });
    }
  });
};

export default DeleteUser;
