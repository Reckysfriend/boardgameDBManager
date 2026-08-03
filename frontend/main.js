import { campaign_Scenario_Dictonary } from "./scenarios.js";
export let all_Loaded_Campaigns = {};
export let all_Loaded_Scenarios = {};

LoadAllCampaigns();
LoadAllScenarios();

const container = document.getElementById("campaignDisplay");
const title = document.getElementById("pageTitle");

async function LoadAllScenarios() {
  const url = "http://localhost:3000/arkhamlcg/scenarios";
  const response = await fetch(url);
  const result = await response.json();
  all_Loaded_Scenarios = result;
}

async function LoadSelectedScenarioByID(id) {
  console.log("You have load the scenario with ID:" + id);
}

async function manual_scenario_input() {
  const url = "http://localhost:3000/scenarios";
  const object = {
    campaign_id: 2,
    name: "Extracurricular Activity",
    scenario_order: 2,
    resolution: 2,
    played_at: "2026-06-04",
    play_location: "tts",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  const res_message = await response.text();
  console.log(res_message);
}

const form = document.querySelector("#test_form");
async function test_request_post_form() {
  const url = "http://localhost:3000/campaigns";

  const object = {
    name: document.forms["test_form"]["campaign_name"].value,
    start_date: document.forms["test_form"]["start_date"].value,
    end_date: document.forms["test_form"]["end_date"].value,
    status: document.forms["test_form"]["status"].value,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res_message = await response.text();
  console.log(res_message);
}
/*
form.addEventListener("submit", (event) => {
  event.preventDefault();
  test_request_post_form();
});
*/
