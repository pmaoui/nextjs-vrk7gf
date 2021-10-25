// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const jwt = require("jsonwebtoken");
const { insert } = require("../../db");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const { email } = jwt.verify(token, "bequiet");
      const payload = {
        id: new Date().getTime(),
        ...req.body,
        email,
        soldTo: null,
      };
      await insert("offers", payload);
      return res.status(200).json(payload);
    } catch (e) {
      return res.status(500).json({ error: "error " + e.message });
    }
  }
  return res.status(404).json({ error: "?" });
};
