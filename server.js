const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());

const uri = `${process.env.MONGO_API_KEY}`;
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db('jobInterviewQuestions');
});

app.post('/api/getQuestions', async (req, res) => {
    const { jobTitle } = req.body;

    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003",
            prompt: `Provide interview questions for a ${jobTitle}.`,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const questions = openaiResponse.data.choices[0].text.trim().split('\n').filter(question => question);

        db.collection('questions').insertOne({ jobTitle, questions });

        res.json({ questions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
