// Обґрунтування вибору фреймворку для Кроку 1:
// Обрано Vue 3, тому що він легко підключається через один CDN-тег без складної збірки,
// а також має зручні computed-властивості для автоматичного підрахунку денного бюджету.

console.log('script.js підключено');

// Початковий масив подорожей (додали унікальні id для атрибута :key у Vue)
const initialTrips = [
    {
        id: 1,
        destination: 'Париж, Франція', 
        startDay: '15.06.2026', 
        endDay: '22.06.2026', 
        days: 7, 
        budget: 1200, 
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/paris.jpg',
        imgAlt: 'Вид на Ейфелеву вежу ввечері'
    },
    {
        id: 2,
        destination: 'Рим, Італія', 
        startDay: '10.09.2026', 
        endDay: '18.09.2026', 
        days: 8, 
        budget: 1500, 
        status: '⏳ В процесі бронювання',
        badgeClass: 'badge--in-progress',
        imgSrc: 'assets/img/rome.jpg',
        imgAlt: 'Колізей у Римі під сонячним промінням'
    },
    {
        id: 3,
        destination: 'Барселона, Іспанія', 
        startDay: '05.10.2026', 
        endDay: '12.10.2026', 
        days: 7, 
        budget: 900, 
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/barcelona.jpg',
        imgAlt: 'Храм Святого Сімейства в Барселоні'
    },
    {
        id: 4,
        destination: 'Відень, Австрія', 
        startDay: '07.10.2026', 
        endDay: '09.10.2026', 
        days: 2, 
        budget: 750, 
        status: '✅ Завершено',
        badgeClass: 'badge--completed',
        imgSrc: 'assets/img/wien.jpg',
        imgAlt: 'Панорама Відня'
    }
];

// Допоміжна функція підрахунку для консолі з ПР6
const costPerDay = trip => Math.round(trip.budget / trip.days);

function processTrips(tripList) {
    console.log(' Список подорожей: ');
    for (const trip of tripList) {
        let category = trip.budget < 1000 ? 'дешева' : 'дорога';
        const dailyCost = costPerDay(trip);
        console.log(
            `Куди: ${trip.destination} | Тривалість: ${trip.days} днів. ` +
            `Загальний бюджет: $${trip.budget} (${category}) | ` +
            `Витрати на день: ~$${dailyCost}`
        );
    }
}
processTrips(initialTrips);


// ====================== КРОК 7: ЗАКОМЕНТОВАНО СТАРИЙ DOM-КОД ======================
/*
 Тут раніше були функції з ПР7 (renderTrips та totalTrips).
 Ми їх повністю закоментували за Кроком 7, тому що ручний рендер через DOM API
 (createElement, append, innerHTML) більше не потрібен — за це тепер повністю відповідає Vue 3.

const listContainer = document.querySelector('#trips #cards');

function renderTrips(tripsList) {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    tripsList.forEach(trip => {
        const card = document.createElement('article');
        const nameOfTrip = document.createElement('h3');
        nameOfTrip.textContent = trip.destination;

        const imgOfTrip = document.createElement('img');
        imgOfTrip.src = trip.imgSrc;
        imgOfTrip.alt = trip.imgAlt;
        const infoOfTrip = document.createElement('p');

        if (trip.isApiData) {
            infoOfTrip.innerHTML = `Столиця: <strong>${trip.capital}</strong><br>Населення: <strong>${trip.population.toLocaleString('uk-UA')}</strong> осіб`;
        } else {
            infoOfTrip.textContent = `Дати: ${trip.startDay} – ${trip.endDay} (${trip.days} днів, €${trip.budget})`;
        }

        const statusBadge = document.createElement('span');
        statusBadge.classList.add('badge', trip.badgeClass);
        statusBadge.textContent = trip.status;

        if (trip.budget) {
            const dailyCost = costPerDay(trip);
            card.dataset.costPerDay = dailyCost;
            card.classList.add(trip.budget < 1000 ? 'budget' : 'expensive');
        }

        card.append(nameOfTrip, imgOfTrip, infoOfTrip, statusBadge);
        listContainer.append(card);
    });
}

function totalTrips(tripsList) {
    const allTrips = document.querySelector('.page-layout #trips-count');
    if (allTrips) {
        allTrips.textContent = `Всього подорожей: ${tripsList.length}`;
    }
}

renderTrips(initialTrips);
totalTrips(initialTrips);
*/


// ===================== ПРАКТИКУМ №8: ВАЛІДАЦІЯ ФОРМИ ============================
// Живий перерахунок скільки днів триває поїздка і який денний бюджет у формі
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const budgetInput = document.querySelector("#budget");
const calculatedDaysVal = document.querySelector("#calculated-days-val");
const dailyBudgetVal = document.querySelector("#daily-budget-val");

function updateTripMetrics() {
    if (!startDateInput || !endDateInput || !budgetInput) return;
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = Number(budgetInput.value);

    if (startVal && endVal) {
        const start = new Date(startVal);
        const end = new Date(endVal);

        if (end < start) {
            endDateInput.setCustomValidity("Дата завершення не може бути раніше дати початку!");
            if (calculatedDaysVal) calculatedDaysVal.textContent = "0";
            if (dailyBudgetVal) dailyBudgetVal.textContent = "0";
            return;
        } else {
            endDateInput.setCustomValidity("");
        }

        const diffInMs = end - start;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1; 

        if (calculatedDaysVal) calculatedDaysVal.textContent = diffInDays;

        if (budgetVal > 0) {
            const dailyCost = Math.round(budgetVal / diffInDays);
            if (dailyBudgetVal) dailyBudgetVal.textContent = dailyCost;

            if (dailyCost < 20) {
                budgetInput.setCustomValidity("Бюджет на день занадто малий (менше 20€/день)!");
            } else {
                budgetInput.setCustomValidity("");
            }
        } else {
            if (dailyBudgetVal) dailyBudgetVal.textContent = "0";
            budgetInput.setCustomValidity("");
        }
    } else {
        if (calculatedDaysVal) calculatedDaysVal.textContent = "0";
        if (dailyBudgetVal) dailyBudgetVal.textContent = "0";
    }
}

if (startDateInput) startDateInput.addEventListener("input", updateTripMetrics);
if (endDateInput) endDateInput.addEventListener("input", updateTripMetrics);
if (budgetInput) budgetInput.addEventListener("input", updateTripMetrics);


// ================= ПРАКТИЧНА РОБОТА №10 (ГОЛОВНИЙ ВУК-КОД) =================

// Крок 4: Створили окремий компонент картки TripCard
const TripCard = {
    // Всі дані приймаємо зверху через props
    props: {
        destination: String,
        days: Number,
        budget: Number,
        startDay: String,
        endDay: String,
        status: String,
        badgeClass: String,
        imgSrc: String,
        imgAlt: String,
        isApiData: Boolean,
        capital: String,
        population: Number
    },
    // Оголошуємо подію, яку компонент віддає батькові при кліку
    emits: ['select-trip'],
    
    // Вимога варіанта №10: Похідне значення costPerDay (витрати на день = бюджет / дні)
    // Воно рахується на льоту й автоматично оновлюється при зміні бюджету чи днів
    computed: {
        costPerDay() {
            if (!this.days || this.days <= 0) return 0;
            return Math.round(this.budget / this.days);
        }
    },
    
    // Шаблон картки: HTML описуємо декларативно без жодних document.createElement
    template: `
        <article class="card" :class="budget ? (budget < 1000 ? 'budget' : 'expensive') : ''" @click="$emit('select-trip')">
            <h3>{{ destination }}</h3>
            <img v-if="imgSrc" :src="imgSrc" :alt="imgAlt || destination">
            
            <p v-if="isApiData">
                Столиця: <strong>{{ capital }}</strong><br>
                Населення: <strong>{{ population ? population.toLocaleString('uk-UA') : 0 }}</strong> осіб
            </p>
            <p v-else>
                Дати: {{ startDay }} – {{ endDay }} ({{ days }} днів, €{{ budget }})<br>
                <small>Витрати на день: ~€{{ costPerDay }}</small>
            </p>

            <span class="badge" :class="badgeClass">{{ status }}</span>
        </article>
    `
};

// Створюємо головний Vue-додаток
const app = Vue.createApp({
    components: {
        TripCard
    },
    // Крок 3: Наші дані тепер живуть у реактивному стані Vue (data)
    data() {
        return {
            trips: initialTrips,
            selectedTrip: null
        };
    },
    methods: {
        // Крок 6: Інтерактивна дія — зберігаємо обрану картку для блоку деталей
        selectTrip(trip) {
            this.selectedTrip = trip;
        },
        // Методи для додавання елементів у реактивний масив
        addTripFromForm(newTrip) {
            this.trips.push(newTrip);
        },
        addTripFromApi(apiTrip) {
            this.trips.unshift(apiTrip);
        }
    }
});

// Монтуємо Vue до головного елемента #app в HTML
const vm = app.mount('#app');


// ================= ЗВ'ЯЗОК ФОРМИ З ВУ-СТАНОМ (ПР8 + ПР10) =================

const travelForm = document.querySelector('#travel-form');
const destinationInput = document.querySelector('#destination');

if (travelForm) {
    travelForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const startParts = startDateInput.value.split('-');
        const endParts = endDateInput.value.split('-');

        const formattedStart = `${startParts[2]}.${startParts[1]}.${startParts[0]}`;
        const formattedEnd = `${endParts[2]}.${endParts[1]}.${endParts[0]}`;

        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const newTrip = {
            id: Date.now(), // Унікальний ID для ключа Vue :key
            destination: destinationInput.value.trim(),
            startDay: formattedStart,
            endDay: formattedEnd,
            days: daysCount,
            budget: Number(budgetInput.value),
            status: '✈️ Заплановано',
            badgeClass: 'badge--planned',
            imgSrc: 'assets/img/barcelona.jpg',
            imgAlt: destinationInput.value.trim()
        };

        // Замість renderTrips() просто додаємо об'єкт у реактивний масив Vue.
        // Vue сам побачить зміну й моментально намалює нову картку в HTML!
        vm.addTripFromForm(newTrip);

        travelForm.reset();
        if (calculatedDaysVal) calculatedDaysVal.textContent = '0';
        if (dailyBudgetVal) dailyBudgetVal.textContent = '0';
    });
}


// ================= ЗВ'ЯЗОК API З ВУ-СТАНОМ (ПР9 + ПР10) =================

const REST_COUNTRIES_API_URL = 'https://restcountries.com/v3.1/name/';

const apiControlsWrapper = document.createElement('div');
apiControlsWrapper.className = 'api-controls-container';
apiControlsWrapper.style.cssText = 'margin: 15px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;';

apiControlsWrapper.innerHTML = `
    <h3 style="margin-top: 0; color: #0056b3;">Пошук інформації про країну (REST Countries API)</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
        <input type="text" id="api-country-input" placeholder="Введіть назву країни англійською (наприклад: France, Ukraine, Japan)" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        <button type="button" id="api-fetch-btn" style="padding: 8px 15px; background-color: #008080; color: white; border: none; border-radius: 4px; cursor: pointer;">Завантажити країну</button>
        <button type="button" id="api-refresh-btn" style="padding: 8px 15px; background-color: #008080; color: white; border: none; border-radius: 4px; cursor: pointer;">Оновити</button>
    </div>
    <div id="api-loading-state" style="display: none; color: #0056b3; font-weight: bold; margin: 5px 0;">
        ⏳ Завантаження даних з сервера...
    </div>
    <div id="api-error-display" style="display: none; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin: 5px 0;">
    </div>
`;

const tripsSectionContainer = document.querySelector('#trips');
const cardsDiv = document.querySelector('#cards');
if (tripsSectionContainer && cardsDiv) {
    tripsSectionContainer.insertBefore(apiControlsWrapper, cardsDiv);
}

const apiCountryInput = apiControlsWrapper.querySelector('#api-country-input');
const apiFetchBtn = apiControlsWrapper.querySelector('#api-fetch-btn');
const apiRefreshBtn = apiControlsWrapper.querySelector('#api-refresh-btn');
const apiLoadingState = apiControlsWrapper.querySelector('#api-loading-state');
const apiErrorDisplay = apiControlsWrapper.querySelector('#api-error-display');

function setApiLoading(isLoading) {
    if (isLoading) {
        if (apiLoadingState) apiLoadingState.style.display = 'block';
        if (apiFetchBtn) apiFetchBtn.disabled = true;
        if (apiRefreshBtn) apiRefreshBtn.disabled = true;
        clearApiError();
    } else {
        if (apiLoadingState) apiLoadingState.style.display = 'none';
        if (apiFetchBtn) apiFetchBtn.disabled = false;
        if (apiRefreshBtn) apiRefreshBtn.disabled = false;
    }
}

function displayApiError(message) {
    if (apiErrorDisplay) {
        apiErrorDisplay.textContent = message;
        apiErrorDisplay.style.display = 'block';
    }
}

function clearApiError() {
    if (apiErrorDisplay) {
        apiErrorDisplay.textContent = '';
        apiErrorDisplay.style.display = 'none';
    }
}

async function loadCountryData() {
    const searchQuery = apiCountryInput ? apiCountryInput.value.trim() : '';

    if (!searchQuery) {
        displayApiError('Будь ласка, введіть назву країни англійською мовою.');
        return;
    }

    setApiLoading(true);

    try {
        const response = await fetch(`${REST_COUNTRIES_API_URL}${encodeURIComponent(searchQuery)}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Країну не знайдено, перевірте написання.');
            }
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Країну не знайдено, перевірте написання.');
        }

        const country = data[0];

        const countryCardData = {
            id: Date.now(),
            destination: country.name?.common || searchQuery,
            capital: (country.capital && country.capital.length > 0) ? country.capital[0] : 'Не вказано',
            population: country.population ? country.population : 0,
            imgSrc: country.flags?.png || country.flags?.svg || '',
            imgAlt: `Прапор ${country.name?.common || searchQuery}`,
            status: '🌐 Дані з API',
            badgeClass: 'badge--planned',
            isApiData: true
        };

        // Замість ручної вставки елементів через DOM додаємо відповідь з API у Vue-стан
        vm.addTripFromApi(countryCardData);

    } catch (error) {
        console.error('Помилка під час виконання fetch-запиту:', error);

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            try {
                const fallbackResponse = await fetch(`https://countries-api-ab2f.onrender.com/countries?search=${encodeURIComponent(searchQuery)}`);
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    const list = Array.isArray(fallbackData) ? fallbackData : (fallbackData.data || []);
                    if (list.length > 0) {
                        const country = list[0];
                        const countryCardData = {
                            id: Date.now(),
                            destination: country.name?.common || country.name || searchQuery,
                            capital: Array.isArray(country.capital) ? country.capital[0] : (country.capital || 'Не вказано'),
                            population: country.population || 0,
                            imgSrc: country.flags?.png || country.flags?.svg || country.flag || '',
                            imgAlt: `Прапор ${country.name?.common || searchQuery}`,
                            status: '🌐 Дані з API',
                            badgeClass: 'badge--planned',
                            isApiData: true
                        };
                        
                        vm.addTripFromApi(countryCardData);
                        return;
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
            
            if (!navigator.onLine) {
                displayApiError('Не вдалося завантажити дані. Перевірте з\'єднання з інтернетом.');
            } else {
                displayApiError('Помилка завантаження даних від сервера API.');
            }
        } else {
            displayApiError(error.message);
        }
    } finally {
        setApiLoading(false);
    }
}

if (apiFetchBtn) apiFetchBtn.addEventListener('click', loadCountryData);
if (apiRefreshBtn) apiRefreshBtn.addEventListener('click', loadCountryData);

if (apiCountryInput) {
    apiCountryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            loadCountryData();
        }
    });
}