const fetch = require("node-fetch");

const spreadsheet_url =
  "https://script.google.com/macros/s/AKfycbxy--a3QcdnKpT6QO0CiSeZTV-3SlqF4sA40eryKO5IT3Uak9dh1bvWcsYMnE2YHNSn/exec";

export async function read(table, id) {
  const res = await fetch(
    `${spreadsheet_url}?action=read&table=${table}${id ? `&id=${id}` : ""}`
  );
  return res.json();
}

export async function update(table, id, data) {
  const res = await fetch(
    `${spreadsheet_url}?action=update&table=${table}&id=${id}&data=${JSON.stringify(
      data
    )}`
  );
  return res.json();
}

export async function insert(table, data) {
  const res = await fetch(
    `${spreadsheet_url}?action=insert&table=${table}&data=${JSON.stringify(
      data
    )}`
  );
  return res.json();
}

export async function remove(table, id) {
  const res = await fetch(
    `${spreadsheet_url}?action=delete&table=${table}&id=${id}`
  );
  return res.json();
}
