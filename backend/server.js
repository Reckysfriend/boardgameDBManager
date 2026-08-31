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
// ------------------------------------------------------------ High Level Tables ------------------------------------------------------------ //
app.get("/players", async (req, res, next) => {
  try {
    const players = await sql`select * from player`;
    res.send(players);
  } catch (err) {
    next(err);
  }
});
app.post("/session", async (req, res, next) => {
  try {
    const post_values = {
      played_at: req.body.played_at,
      game: req.body.game,
    };
    const session = await sql`insert into session ${sql(post_values, "played_at", "game")} returning id`;
    res.send(session[0].id);
  } catch (err) {
    next(err);
  }
});
app.post("/game_session", async (req, res, next) => {
  try {
    const post_values = {
      game_session: req.body.game_session,
      player: req.body.player,
    };
    const session = await sql`insert into session ${sql(post_values, "played_at", "game")}`;
    res.sendStatus(200);
    res.st;
  } catch (err) {
    next(err);
  }
});
async function CreateSession(data, sql) {
  console.log(data);
  const post_values = { played_at: data.played_at, play_location: data.play_location, game: data.game };
  console.log("Post: ", post_values);
  const session = await sql`insert into session ${sql(post_values, "played_at", "play_location", "game")} returning id`;
  return session[0].id;
}
async function CreateSessionPlayers(sessionID, players, sql) {
  for (const player of players) {
    const post_values = { game_session: sessionID, player: player };
    const game_session = await sql`insert into session_player ${sql(post_values, "game_session", "player")}`;
  }
}
async function CreateScenarioEntry(sessionID, data, sql) {
  console.log("Inside ScenarioEntry");
  const post_values = {
    campaign_id: data.campaign_id,
    session_id: sessionID,
    name: data.name,
    scenario_order: data.scenario_order,
    resolution: data.resolution,
    is_legacy_status: data.is_legacy_status,
  };
  console.log("Post: ", post_values);
  const scenario =
    await sql`insert into arkham_horror_lcg_scenarios ${sql(post_values, "campaign_id", "session_id", "name", "scenario_order", "resolution", "is_legacy_status")} returning id`;
  return scenario[0].id;
}
async function CreatePlayerEntry(scenarioID, data, sql) {
  data.forEach(async (player) => {
    const post_values = {
      player: player.player,
      scenario_id: scenarioID,
      xp_gained: player.xp_gained,
      mental_trauma_gained: player.mental_trauma_gained,
      physical_trauma_gained: player.physical_trauma_gained,
      investigator_status: player.investigator_status,
    };
    const playerEntry =
      await sql`insert into arkham_horror_lcg_player_entry ${sql(post_values, "player", "scenario_id", "xp_gained", "mental_trauma_gained", "physical_trauma_gained", "investigator_status")}`;
  });
}
async function CreateEAVEntry(scenarioID, data, sql) {
  data.forEach(async (eav) => {
    const post_values = {
      scenario_id: scenarioID,
      entity_name: eav.name,
      entity_type: eav.entity,
      version: eav.version,
      trigger_type: eav.triggerType,
      key: eav.key,
      value_type: eav.valueType,
      value: eav.value,
    };
    const playerEntry =
      await sql`insert into arkham_horror_lcg_eav ${sql(post_values, "scenario_id", "entity_name", "entity_type", "version", "trigger_type", "key", "value_type", "value")}`;
  });
}
// ------------------------------------------------------------ Arkham Horror LCG ------------------------------------------------------------ //
app.post("/arkhamlcg/sessions/create", async (req, res, next) => {
  try {
    const sessionArray = req.body.Session;
    const sessionPlayersArray = req.body.SessionPlayers;
    const scenarioEntryArray = req.body.Scenario;
    const scenarioPlayerEntryArray = req.body.PlayerEntry;
    const scenarioEAV = req.body.EAV;
    console.log("Body: ", req.body);

    sql.begin(async (sql) => {
      console.log("Before CreateSession");
      const sessionID = await CreateSession(sessionArray, sql);
      console.log("After CreateSession");

      console.log("Before CreateSessionPlayers");
      CreateSessionPlayers(sessionID, sessionPlayersArray, sql);
      console.log("After CreateSessionPlayers");

      console.log("Before CreateScenarioEntry");
      const scenarioID = await CreateScenarioEntry(sessionID, scenarioEntryArray, sql);
      console.log("After CreateScenarioEntry");

      console.log("Before CreatePlayerEntry");
      CreatePlayerEntry(scenarioID, scenarioPlayerEntryArray, sql);
      console.log("After CreatePlayerEntry");

      console.log("Before EAV");
      CreateEAVEntry(scenarioID, scenarioEAV, sql);
      console.log("After EAV");
    });
  } catch (err) {
    next(err);
  }
});

app.get("/arkhamlcg/campaigns", async (req, res, next) => {
  try {
    const campaigns = await sql`select * from arkham_horror_lcg_campaigns`;
    res.send(campaigns);
  } catch (err) {
    next(err);
  }
});
app.get("/arkhamlcg/campaigns/players/:id", async (req, res, next) => {
  try {
    const players = await sql`select player_id,investigator_name from arkham_horror_lcg_campaigns_players where campaign_id = ${req.params.id}`;
    res.send(players);
  } catch (err) {
    next(err);
  }
});
app.post("/arkhamlcg/campaigns", async (req, res) => {
  const post_values = {
    name: req.body.campaign,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    status: req.body.playing_status,
    is_legacy_status: req.body.is_legacy_status,
  };
  if (post_values["end_date"] == "") {
    post_values["end_date"] = null;
  }
  const campaign =
    await sql`insert into arkham_horror_lcg_campaigns ${sql(post_values, "name", "start_date", "end_date", "status", "is_legacy_status")} returning id`;

  res.send(campaign[0].id);
});

app.delete("/arkhamlcg/campaigns/:id", async (req, res, next) => {
  try {
    await sql`delete from arkham_horror_lcg_campaigns where id = ${req.params.id}`;
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

app.post("/arkhamlcg/players", async (req, res, next) => {
  try {
    const array = req.body;
    for (const player of array) {
      const post_values = { player_id: player.player_name, campaign_id: player.campaign_id, investigator_name: player.investigator, deck_link: null };
      const campaign_player =
        await sql`insert into arkham_horror_lcg_campaigns_players ${sql(post_values, "player_id", "campaign_id", "investigator_name", "deck_link")}`;
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

app.get("/arkhamlcg/scenarios", async (req, res, next) => {
  try {
    const scenarios = await sql`select * from arkham_horror_lcg_scenarios order by scenario_order asc`;
    res.send(scenarios);
  } catch (err) {
    next(err);
  }
});

app.get("/arkhamlcg/scenarios/:campaignID", async (req, res, next) => {
  try {
    const scenarios = await sql`select * from arkham_horror_lcg_scenarios where campaign_id = ${req.params.campaignID}`;

    res.send(scenarios);
  } catch (err) {
    next(err);
  }
});

app.post("/arkhamlcg/scenarios", async (req, res) => {
  const post_values = {
    campaign_id: req.body.campaign_id,
    name: req.body.name,
    scenario_order: req.body.scenario_order,
    resolution: req.body.resolution,
    play_location: req.body.play_location,
  };
  await sql`insert into scenarios ${sql(post_values, "campaign_id", "name", "scenario_order", "resolution", "play_location")}`;

  res.send(`${req.body.name} has been added to the DB!`);
});

app.use(errorHandler);
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.json({ error: err });
}
/*async function update_values() {
  const update_test =
    await sql`update test_campaign set ${sql(update_value, "status")} where id=2`;
  display_values();
}

//update_values(); */
