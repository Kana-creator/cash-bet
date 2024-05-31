const UpdateUser = (req, res, dbConn, user_id) => {
  const query =
    "UPDATE user SET user_role=?, duty_station=?, first_name=?, last_name=?, user_email=?, user_telephone=?, date_updated=? WHERE user_id=?";
  dbConn.query(
    query,
    [
      req.body.user_role,
      req.body.dutyStation,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.telephone,
      new Date(),
      user_id,
    ],
    (error) => {
      if (error) {
        return res
          .status(200)
          .json({ message: error.sqlMessage, status: "error" });
      } else {
        return res.status(200).json({
          message: "User has been updated successfully!",
          status: "success",
        });
      }
    }
  );
};

export default UpdateUser;
