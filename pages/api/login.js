// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { read } = require("../../db");

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const submittedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");
    const { data: farmers } = await read("farmers");
    const farmer = farmers.find((f) => f.email === email);
    if (farmer && farmer.password === submittedPassword) {
      const token = jwt.sign({ email, type: "farmer" }, "bequiet", {
        expiresIn: 6000,
      });
      return res.status(200).json({
        ...farmer,
        type: "farmer",
        token,
      });
    }
    const { data: customers } = await read("customers");
    const customer = customers.find((f) => f.email === email);
    if (customer && customer.password === submittedPassword) {
      const token = jwt.sign({ email, type: "customer" }, "bequiet", {
        expiresIn: 600,
      });
      return res.status(200).json({ ...customer, type: "customer", token });
    }
    return res.status(403).json({ error: "Bad access" });
  }
  return res.status(404).json({ error: "?" });
};
