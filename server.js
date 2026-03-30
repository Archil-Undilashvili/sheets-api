const express = require('express');
const app = express();

let cache = { data: null, updatedAt: 0 };

const SHEET_ID = 'https://docs.google.com/spreadsheets/d/1TJGqRtz8GGNLdxUntA0VWH-QIYrL9IFJ4t1QW9l1LKI/edit?gid=0#gid=0';
const API_KEY = 'AIzaSyAiq4iGYcWemyoF1JhS-cD2oM-gMF2LdOY';
const RANGE = 'Sheet1!A1:Z100';

async function refreshCache() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    cache = { data: json.values, updatedAt: Date.now() };
    console.log('Cache refreshed at', new Date().toISOString());
  } catch (e) {
    console.error('Refresh failed:', e.message);
  }
}

refreshCache();
setInterval(refreshCache, 30_000);

app.get('/api/data', (req, res) => {
  res.json({ data: cache.data, updatedAt: cache.updatedAt });
});

app.listen(3000, () => console.log('Server running on port 3000'));