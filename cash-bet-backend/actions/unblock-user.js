const UnBlockUser = (res, dbConn, user_id) => {
  const query = "UPDATE user SET block_status=? WHERE user_id=? OR linked_to=?";
  dbConn.query(query, [0, user_id, user_id], (error) => {
    if (error) {
      return res
        .status(200)
        .json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.status(200).json({
        message: "Partner has been unblocked successfully!",
        status: "success",
      });
    }
  });
};

export default UnBlockUser;
