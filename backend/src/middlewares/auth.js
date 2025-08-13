import jwt from "jsonwebtoken";

export function auth(requiredRoles = []) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: "No token" });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(decoded.rol)) {
        return res.status(403).json({ error: "No autorizado" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}