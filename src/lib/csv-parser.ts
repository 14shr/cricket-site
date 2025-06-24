'use server';

import fs from 'fs/promises';
import path from 'path';

export interface PlayerStats {
  name: string;
  country: string;
  image: string | null;
  role: string;
  rankings: {
    batting: { test: string; odi: string; t20: string; };
    bowling: { test: string; odi: string; t20: string; };
  };
  batting_stats: Record<string, {
    matches: string; runs: string; highest_score: string; average: string; strike_rate: string; hundreds: string; fifties: string;
  }>;
  bowling_stats: Record<string, {
    matches: string; balls: string; runs: string; wickets: string; best_bowling_innings: string; economy: string; five_wickets: string;
  }>;
  summary: string;
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].replace(/"/g, '').split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].replace(/"/g, '').split(',').map(v => v.trim());
    const rowObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObject[header] = values[index];
    });
    rows.push(rowObject);
  }
  return rows;
}

function mapRowToPlayerStats(row: Record<string, string>): PlayerStats {
  return {
    name: row['fullname'] || 'N/A',
    country: 'N/A', // Set to N/A as the CSV structure does not contain country info
    role: row['position'] || 'N/A',
    image: row['image_path'] || null,
    summary: `Found player data for ${row['fullname']} in the local CSV file.`,
    rankings: {
      batting: { test: '-', odi: '-', t20: '-' },
      bowling: { test: '-', odi: '-', t20: '-' },
    },
    batting_stats: {
      test: { matches: '-', runs: '-', highest_score: '-', average: '-', strike_rate: '-', hundreds: '-', fifties: '-' },
      odi: { matches: '-', runs: '-', highest_score: '-', average: '-', strike_rate: '-', hundreds: '-', fifties: '-' },
      t20i: { matches: '-', runs: '-', highest_score: '-', average: '-', strike_rate: '-', hundreds: '-', fifties: '-' },
    },
    bowling_stats: {
      test: { matches: '-', balls: '-', runs: '-', wickets: '-', best_bowling_innings: '-', economy: '-', five_wickets: '-' },
      odi: { matches: '-', balls: '-', runs: '-', wickets: '-', best_bowling_innings: '-', economy: '-', five_wickets: '-' },
      t20i: { matches: '-', balls: '-', runs: '-', wickets: '-', best_bowling_innings: '-', economy: '-', five_wickets: '-' },
    },
  };
}

export async function getPlayerFromCSV(playerName: string): Promise<PlayerStats | null> {
  try {
    // In a serverless environment like Netlify, file paths need to be resolved from the project root.
    // process.cwd() gives us the root directory during the build process, which Next.js can use
    // to correctly trace and include the data file in the deployment package.
    const filePath = path.join(process.cwd(), 'src', 'data', 'player-data.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const players = parseCSV(fileContent);

    const searchTerms = playerName.toLowerCase().split(' ').filter(t => t.length > 0);

    const player = players.find(p => {
      if (!p['fullname']) {
        return false;
      }
      const csvPlayerName = p['fullname'].toLowerCase();
      // Check if every search term is included in the player's name
      return searchTerms.every(term => csvPlayerName.includes(term));
    });
    
    if (player) {
      return mapRowToPlayerStats(player);
    }
    
    return null;
  } catch (error) {
    console.error("Error reading or parsing CSV file:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get player data from CSV. ${error.message}`);
    }
    throw new Error('An unknown error occurred while processing player data.');
  }
}
