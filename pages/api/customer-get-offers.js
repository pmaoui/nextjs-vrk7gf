const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const { read } = require("../../db");

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const { email } = jwt.verify(token, "bequiet");
      const { data: customers } = await read("customers");
      const customer = customers.find((c) => c.email === email);
      const { data: offers } = await read("offers");
      const promises = offers.map((o) =>
        fetch(
          `http://0.0.0.0:8001/convert?fruitUnitPriceEUR=${o.fruitUnitPriceEUR}&fruitQuantity=${o.fruitQuantity}`
        ).then((res) => res.json())
      );
      let prices;
      try {
        prices = await Promise.all(promises);
      } catch (e) {
        throw new Error(
          "Python script failure: Did you launch it ? Cmd: python3 server.py"
        );
      }

      return res.status(200).json({
        email,
        wallet: customer.wallet,
        offers: offers.map((o, i) => ({ ...o, ...prices[i] })),
      });
    } catch (e) {
      return res.status(500).json({ error: "error " + e.message });
    }
  }
  return res.status(404).json({ error: "?" });
};
