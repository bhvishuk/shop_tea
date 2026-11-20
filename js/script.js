const tea = document.getElementById("tea");
const delivery = document.getElementById("delivery");

const teaPrice = document.getElementById("tea-price");
const deliveryPrice = document.getElementById("delivery-price");
const total = document.getElementById("total");

const weight30 = document.getElementById("weight30");
const weight50 = document.getElementById("weight50");
const weight100 = document.getElementById("weight100");

let selectedWeight = 100;

weight30.addEventListener('click', () => {
    selectedWeight = 30;
    const pricePer100 = Number(tea.value);
    const teaCost = pricePer100 * selectedWeight / 100;

    teaPrice.textContent = teaCost;

    const deliveryCost = Number(delivery.value);
    deliveryPrice.textContent = deliveryCost;
    total.textContent = teaCost + deliveryCost;
});

weight50.addEventListener('click', () => {
    selectedWeight = 50;
    const pricePer100 = Number(tea.value);
    const teaCost = pricePer100 * selectedWeight / 100;

    teaPrice.textContent = teaCost;

    const deliveryCost = Number(delivery.value);
    deliveryPrice.textContent = deliveryCost;
    total.textContent = teaCost + deliveryCost;
});

weight100.addEventListener('click', () => {
    selectedWeight = 100;
    const pricePer100 = Number(tea.value);
    const teaCost = pricePer100 * selectedWeight / 100;

    teaPrice.textContent = teaCost;

    const deliveryCost = Number(delivery.value);
    deliveryPrice.textContent = deliveryCost;
    total.textContent = teaCost + deliveryCost;
});

tea.addEventListener('change', () => {
    const pricePer100 = Number(tea.value);
    const teaCost = pricePer100 * selectedWeight / 100;

    teaPrice.textContent = teaCost;

    const deliveryCost = Number(delivery.value);
    deliveryPrice.textContent = deliveryCost;
    total.textContent = teaCost + deliveryCost;
});

delivery.addEventListener('change', () => {
    const pricePer100 = Number(tea.value);
    const teaCost = pricePer100 * selectedWeight / 100;

    teaPrice.textContent = teaCost;

    const deliveryCost = Number(delivery.value);
    deliveryPrice.textContent = deliveryCost;
    total.textContent = teaCost + deliveryCost;
});

