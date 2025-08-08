import express from "express";
import fetch from "node-fetch";

const app = express();

const username = "pyefacepoker"; // Replace with your Last.fm username
const apiKey = process.env.LASTFM_API_KEY; // Add this in Render's Environment Variables

async function getRecentTracks(limit = 5) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}`;
  const response = await fetch(url);
  return await response.json();
}

app.get("/song", async (req, res) => {
  try {
    const data = await getRecentTracks(5); // get last 5 plays
    const now = Date.now() / 1000; // current time in seconds
    let closestTrack = null;
    let smallestDiff = Infinity;

    data.recenttracks.track.forEach(t => {
      if (!t.date) return; // skip now-playing
      const playedAt = parseInt(t.date.uts, 10);
      const diff = Math.abs((now - playedAt) - 120); // difference from 2 minutes ago
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestTrack = t;
      }
    });

    if (!closestTrack) return res.send("There's no song playing currently.");
    res.send(`${closestTrack.name} - ${closestTrack.artist["#text"]}`);
  } catch (err) {
    res.send("There's an error retrieving the song.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
