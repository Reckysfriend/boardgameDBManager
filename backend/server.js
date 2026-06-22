import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./db.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sql", async (req, res) => {
  const row_values = await display_values();
  res.send(row_values);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function dbInstert() {
  const test_insert = {
    name: "Innsmouth Consparicy",
    start_date: "2025-11-30",
    status: "Finished",
  };

  await sql`
insert into test_campaign ${sql(test_insert, "name", "start_date", "status")}`;
}

async function display_values() {
  const select_campaign = ["name", "start_date", "status"];

  const return_test =
    await sql`select ${sql(select_campaign)} from test_campaign`;

  return return_test;
}

display_values();

const update_value = {
  status: "Test",
};

async function update_values() {
  const update_test =
    await sql`update test_campaign set ${sql(update_value, "status")} where id=2`;
  display_values();
}

update_values();
