import { campaign_Scenario_Dictonary } from "./scenarios.js";
export let all_Loaded_Campaigns = {};
export let all_Loaded_Scenarios = {};

LoadAllCampaigns();
LoadAllScenarios();

const container = document.getElementById("campaignDisplay");
const title = document.getElementById("pageTitle");

async function LoadAllCampaigns() {
  const url = "http://localhost:3000/campaigns";
  const response = await fetch(url);
  const result = await response.json();
  let newContent = "";
  result.forEach((campaign) => {
    const newDiv = document.createElement("div");
    newDiv.classList = "grid grid-rows-3 gap-1  bg-gray-200";

    const newH1 = document.createElement("h1");
    newContent = document.createTextNode(`${campaign.name}`);
    newH1.appendChild(newContent);

    const newP1 = document.createElement("p");
    newContent = document.createTextNode(`Start Date: ${campaign.start_date}`);
    newP1.appendChild(newContent);

    const newP2 = document.createElement("p");
    newContent = document.createTextNode(`Status: ${campaign.status}`);
    newP2.appendChild(newContent);

    newDiv.appendChild(newH1);
    newDiv.appendChild(newP1);
    newDiv.appendChild(newP2);
    container.appendChild(newDiv);

    newDiv.addEventListener("click", (e) => {
      LoadSelectedCampaignByID(campaign.id);
    });
  });
  all_Loaded_Campaigns = result;
}

async function LoadAllScenarios() {
  const url = "http://localhost:3000/scenarios";
  const response = await fetch(url);
  const result = await response.json();
  all_Loaded_Scenarios = result;
}
async function LoadSelectedCampaignByID(id) {
  container.innerHTML = "";
  const selected_campaign = all_Loaded_Campaigns.find(
    (campaigns) => campaigns.id == id,
  );
  // Loop all scenarios and find all with a campaing ID matching our campaign ID
  const selected_scenarios = all_Loaded_Scenarios.filter(
    (scenarios) => scenarios.campaign_id == id,
  );
  // Fetches the relevant scenarios from our dictionary
  const select_Campaigns_Scenarios =
    campaign_Scenario_Dictonary[selected_campaign.name];

  // Loops through all scenarios in the campaign
  select_Campaigns_Scenarios.forEach((scenario) => {
    //Creates a div element to store the title of each scenario
    const newDiv = document.createElement("div");
    const newH1 = document.createElement("h1");
    let newContent = "";
    const played_Scenario = selected_scenarios.find(
      (scenario_played) => scenario_played.name == scenario,
    );
    if (played_Scenario == undefined) {
      newContent = document.createTextNode(scenario);
      newH1.appendChild(newContent);
      newDiv.classList = "bg-gray-200";
    } else {
      newContent = document.createTextNode(
        `${scenario} (Resolution ${played_Scenario.resolution})`,
      );
      newH1.appendChild(newContent);
      newDiv.classList = "bg-green-200";
      newDiv.addEventListener("click", (e) => {
        LoadSelectedScenarioByID(played_Scenario.id);
      });
    }

    newDiv.appendChild(newH1);
    container.appendChild(newDiv);
  });

  title.innerHTML = selected_campaign.name;
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
