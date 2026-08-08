const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#b1");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}


const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = 1;
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  const URL = `${BASE_URL}/${from}.json`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    const rate = data[from][to];

    if (!rate) {
      msg.innerText = "Currency not found!";
      return;
    }

    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Unable to fetch exchange rate!";
  }
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};


btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});


window.addEventListener("load", () => {
  updateExchangeRate();
});