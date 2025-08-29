# Smart Weather AI

Это интерактивное веб-приложение для прогноза погоды с интеграцией AI-ассистента, который предоставляет рекомендации на основе погодных данных.

## Стек технологий

*   **Фронтенд:** HTML, CSS, Чистый JavaScript
*   **Бэкенд (прокси):** Node.js (Express)
*   **API погоды:** OpenWeatherMap API
*   **AI API:** Google Gemini API
*   **Графики:** Chart.js (будет добавлено позже)

## Функционал

*   Отображение текущей погоды (температура, влажность, ветер, давление, видимость, облачность).
*   Определение местоположения пользователя для получения погоды.
*   Поиск погоды по названию города.
*   AI-рекомендации по одежде и настроению дня на основе текущей погоды.
*   Динамическая смена фона в зависимости от погодных условий.

## Установка и запуск

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/ВАШ_ЮЗЕРНЕЙМ/smart-weather-ai.git
    cd smart-weather-ai
    ```

2.  **Установите зависимости Node.js:**
    ```bash
    npm install
    ```

3.  **Получите API-ключи:**
    *   **OpenWeatherMap API Key:** Зарегистрируйтесь на [OpenWeatherMap](https://openweathermap.org/) и получите свой API-ключ.
    *   **Google Gemini API Key:** Перейдите в [Google AI Studio](https://aistudio.google.com/) и получите свой API-ключ для Gemini.

4.  **Настройте переменные окружения:**
    *   Создайте файл `.env` в корневой директории проекта (`smart-weather-ai/`).
    *   Добавьте в него ваш Gemini API-ключ:
        ```
        GEMINI_API_KEY=ВАШ_GEMINI_API_KEY
        ```
    *   В файле `public/script.js` замените `YOUR_OPENWEATHER_API_KEY` на ваш ключ OpenWeatherMap:
        ```javascript
        const OPENWEATHER_API_KEY = 'ВАШ_OPENWEATHER_API_KEY';
        ```

5.  **Запустите сервер:**
    ```bash
    npm start
    ```
    Сервер будет запущен на `http://localhost:3000`.

6.  **Откройте приложение:**
    Откройте браузер и перейдите по адресу `http://localhost:3000`.

## Развертывание на Vercel

Для развертывания на Vercel:

1.  Подключите ваш GitHub репозиторий к Vercel.
2.  В настройках проекта Vercel добавьте переменную окружения `GEMINI_API_KEY` со значением вашего ключа Gemini.
3.  Убедитесь, что Vercel настроен на использование `server.js` как Serverless Function и обслуживает статические файлы из папки `public`.
