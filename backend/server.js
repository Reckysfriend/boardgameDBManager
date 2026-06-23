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

app.get("/campaigns", async (req, res) => {
  const select_campaigns = ["id", "name", "start_date", "end_date", "status"];
  const campaigns = await FetchCampaigns(select_campaigns);
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

app.get("/scenarios", async (req, res) => {
  const select_scenario = [
    "id",
    "campaign_id",
    "name",
    "scenario_order",
    "resolution",
    "played_at",
    "play_location",
  ];
  const scenarios = await FetchScenarios(select_scenario);
  res.send(scenarios);
});

app.post("/scenarios", async (req, res) => {
  const post_values = {
    campaign_id: req.body.campaign_id,
    name: req.body.name,
    scenario_order: req.body.scenario_order,
    resolution: req.body.resolution,
    played_at: req.body.played_at,
    play_location: req.body.play_location,
  };
  console.log(post_values);
  await sql`insert into scenarios ${sql(post_values, "campaign_id", "name", "scenario_order", "resolution", "played_at", "play_location")}`;

  res.send(`${req.body.name} has been added to the DB!`);
});

async function FetchCampaigns(selected_coulmns) {
  const campaigns = await sql`select ${sql(selected_coulmns)} from campaigns`;

  return campaigns;
}
async function FetchScenarios(selected_coulmns) {
  const scenarios =
    await sql`select ${sql(selected_coulmns)} from scenarios order by scenario_order asc`;

  return scenarios;
}

/*async function update_values() {
  const update_test =
    await sql`update test_campaign set ${sql(update_value, "status")} where id=2`;
  display_values();
}

//update_values(); */
