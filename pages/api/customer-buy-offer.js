const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const { insert, read, update } = require("../../db");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const { email } = jwt.verify(token, "bequiet");

      const { data: customers } = await read("customers");
      const customer = customers.find((c) => c.email === email);

      const { offerId } = req.body;
      const { data: offer } = await read("offers", offerId);
      if (!offer) {
        throw new Error("No offer found");
      }

      const convertRes = await fetch(
        `http://0.0.0.0:8001/convert?fruitUnitPriceEUR=${offer.fruitUnitPriceEUR}&fruitQuantity=${offer.fruitQuantity}`
      );
      const { totalPrice } = await convertRes.json();

      if (customer.wallet < totalPrice) {
        throw new Error("Not enough money");
      }
      console.log(`Order for offer ${offerId} from ${email} for ${totalPrice}`);

      // set the offer as sold out
      await update("offers", offer.id, { ...offer, soldTo: email });

      // take the money
      await update("customers", customer.id, {
        ...customer,
        wallet: customer.wallet - totalPrice,
      });

      // store the transaction
      await insert("orders", {
        orderDate: new Date().toLocaleString(),
        offerId,
        customerId: customer.id,
        fruitQuantity: offer.fruitQuantity,
        totalPrice,
      });

      return res.status(200).json({ wallet: customer.wallet - totalPrice });
    } catch (e) {
      console.error("Error " + e.message);
      return res.status(500).json({ error: "error " + e.message });
    }
  }
  return res.status(404).json({ error: "?" });
};
