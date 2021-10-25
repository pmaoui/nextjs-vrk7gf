const jwt = require("jsonwebtoken");
const { remove, read } = require('../../db')

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const { email } = jwt.verify(token, "bequiet");
      const { data: offers } = await read('offers')
      const offer = offers.find((o) => o.email === email);
      if (!offer) {
        throw new Error("No offer found");
      }
      await remove('offers', offer.id)
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "erreur " + e.message });
    }
  }
  return res.status(404).json({ error: "?" });
};
