import { all_Loaded_Campaigns, all_Loaded_Scenarios } from "./main.js";
let loadedCampaign = "";
let loadedScenario = "";

const container = document.getElementById("scenarioDisplay");

// Dunwhich Legacy //
const dunwhich_Legacy_campaign = [
  "Extracurricular Activity",
  "The House Always Wins",
  "Armitage's Fate",
  "The Miskatonic Museum",
  "The Essex County Express",
  "Blood on the Altar",
  "The Survivors",
  "Undimensioned and Unseen",
  "Where Doom Awaits",
  "Lost in Time and Space",
];

function LoadCampaign(campaign) {
  container.innerHTML = "";
  loadedCampaign = campaign;
  campaign.forEach((scenario) => {
    html = `<div id="${scenario}"
        class="bg-gray-200 hover:bg-gray-400 text-black-700 font-semibold py-2 px-4 border border-black-500 rounded max-w-1/2 text-center"
      >
        ${scenario}
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });
}

//LoadCampaign(dunwhich_Legacy_campaign);
function EditScenario() {}
function AddScenario() {}
function LoadExtracurricularActivity() {}

export const campaign_Scenario_Dictonary = {
  "The Dunwich Legacy": dunwhich_Legacy_campaign,
};
