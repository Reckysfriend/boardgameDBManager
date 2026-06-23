import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./db.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sql", async (req, res) => {
  const row_values = await display_values();
  res.send(row_values);
});

app.get("/campaigns", async (req, res) => {
  const campaigns = await FetchAllCampaigns();
  res.send(campaigns);
});

app.post("/campaigns", async (req, res) => {
  const post_values = {
    name: req.body.name,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    status: req.body.status,
  };
  await sql`insert into campaigns ${sql(post_values, "name", "start_date", "end_date", "status")}`;

  res.send(`${req.body.name} has been added to the DB!`);
});

async function FetchAllCampaigns() {
  const select_campaigns = ["id", "name", "start_date", "end_date", "status"];

  const campaigns = await sql`select ${sql(select_campaigns)} from campaigns`;

  return campaigns;
}

const update_value = {
  status: "Test",
};

async function update_values() {
  const update_test =
    await sql`update test_campaign set ${sql(update_value, "status")} where id=2`;
  display_values();
}

//update_values();
