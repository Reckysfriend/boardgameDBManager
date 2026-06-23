let selected_ID = "";
let all_Loaded_Campaigns = {};
const container = document.getElementById("campaignDisplay");
const title = document.getElementById("pageTitle");

const url = "http://localhost:3000/campaigns";
const response = fetch(url)
  .then((result) => result.json())
  .then((result) => LoadAllCampaigns(result));

async function LoadAllCampaigns(result) {
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

function LoadSelectedCampaignByID(id) {
  campaign = all_Loaded_Campaigns.find((campaigns) => campaigns.id == id);
  container.innerHTML = "";
  title.innerHTML = campaign.name;
}
async function test_request_get() {
  const url = `${url}sql`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reponse status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

//test_request_get();

const form = document.querySelector("#test_form");
console.log(form);
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

  console.log(response);
  const res_message = await response.text();
  console.log(res_message);
}
/*
form.addEventListener("submit", (event) => {
  event.preventDefault();
  test_request_post_form();
});
*/
