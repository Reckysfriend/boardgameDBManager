import "dotenv/config";
import express from "express";
import sql from "./db.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log(`${process.env.TEST}`);

async function connection_test() {
  test = await sql`SELECT NOW()`;
  return test;
}
console.log(connection_test);
