require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Маршрут для проксирования запросов к Google Gemini API
app.post('/api/gemini', async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const { prompt } = req.body;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY не установлен в переменных окружения.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка от Gemini API:', errorData);
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        const generatedText = data.candidates[0]?.content?.parts[0]?.text || 'Не удалось сгенерировать ответ.';
        res.json({ text: generatedText });

    } catch (error) {
        console.error('Ошибка при проксировании запроса к Gemini:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера при обращении к Gemini API.' });
    }
});

// Экспортируем приложение для Vercel
module.exports = app;

// Для локального запуска, если не используется Vercel
if (process.env.NODE_ENV !== 'production') {
    const serveStatic = require('serve-static');
    const finalhandler = require('finalhandler');
    const http = require('http');
    const path = require('path');

    const serve = serveStatic(path.join(__dirname, '../public'), { 'index': ['index.html'] });

    const server = http.createServer(function onRequest (req, res) {
        // Проверяем, является ли запрос к API
        if (req.url.startsWith('/api/')) {
            app(req, res); // Передаем запрос Express-приложению для обработки API
        } else {
            serve(req, res, finalhandler(req, res)); // Обслуживаем статические файлы
        }
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
        console.log(`Для доступа к приложению откройте http://localhost:${PORT} в браузере.`);
    });
}
