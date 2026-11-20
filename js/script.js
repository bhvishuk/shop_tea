
//    ДАННЫЕ: сборы
//    modes — для каких режимов сбор подходит (утро/день/вечер)
//    caffeine — содержит ли кофеин
//    prices — цена за фасовку (в рублях)

const TEAS = [
    {
        id: 'sunrise',
        name: 'Рассветный имбирь',
        desc: 'Имбирь, кардамон, корица, апельсиновая цедра. Мягкий старт без кофеина.',
        modes: ['morning'],
        caffeine: false,
        prices: { 30: 210, 50: 320, 100: 590 },
        tags: ['без кофеина', 'с пряностями']
    },
    {
        id: 'morning-green',
        name: 'Зелёное утро',
        desc: 'Зелёный чай с мятой и лимонником. Лёгкий кофеин для ясности.',
        modes: ['morning', 'day'],
        caffeine: true,
        prices: { 30: 190, 50: 290, 100: 540 },
        tags: ['с кофеином']
    },
    {
        id: 'balance',
        name: 'Дневной баланс',
        desc: 'Зелёный чай, жасмин, имбирь. Бодрость без резких скачков.',
        modes: ['day'],
        caffeine: true,
        prices: { 30: 200, 50: 310, 100: 570 },
        tags: ['с кофеином', 'с пряностями']
    },
    {
        id: 'chai',
        name: 'Пряный чай',
        desc: 'Чёрный чай, гвоздика, кардамон, перец. Согревает среди дня.',
        modes: ['morning', 'day'],
        caffeine: true,
        prices: { 30: 220, 50: 330, 100: 610 },
        tags: ['с кофеином', 'с пряностями']
    },
    {
        id: 'calm',
        name: 'Вечерний покой',
        desc: 'Ромашка, лаванда, мелисса. Успокаивает, готовит ко сну.',
        modes: ['evening'],
        caffeine: false,
        prices: { 30: 180, 50: 280, 100: 520 },
        tags: ['без кофеина']
    },
    {
        id: 'mint-night',
        name: 'Ночная мята',
        desc: 'Мята, мелисса, валериана. Мягкое завершение дня.',
        modes: ['evening'],
        caffeine: false,
        prices: { 30: 170, 50: 270, 100: 500 },
        tags: ['без кофеина']
    },
    {
        id: 'berry-eve',
        name: 'Ягодный вечер',
        desc: 'Шиповник, брусника, гибискус. Тёплый ягодный вкус без кофеина.',
        modes: ['evening'],
        caffeine: false,
        prices: { 30: 195, 50: 300, 100: 560 },
        tags: ['без кофеина']
    },
    {
        id: 'spice-day',
        name: 'Солнечные специи',
        desc: 'Куркума, имбирь, апельсин. Бодрящий пряный сбор для дня.',
        modes: ['morning', 'day'],
        caffeine: false,
        prices: { 30: 205, 50: 315, 100: 580 },
        tags: ['без кофеина', 'с пряностями']
    }
];

// состояние 1, 3 блооки
const state = {
    mode: 'morning',      // morning | day | evening
    noCaffeine: false,    // фильтр «без кофеина»
    sizes: {}             // { teaId: 30|50|100 }
};

// режим
function detectModeByHour() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'day';
    return 'evening';
}

// превью
const heroPreview = document.getElementById('heroPreview');

function renderHeroPreview() {
    const matches = TEAS.filter(t => t.modes.includes(state.mode)).slice(0, 3);
    heroPreview.innerHTML = matches.map(t => `
    <div class="preview-card">
      <div class="preview-card__badge">${modeLabel(state.mode)}</div>
      <div class="preview-card__name">${t.name}</div>
      <div class="preview-card__note">${t.desc.split('.')[0]}.</div>
    </div>
  `).join('');
}

function modeLabel(mode) {
    return { morning: 'Для утра', day: 'Для дня', evening: 'Для вечера' }[mode];
}

// каталог
const catalogGrid = document.getElementById('catalogGrid');

function renderCatalog() {
    // Сортируем: подходящие под режим — первыми
    const sorted = [...TEAS].sort((a, b) => {
        const aMatch = a.modes.includes(state.mode) ? 0 : 1;
        const bMatch = b.modes.includes(state.mode) ? 0 : 1;
        return aMatch - bMatch;
    });

    catalogGrid.innerHTML = sorted.map(tea => {
        const size = state.sizes[tea.id] || 50;
        const price = tea.prices[size];
        const price100 = Math.round((tea.prices[100] / 100) * 100);

        const isRecommended =
            tea.modes.includes(state.mode) &&
            (!state.noCaffeine || !tea.caffeine);

        const isDimmed =
            !tea.modes.includes(state.mode) ||
            (state.noCaffeine && tea.caffeine);

        const cls = isRecommended ? 'is-recommended' : (isDimmed ? 'is-dimmed' : '');

        return `
      <article class="tea-card ${cls}" data-id="${tea.id}">
        <div class="tea-card__badges">
          ${tea.tags.map(tag => `<span class="tea-card__badge">${tag}</span>`).join('')}
        </div>
        <h3 class="tea-card__name">${tea.name}</h3>
        <p class="tea-card__desc">${tea.desc}</p>

        <div class="tea-card__price-100">
          Цена за 100 г: <strong>${price100} ₽</strong>
        </div>

        <div class="tea-card__sizes">
          ${[30, 50, 100].map(s => `
            <button class="size-btn ${s === size ? 'is-active' : ''}"
                    data-size="${s}" data-id="${tea.id}">${s} г</button>
          `).join('')}
        </div>

        <div class="tea-card__total">
          ${price} ₽ <small>за ${size} г</small>
        </div>

        <button class="tea-card__add">В калькулятор</button>
      </article>
    `;
    }).join('');

    attachCatalogEvents();
}

// каталог события
function attachCatalogEvents() {
    // Смена фасовки
    catalogGrid.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const size = Number(btn.dataset.size);
            state.sizes[id] = size;
            renderCatalog();
        });
    });

    // Кнопка «В калькулятор» (заглушка — блок 4)
    catalogGrid.querySelectorAll('.tea-card__add').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.closest('.tea-card').dataset.id;
            console.log('В калькулятор:', id, 'фасовка:', state.sizes[id] || 50);
            btn.textContent = 'Добавлено ✓';
            setTimeout(() => { btn.textContent = 'В калькулятор'; }, 1200);
        });
    });
}

// переключатели
function setMode(mode) {
    state.mode = mode;
    document.body.dataset.mode = mode;
    document.getElementById('hero').dataset.mode = mode;
    document.getElementById('catalog').dataset.mode = mode;

    // Обновляем все кнопки-переключатели на странице
    document.querySelectorAll('.mode-switch__btn').forEach(btn => {
        const isActive = btn.dataset.mode === mode;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive);
    });

    renderHeroPreview();
    renderCatalog();
}

function initModeSwitch() {
    document.querySelectorAll('.mode-switch__btn').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
}

// фильтр для кофеина
function initFilter() {
    document.getElementById('noCaffeine').addEventListener('change', (e) => {
        state.noCaffeine = e.target.checked;
        renderCatalog();
    });
}

// блок 2
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// инициализация
document.addEventListener('DOMContentLoaded', () => {
    state.mode = detectModeByHour();
    document.body.dataset.mode = state.mode;

    initModeSwitch();
    initFilter();
    initReveal();
    setMode(state.mode); // рендер + синхронизация кнопок
});

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

