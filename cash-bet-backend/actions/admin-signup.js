import bcryptjs from "bcryptjs";

const AdminSignUp = async (req, res, dbConn) => {
  const sallt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, sallt);

  const query = "SELECT * FROM user WHERE user_role=?";

  dbConn.query(query, ["Admin"], (error, results) => {
    if (error) {
      return res.status(201).json({ message: error.sqlMessage });
    } else if (results.length > 0) {
      return res
        .status(201)
        .json({ message: "Super admin account already exisits!" });
    } else {
      const query =
        "INSERT INTO user(linked_to, first_name, last_name, user_email, user_telephone, user_role, duty_station, user_password, date_added) VALUES(?)";
      const values = [
        req.body.linked_to,
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.telephone,
        req.body.user_role,
        req.body.dutyStation,
        hashedPassword,
        new Date(),
      ];
      dbConn.query(query, [values], (error) => {
        if (error) {
          return res.status(201).json({ message: error.sqlMessage });
        } else {
          return res
            .status(200)
            .json({ message: "Admin account created successfully." });
        }
      });
    }
  });
};

export default AdminSignUp;
