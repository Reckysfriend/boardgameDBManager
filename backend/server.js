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
  const post_values = { played_at: data.played_at, game: data.game };
  const session = await sql`insert into session ${sql(post_values, "played_at", "game")} returning id`;
  return session[0].id;
}
async function CreateSessionPlayers(data, sql) {
  for (const player of data) {
    const post_values = { played_at: player.game_session, game: player.player };
    const game_session = await sql`insert into session_player ${sql(post_values, "game_session", "player")}`;
  }
}
// ------------------------------------------------------------ Arkham Horror LCG ------------------------------------------------------------ //
app.post("/arkhamlcg/sessions/create", async (req, res, next) => {
  try {
    const sessionArray = req.body.session;
    console.log("Body: ", req.body);

    sql.begin(async (sql) => {
      /*
      const session = CreateSession(sql);
      const sessionPlayersArray = req.body.sessionPlayers;
      sessionPlayersArray.unshift(session);
      CreateSessionPlayers(sessionPlayersArray, sql);
      */
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
