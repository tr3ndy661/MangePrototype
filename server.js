const express = require('express');
const request = require('request');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 8080;

// Use CORS middleware
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Define a route for fetching manga data
app.get('/manga', (req, res) => {
    const title = req.query.title;
    const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}`;

    // Set a User-Agent header
    const options = {
        uri: url,
        headers: {
            'User-Agent': 'YourAppName/1.0'
        },
        json: true
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(`Error fetching data: ${error.message}`);
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send(`MangaDex returned an error: ${body}`);
        }
        res.json(body);
    });
});

// Define a route for fetching manga details by ID
app.get('/manga-details', (req, res) => {
    const mangaId = req.query.id;
    const url = `https://api.mangadex.org/manga/${mangaId}`;

    const options = {
        uri: url,
        headers: {
            'User-Agent': 'YourAppName/1.0'
        },
        json: true
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(`Error fetching manga details: ${error.message}`);
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send(`MangaDex returned an error: ${body}`);
        }
        res.json(body);
    });
});

// **Define a route for fetching manga chapters by manga ID**
app.get('/manga-chapters', (req, res) => {
    const mangaId = req.query.id;
    const url = `https://api.mangadex.org/chapter?manga=${encodeURIComponent(mangaId)}`;

    const options = {
        uri: url,
        headers: {
            'User-Agent': 'YourAppName/1.0'
        },
        json: true
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(`Error fetching manga chapters: ${error.message}`);
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send(`MangaDex returned an error: ${body}`);
        }
        res.json(body);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// Add a new route for fetching chapter pages by chapter ID
app.get('/chapter-pages', (req, res) => {
    const chapterId = req.query.id;
    const url = `https://api.mangadex.org/at-home/server/${encodeURIComponent(chapterId)}`;

    const options = {
        uri: url,
        headers: {
            'User-Agent': 'YourAppName/1.0'
        },
        json: true
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(`Error fetching chapter pages: ${error.message}`);
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send(`MangaDex returned an error: ${body}`);
        }
        res.json(body);
    });
});


app.get('/chapter', async (req, res) => {
    try {
        chapterId = req.query.id;
        const url = `https://api.mangadex.org/at-home/server/${encodeURIComponent(chapterId)}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({error: 'Failed to get axios chapter'})
    }
});

app.get('/manga', async (req, res) => {
    try {
        const url = 'https://api.mangadex.org/manga?limit=20&availableTranslatedLanguage[]=en'
        const response = await axios.get(url)
        res.json(response.data);
    }   catch (error) {
        console.log("errorrr")
    }
})

app.get('/cover', async (req, res) => {
    try {
        const coverId = req.query.id;
        const url = `https://api.mangadex.org/cover/${encodeURIComponent(coverId)}`
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({error: 'Failed to get axios chapter'})
    }
});

app.get('/proxy', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const image = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        res.setHeader('Content-Type', image.headers['content-type']);
        res.send(image.data);
    } catch (error) {
        res.status(500).send('no photo fetch')
    }

})