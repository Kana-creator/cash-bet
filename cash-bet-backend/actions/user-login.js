import bcryptjs from "bcryptjs";

const UserLogin = (req, res, dbConn, jwt) => {
  const query =
    "SELECT user_role FROM user WHERE user_email=? OR user_telephone=?";
  dbConn.query(
    query,
    [req.body.userName, req.body.userName],
    (error, results) => {
      if (error) {
        return res
          .status(201)
          .json({ message: error.sqlMessage, status: "error", auth: false });
      } else if (results.length === 0) {
        return res.status(201).json({
          message: "Wrong Username or Password",
          status: "error",
          // auth: false,
        });
      } else {
        let query;
        if (
          results[0].user_role === "Admin" ||
          results[0].user_role === "partner" ||
          results[0].user_role === "internal partner" ||
          results[0].user_role === "supervisor" ||
          results[0].user_role === "accountant" ||
          results[0].user_role === "other admin"
        ) {
          query = "SELECT * FROM user WHERE user_email=? OR user_telephone=?";
        } else {
          query =
            "SELECT * FROM user INNER JOIN shop ON user.duty_station=shop.shop_id WHERE user_email=? OR user_telephone=?";
        }
        dbConn.query(
          query,
          [req.body.userName, req.body.userName],
          async (error, results) => {
            if (error) {
              return res.status(201).json({
                message: error.sqlMessage,
                status: "error",
                // auth: false,
              });
            } else if (results.length === 0) {
              return res.status(201).json({
                message: "Wrong Username or Password",
                status: "error",
                // auth: false,
              });
            } else if (results[0].block_status === 1) {
              return res.status(201).json({
                message: "You can't login please contact your admin!",
                status: "error",
                auth: false,
              });
            } else {
              const isMatch = await bcryptjs.compare(
                req.body.userPassword,
                results[0].user_password
              );

              if (isMatch) {
                const id = results[0].user_id;
                const telephone = results[0].user_telephone;
                const token = jwt.sign({ id, telephone }, "jwtScrete", {
                  expiresIn: 12 * 60 * 60,
                });

                const query = "UPDATE user SET login_status=? WHERE user_id=?";

                dbConn.query(query, [1, id], (error) => {
                  if (error) {
                    return res
                      .status(400)
                      .json({ message: error.sqlMessage, status: "error" });
                  } else {
                    return res.status(200).json({
                      message: "Login success",
                      status: "success",
                      user: results[0],
                      token: token,
                      // auth: true,
                    });
                  }
                });
              } else {
                return res.status(201).json({
                  message: "Wrong password",
                  status: "error",
                  // auth: false,
                });
              }
            }
          }
        );
      }
    }
  );
};

export default UserLogin;
