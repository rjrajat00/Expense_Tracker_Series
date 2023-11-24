const jwt = require("jsonwebtoken");
const SignUp = require("../server/models/newUser");
const sec_key = "weall00@#90";

const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If the Authorization header is missing or doesn't start with "Bearer", send a 401 Unauthorized response
    return res.status(401).json({ error: "Unauthorized Access" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, sec_key, async (err, decoded) => {
    if (err) {
      // If verification fails, send a 401 Unauthorized response
      return res.status(401).json({ error: "Unauthorized Access" });
    } else {
      // If verification succeeds, attach the decoded payload to the request object
      req.decoded = decoded;

      console.log("Decoded:", decoded);

      try {
        if (decoded && decoded.id) {
          const user = await SignUp.findOne({ where: { id: decoded.id } });
          req.SignUp = user;
          next();
        } else {
          console.error("Decoded object is missing id property");
          res.status(401).json({ error: "Unauthorized Access" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
};

module.exports = verifyToken;
