const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json()); // To parse JSON request bodies

// Endpoint to handle web scraping and fact verification
app.post('/scrape', async (req, res) => {
    const { url, fact } = req.body;

    if (!url || !fact) {
        return res.status(400).json({ error: 'URL and fact are required' });
    }

    try {
        // Fetch the website's content
        const { data } = await axios.get(url);
        const $ = cheerio.load(data); // Load the HTML using Cheerio
        const text = $('body').text().toLowerCase(); // Extract text content from the body
        
        console.log(text);  // Log the scraped text for debugging

        // Trim and check if the fact exists in the website's content
        const factTrimmed = fact.trim().toLowerCase();
        const result = text.includes(factTrimmed) ? 'Fact found' : 'Fact not found';
        
        // Send the result back to the client
        res.json({ result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to scrape the website' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
