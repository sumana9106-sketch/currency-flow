const BASE_URL = "https://v6.exchangerate-api.com/v6/c5e162cef191067c547426b9/pair/EUR/GBP";
const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");
const exbtn = document.querySelector("#exchange");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");
let rate = 0;
let finalAmount = 0;

for (let select of dropdowns){
    for(let currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }else if(select.name === "to" && currCode === "INR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt)=>{
        updateFlag(evt.target);
    });
}
const updateFlag = (element)=>{
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};
const updateExchangeRate = async()=>{
    let amount = document.querySelector(".amount input");
    let amountValue = amount.value;
    if(amountValue === "" || amountValue< 1){
        amountValue = 1;
        amount.value = "1";
    };

    const URL = `https://v6.exchangerate-api.com/v6/c5e162cef191067c547426b9/pair/${fromCurr.value}/${toCurr.value}`;
    let response = await fetch(URL);
    let data = await response.json();
    rate = data.conversion_rate;
    finalAmount = amount.value * rate;
    msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

}

const exchangeElement =async()=>{
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    await updateExchangeRate();
}

btn.addEventListener("click", async(evt)=>{
    evt.preventDefault();
    msg.textContent = "Fetching exchange rate, please wait...";
    updateExchangeRate();
});


window.addEventListener("load",()=>{
    updateExchangeRate();
})

exbtn.addEventListener("click",()=>{
    exchangeElement();
})