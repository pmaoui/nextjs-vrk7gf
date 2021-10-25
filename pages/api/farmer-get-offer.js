const jwt = require("jsonwebtoken");
const { read } = require('../../db')

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const { email } = jwt.verify(token, "bequiet");
      const { data: offers } = await read('offers')
      const offer = offers.find((o) => o.email === email) || {};
      return res.status(200).json({ offer });
    } catch (e) {
      return res.status(500).json({ error: "erreur " + e.message });
    }
  }
  return res.status(404).json({ error: "?" });
};
