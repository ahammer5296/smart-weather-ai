require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Vercel будет направлять запросы к /api/gemini в этот файл.
// Внутренний маршрут теперь должен быть корневым ('/').
app.post('/', async (req, res) => {
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
