import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  // get authorization header
  const authHeader = req.headers.authorization;

  // token not exist
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // split token from header
  const token = authHeader.split(" ")[1];

  try {
    // token authorization
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // for router
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
