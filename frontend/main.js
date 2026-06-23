let all_Loaded_Campaigns = {};
let all_Loaded_Scenarios = {};

const container = document.getElementById("campaignDisplay");
const title = document.getElementById("pageTitle");

LoadAllCampaigns();
LoadAllScenarios();
async function LoadAllCampaigns() {
  const url = "http://localhost:3000/campaigns";
  const response = await fetch(url);
  const result = await response.json();

  result.forEach((campaign) => {
    html = ` <div onClick="LoadSelectedCampaignByID(${campaign.id})" class="grid grid-rows-3">
        <h1>${campaign.name}</h1>
        <p id="start_date">Start Date: ${campaign.start_date}</p>
        <p id="status">Status: ${campaign.status}</p>
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });
  all_Loaded_Campaigns = result;
}
async function LoadAllScenarios() {
  const url = "http://localhost:3000/scenarios";
  const response = await fetch(url);
  const result = await response.json();
  all_Loaded_Scenarios = result;
  console.log(all_Loaded_Scenarios);
}
async function LoadSelectedCampaignByID(id) {
  campaign = all_Loaded_Campaigns.find((campaigns) => campaigns.id == id);
  // Loop all scenarios and find all with a campaing ID matching our campaign ID
  scenario = all_Loaded_Scenarios.filter(
    (scenarios) => scenarios.campaign_id == id,
  );

  container.innerHTML = "";
  scenario.forEach((scenario) => {
    html = `<div><h1>[${scenario.scenario_order}]${scenario.name} (Resolution:${scenario.resolution})</h1></div>`;
    container.insertAdjacentHTML("beforeend", html);
  });

  title.innerHTML = campaign.name;
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
