// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fetch = require('node-fetch');

export default async (req, res) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const fetchFarmers = await fetch(
      'https://script.google.com/macros/s/AKfycbxy--a3QcdnKpT6QO0CiSeZTV-3SlqF4sA40eryKO5IT3Uak9dh1bvWcsYMnE2YHNSn/exec?action=read&table=farmers'
    );
    const farmers = await fetchFarmers.json();
    const farmer = farmers.find(f => f.email === email);
    res.status(200).json(farmer);
  }
};