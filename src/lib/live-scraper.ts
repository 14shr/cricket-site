'use server';

import axios from 'axios';

export async function getLiveMatches(): Promise<string[]> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn("FOOTBALL_DATA_API_KEY not found or not set in .env file.");
    return [
      "No API key provided for live scores.",
      "Get a free key from football-data.org and add it to your .env file."
    ];
  }

  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: { 'X-Auth-Token': apiKey },
    });

    const { matches } = response.data;

    if (!matches || matches.length === 0) {
      return ["No matches scheduled for today."];
    }

    return matches.map((match: any) => {
      const home = match.homeTeam.name.replace(' FC', '');
      const away = match.awayTeam.name.replace(' FC', '');
      const scoreHome = match.score.fullTime.home ?? match.score.home;
      const scoreAway = match.score.fullTime.away ?? match.score.away;

      let status = '';
      if (match.status === 'FINISHED') {
        status = 'FT';
      } else if (match.status === 'IN_PLAY') {
        status = `${match.minute}'`;
      } else if (match.status === 'PAUSED') {
          status = 'HT';
      } else if (match.status === 'SCHEDULED' || match.status === 'TIMED') {
          status = new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        status = match.status.toLowerCase();
      }

      const score = (scoreHome !== null && scoreAway !== null) ? `${scoreHome} - ${scoreAway}` : '';
      
      return `${home} ${score} ${away} (${status})`.replace('  ', ' ').trim();
    }).slice(0, 10); // Limit to 10 matches to not overload the UI

  } catch (error: any) {
    console.error("Error fetching live football matches:", error.message);
    if (error.response?.status === 403) {
        return ["API key is invalid or has expired."];
    }
    return ["Could not retrieve live match data."];
  }
}
