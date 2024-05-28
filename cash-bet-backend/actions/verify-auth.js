import jwt from "jsonwebtoken";
const verifyAuth = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(201).json({ message: "Authentication failed!1" });
  } else {
    jwt.verify(token, "jwtScrete", (error, decoded) => {
      if (error) {
        return res
          .status(201)
          .json({ auth: false, message: `Authentication failed!2` });
      } else {
        req.userId = decoded.user_id;
        next();
      }
    });
  }
};

export default verifyAuth;
