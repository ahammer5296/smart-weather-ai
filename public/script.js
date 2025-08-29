document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const geolocationButton = document.getElementById('geolocation-button');
    const cityNameElement = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temperatureElement = document.getElementById('temperature');
    const weatherDescriptionElement = document.getElementById('weather-description');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    const pressureElement = document.getElementById('pressure');
    const visibilityElement = document.getElementById('visibility');
    const cloudsElement = document.getElementById('clouds');
    const uvIndexElement = document.getElementById('uv-index');
    const aiAdviceElement = document.getElementById('ai-advice');
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');
    const logOutput = document.getElementById('log-output');
    const citySuggestions = document.getElementById('city-suggestions');
    const hourlyChartCanvas = document.getElementById('hourly-chart').getContext('2d');
    const dailyChartCanvas = document.getElementById('daily-chart').getContext('2d');

    let hourlyChart;
    let dailyChart;

    let isFetchingAIAdvice = false; // Флаг для предотвращения повторных вызовов fetchAIAdvice

    const HUMOROUS_STARTS = [
        "Погода сегодня...", "Ну что, народ, сегодня...", "А вот и не...", "Снова эти...", "Как говорится...",
        "Только посмотрите на...", "Небесная канцелярия решила...", "Короче, ребзя...", "Слыхали новость?",
        "Готовьте валенки, потому что...", "Если верить приметам, то...", "В общем, такое...",
        "На улице творится...", "А у вас так бывало, что...", "Лайк, если у вас тоже...",
        "Только без обид, но...", "Жду ваши варианты в комментах, а пока...", "Подпишись, если не хочешь пропустить...",
        "Это шедевр просто, когда...", "Я в ахуе с того, что...", "Смешно до слёз, когда...",
        "Просто нет слов, одни...", "Как сказал классик...", "А помните, как в детстве...",
        "Ну что, погнали...", "Доброе утро (день/ночь), а у нас тут...", "И снова здравствуйте, и...",
        "Внимание, прогноз!", "Специально для вас...", "Не благодарите, но...", "Как бы сказал Гаррис...",
        "Джордж бы точно сказал, что...", "Джей бы, наверное, заметил...", "А вот и...",
        "Снова вы...", "Вот так вот...", "Понеслась...", "Ну что, народ?", "Доброе утро (ночь/день)..."
    ];

    const HUMOROUS_MIDDLES = [
        "как всегда, преподносит сюрпризы", "решила устроить нам", "выглядит так, будто", "напоминает мне о",
        "словно сошла со страниц", "словно сбежала из", "словно намекает нам на", "заставляет задуматься о",
        "вызывает ассоциации с", "как будто кто-то перепутал", "словно забыла, что на дворе",
        "словно пытается нас", "как будто решила, что сегодня", "словно говорит нам",
        "намекает, что пора", "заставляет вспомнить о", "словно издевается над",
        "словно испытывает на прочность", "словно проверяет, готовы ли мы к", "словно говорит: 'А вот и...",
        "словно шепчет на ухо", "словно кричит во все горло", "словно подмигивает нам",
        "словно намекает на то, что", "словно говорит: 'Ребзя, сегодня...", "словно спрашивает: 'А вы готовы к...",
        "словно предупреждает о", "словно дразнит нас", "словно играет с нами в",
        "словно говорит: 'Держитесь, сейчас будет...", "словно намекает, что это",
        "словно напоминает нам, что жизнь - это", "словно говорит: 'Не ждали?'",
        "словно спрашивает: 'А что вы хотели?'", "словно говорит: 'Приготовьтесь к...'",
        "словно намекает, что это только начало", "словно говорит: 'Сейчас будет весело'",
        "словно спрашивает: 'Кто понял, тот понял?'", "словно говорит: 'Только без обид, но...'"
    ];

    const HUMOROUS_ENDS = [
        ", так что держитесь! 😂", ", а у вас так было? 🥲", ", кто понял, тот понял. 💀",
        ", лайк, если согласен! ♥️", ", жду ваши варианты в комментах! 🤝", ", подпишись, если не хочешь пропустить! 😳",
        ", это шедевр просто! 💀", ", я в ахуе с происходящего! 😳", ", смешно до слёз! 😭",
        ", просто нет слов! 💀", ", как сказал классик: '...'. 🧐", ", а помните, как в детстве...? 🥲",
        ", ну что, погнали? 😂", ", доброе утро (день/ночь)! 🌞", ", и снова здравствуйте! 👋",
        ", внимание, прогноз! 🚨", ", специально для вас! 🎁", ", не благодарите! 🙏",
        ", как бы сказал Гаррис: '...'. 🧐", ", Джордж бы точно сказал: '...'. 🎩",
        ", Джей бы, наверное, заметил: '...'. 😉", ", а вот и нет! 😂", ", снова вы! 👋",
        ", вот так вот! 🤷", ", понеслась! 🚀", ", ну что, народ? 🧑‍🤝‍🧑",
        ", доброе утро (ночь/день)! 🌞", ", и снова здравствуйте! 👋", ", внимание, прогноз! 🚨",
        ", специально для вас! 🎁", ", не благодарите! 🙏", ", как бы сказал Гаррис: '...'. 🧐",
        ", Джордж бы точно сказал: '...'. 🎩", ", Джей бы, наверное, заметил: '...'. 😉"
    ];

    const WEATHERAPI_KEY = 'a3306185ebb44865923194249252908'; // Замените на ваш ключ WeatherAPI.com

    // Функция для логирования сообщений
    function logMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
        console.log(formattedMessage); // Всегда логируем в консоль

        if (typeof DEBUG_MODE !== 'undefined' && DEBUG_MODE) {
            logOutput.textContent += formattedMessage + '\n';
            logOutput.scrollTop = logOutput.scrollHeight; // Прокрутка вниз
        }
    }

    // Функция для отображения сообщений об ошибках
    function displayError(message) {
        logMessage(`ОШИБКА: ${message}`, 'error');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Функция для скрытия сообщений об ошибках
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Функция для отображения лоадера
    function showLoader() {
        loader.style.display = 'block';
    }

    // Функция для скрытия лоадера
    function hideLoader() {
        loader.style.display = 'none';
    }

    // Функция для обновления фона в зависимости от погоды
    function updateBackground(weatherCondition, isDay) {
        const body = document.body;
        body.className = ''; // Сбросить все классы
        if (!isDay) {
            body.classList.add('weather-night');
            return;
        }
        switch (weatherCondition.toLowerCase()) {
            case 'clear':
                body.classList.add('weather-clear');
                break;
            case 'clouds':
                body.classList.add('weather-clouds');
                break;
            case 'rain':
            case 'drizzle':
                body.classList.add('weather-rain');
                break;
            case 'snow':
                body.classList.add('weather-snow');
                break;
            case 'thunderstorm':
                body.classList.add('weather-thunderstorm');
                break;
            case 'mist':
            case 'fog':
            case 'haze':
                body.classList.add('weather-mist');
                break;
            default:
                body.classList.add('weather-clear'); // По умолчанию
        }
    }

    // Функция для получения данных о погоде
    async function fetchWeather(query, type = 'city') {
        hideError();
        showLoader();
        logMessage(`Начало запроса погоды для: ${JSON.stringify(query)} (тип: ${type})`);
        try {
            let url;
            const daysForecast = 3; // Для бесплатного плана WeatherAPI.com
            if (type === 'city') {
                url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${query}&days=${daysForecast}&lang=ru&aqi=no`;
            } else if (type === 'coords') {
                url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${query.latitude},${query.longitude}&days=${daysForecast}&lang=ru&aqi=no`;
            } else {
                throw new Error('Неверный тип запроса погоды.');
            }
            logMessage(`URL запроса WeatherAPI.com: ${url}`);

            const response = await fetch(url);
            logMessage(`Ответ WeatherAPI.com статус: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorData = await response.json();
                logMessage(`Ошибка WeatherAPI.com: ${JSON.stringify(errorData)}`, 'error');
                throw new Error(`Ошибка WeatherAPI.com: ${response.statusText}`);
            }
            const data = await response.json();
            logMessage('Данные WeatherAPI.com получены:', 'debug');
            // logMessage(JSON.stringify(data, null, 2), 'debug'); // Для полного лога данных

            displayWeather(data);
            updateCharts(data); // Обновить графики
            logMessage('Вызов fetchAIAdvice из fetchWeather.', 'debug');
            fetchAIAdvice(data); // Получить рекомендации AI
        } catch (error) {
            displayError(error.message);
            logMessage(`Критическая ошибка при получении данных о погоде: ${error.message}`, 'error');
        } finally {
            hideLoader();
            logMessage('Запрос погоды завершен.');
        }
    }

    // Функция для отображения данных о погоде
    function displayWeather(data) {
        const current = data.current;
        const location = data.location;
        // const forecastDay = data.forecast.forecastday[0].day; // Не используется напрямую здесь

        const isDay = current.is_day === 1;
        cityNameElement.textContent = location.name;
        weatherIcon.src = `https:${current.condition.icon}`;
        temperatureElement.textContent = `${Math.round(current.temp_c)}°C`;
        weatherDescriptionElement.textContent = current.condition.text;
        humidityElement.textContent = `${current.humidity}%`;
        windSpeedElement.textContent = `${current.wind_kph} км/ч`;
        pressureElement.textContent = `${current.pressure_mb} мбар`;
        visibilityElement.textContent = `${current.vis_km} км`;
        cloudsElement.textContent = `${current.cloud}%`;
        uvIndexElement.textContent = `${current.uv}`;

        updateBackground(current.condition.text, isDay);
    }

    // Функция для обновления графиков
    function updateCharts(data) {
        const hourlyData = data.forecast.forecastday[0].hour;
        const dailyForecast = data.forecast.forecastday;

        // Почасовой график температуры
        const hourlyLabels = hourlyData.map(hour => new Date(hour.time_epoch * 1000).getHours() + ':00');
        const hourlyTemps = hourlyData.map(hour => hour.temp_c);
        const hourlyPrecip = hourlyData.map(hour => hour.precip_mm);

        if (hourlyChart) {
            hourlyChart.destroy();
        }
        hourlyChart = new Chart(hourlyChartCanvas, {
            type: 'line',
            data: {
                labels: hourlyLabels,
                datasets: [{
                    label: 'Температура (°C)',
                    data: hourlyTemps,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    yAxisID: 'temperature'
                },
                {
                    label: 'Осадки (мм)',
                    data: hourlyPrecip,
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1,
                    yAxisID: 'precipitation'
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                scales: {
                    temperature: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Температура (°C)'
                        }
                    },
                    precipitation: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Осадки (мм)'
                        },
                        grid: {
                            drawOnChartArea: false, // Только для правой оси
                        },
                    }
                }
            }
        });

        // Помидневный график температуры
        const dailyLabels = dailyForecast.map(day => new Date(day.date_epoch * 1000).toLocaleDateString('ru-RU', { weekday: 'short' }));
        const dailyMaxTemps = dailyForecast.map(day => day.day.maxtemp_c);
        const dailyMinTemps = dailyForecast.map(day => day.day.mintemp_c);

        if (dailyChart) {
            dailyChart.destroy();
        }
        dailyChart = new Chart(dailyChartCanvas, {
            type: 'bar',
            data: {
                labels: dailyLabels,
                datasets: [{
                    label: 'Макс. температура (°C)',
                    data: dailyMaxTemps,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }, {
                    label: 'Мин. температура (°C)',
                    data: dailyMinTemps,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Температура (°C)'
                        }
                    }
                }
            }
        });
    }

    // Функция для получения предложений городов
    async function fetchCitySuggestions(query) {
        if (query.length < 2) {
            citySuggestions.innerHTML = '';
            return;
        }
        logMessage(`Запрос предложений городов для: "${query}"`);
        try {
            const url = `https://api.weatherapi.com/v1/search.json?key=${WEATHERAPI_KEY}&q=${query}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка при получении предложений городов: ${response.statusText}`);
            }
            const data = await response.json();
            logMessage('Предложения городов получены:', 'debug');
            // logMessage(JSON.stringify(data, null, 2), 'debug');

            citySuggestions.innerHTML = ''; // Очистить предыдущие предложения
            data.slice(0, 20).forEach(city => { // Ограничить до 20 городов
                const option = document.createElement('option');
                option.value = `${city.name}, ${city.country}`;
                citySuggestions.appendChild(option);
            });
        } catch (error) {
            logMessage(`Ошибка при получении предложений городов: ${error.message}`, 'error');
        }
    }

    // Асинхронная функция для эффекта печатающегося текста
    async function typeWriterEffect(element, text, speed) {
        element.textContent = ''; // Очищаем элемент перед началом печати
        let i = 0;
        return new Promise(resolve => {
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    resolve();
                }
            }, speed);
        });
    }

    // Функция для генерации комбинированных юмористических сообщений
    function generateCombinedHumorousMessage() {
        const start = HUMOROUS_STARTS[Math.floor(Math.random() * HUMOROUS_STARTS.length)];
        const middle = HUMOROUS_MIDDLES[Math.floor(Math.random() * HUMOROUS_MIDDLES.length)];
        const end = HUMOROUS_ENDS[Math.floor(Math.random() * HUMOROUS_ENDS.length)];
        return `${start} ${middle}${end}`;
    }

    // Функция для получения рекомендаций AI
    async function fetchAIAdvice(weatherData) {
        logMessage('fetchAIAdvice: Функция вызвана.', 'debug');

        if (isFetchingAIAdvice) {
            logMessage('fetchAIAdvice: Предыдущий запрос еще не завершен, выход.', 'warn');
            return;
        }
        isFetchingAIAdvice = true;

        let currentTypingIntervalId; // Для отслеживания текущего интервала печати
        let intervalId; // Для смены сообщений

        const startTypingHumorousMessage = async () => {
            if (currentTypingIntervalId) {
                clearInterval(currentTypingIntervalId); // Очищаем предыдущий интервал, если он есть
            }

            const messageToType = generateCombinedHumorousMessage();
            const typingSpeed = 2000 / messageToType.length; // Распределяем 2 секунды на всю фразу

            aiAdviceElement.textContent = ''; // Очищаем перед новой фразой
            let i = 0;
            currentTypingIntervalId = setInterval(() => {
                if (i < messageToType.length) {
                    aiAdviceElement.textContent += messageToType.charAt(i);
                    i++;
                } else {
                    clearInterval(currentTypingIntervalId);
                    currentTypingIntervalId = null; // Сбрасываем ID
                }
            }, typingSpeed);
        };

        startTypingHumorousMessage(); // Показать первое сообщение сразу
        intervalId = setInterval(startTypingHumorousMessage, 3000); // Меняем сообщение каждые 3 секунды

        logMessage('Начало запроса рекомендаций AI.');
        try {
            const current = weatherData.current;
            const prompt = `Ну что, народ? Погода сегодня — это просто жесть! 😂 У нас тут: ${Math.round(current.temp_c)}°C, ощущается как ${Math.round(current.feelslike_c)}°C, ${current.condition.text}, ветер ${current.wind_kph} км/ч. Если вы не Гаррис, который вечно что-то забывает, то маст хэв — это зонт и хорошее настроение. А у вас так было? 💀`;
            logMessage(`Промпт для Gemini: ${prompt}`, 'debug');

            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            logMessage(`Ответ прокси-сервера (Gemini) статус: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorData = await response.json();
                logMessage(`Ошибка от прокси-сервера (Gemini): ${JSON.stringify(errorData)}`, 'error');
                throw new Error(`Ошибка AI: ${response.statusText}`);
            }

            const data = await response.json();
            logMessage('Данные AI получены:', 'debug');
            logMessage(JSON.stringify(data, null, 2), 'debug'); // Для полного лога данных

            clearInterval(intervalId); // Останавливаем смену сообщений
            if (currentTypingIntervalId) {
                clearInterval(currentTypingIntervalId); // Останавливаем текущую печать
            }
            // Быстрый вывод окончательной рекомендации
            setTimeout(() => {
                aiAdviceElement.textContent = data.text;
            }, 300); // Задержка 0.3 секунды для быстрого вывода
        } catch (error) {
            clearInterval(intervalId); // Останавливаем смену сообщений
            if (currentTypingIntervalId) {
                clearInterval(currentTypingIntervalId); // Останавливаем текущую печать
            }
            aiAdviceElement.textContent = `Не удалось получить рекомендации AI. ${error.message}`; // Отображаем конкретную ошибку
            logMessage(`Критическая ошибка при получении рекомендаций AI: ${error.message}`, 'error');
        } finally {
            isFetchingAIAdvice = false; // Сбрасываем флаг
            logMessage('Запрос рекомендаций AI завершен.');
        }
    }

    // Обработчик поля ввода для автодополнения
    cityInput.addEventListener('input', () => {
        const query = cityInput.value.trim();
        fetchCitySuggestions(query);
    });

    // Обработчик кнопки поиска
    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        logMessage(`Нажата кнопка "Найти". Введен город: "${city}"`);
        if (city) {
            fetchWeather(city);
        } else {
            displayError('Пожалуйста, введите название города.');
            logMessage('Поле ввода города пустое.', 'warn');
        }
    });

    // Обработчик кнопки геолокации
    geolocationButton.addEventListener('click', () => {
        logMessage('Нажата кнопка "Моё местоположение".');
        if (navigator.geolocation) {
            showLoader();
            logMessage('Запрос текущего местоположения...');
            navigator.geolocation.getCurrentPosition(
                position => {
                    hideLoader();
                    const { latitude, longitude } = position.coords;
                    logMessage(`Местоположение получено: Широта ${latitude}, Долгота ${longitude}`);
                    fetchWeather({ latitude, longitude }, 'coords');
                },
                error => {
                    hideLoader();
                    displayError('Не удалось определить ваше местоположение. ' + error.message);
                    logMessage(`Ошибка геолокации: ${error.message}`, 'error');
                }
            );
        } else {
            displayError('Геолокация не поддерживается вашим браузером.');
            logMessage('Геолокация не поддерживается браузером.', 'warn');
        }
    });

    // Загрузка погоды по умолчанию при загрузке страницы (например, для Москвы)
    logMessage('Загрузка погоды по умолчанию (Москва) при старте.');
    fetchWeather('Москва');
});
