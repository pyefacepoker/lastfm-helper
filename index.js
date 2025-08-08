import express from "express";
import fetch from "node-fetch";

const app = express();

const username = "pyefacepoker"; // Replace with your Last.fm username
const apiKey = process.env.LASTFM_API_KEY; // We'll add this on Render

async function getRecentTracks(limit = 2) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}`;
  const response = await fetch(url);
  return await response.json();
}

app.get("/last", async (req, res) => {
  try {
    const data = await getRecentTracks(1);
    const track = data.recenttracks.track[0];
    if (!track) return res.send("No recent track found.");
    res.send(`${track.name} - ${track.artist["#text"]}`);
  } catch {
    res.send("Error getting last song.");
  }
});

app.get("/previous", async (req, res) => {
  try {
    const data = await getRecentTracks(2);
    const track = data.recenttracks.track[1];
    if (!track) return res.send("No previous track found.");
    res.send(`${track.name} - ${track.artist["#text"]}`);
  } catch {
    res.send("Error getting previous song.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
