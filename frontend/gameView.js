const allGame = [
  "Arkham Horror: LCG",
  "Lord of the Rings: LCG",
  "Lost Ruins of Arnak",
  "Final Girl",
  "Mage Knight",
];

function createGameDisplay() {
  // Creates container object to store all games within
  const newContainer = document.createElement("div");
  const bodyElement = document.body;
  newContainer.classList = "grid grid-cols-4 gap-4  bg-sky-100";
  bodyElement.append(newContainer);
  // Loops through all games and creates a object to visalize of them
  allGame.forEach((game) => {
    const newDiv = document.createElement("div");
    newDiv.classList = "bg-gray-200 hover:bg-green-400 text-center";

    const newH1 = document.createElement("h1");
    const newContent = document.createTextNode(`${game}`);
    newH1.appendChild(newContent);

    newDiv.appendChild(newH1);
    newContainer.appendChild(newDiv);
  });
}

createGameDisplay();
