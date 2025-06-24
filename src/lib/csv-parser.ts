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
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const rowObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObject[header] = values[index];
    });
    rows.push(rowObject);
  }
  return rows;
}

function mapRowToPlayerStats(row: Record<string, string>): PlayerStats {
  const testMatches = row['Test Matches'] || '-';
  const odiMatches = row['ODI Matches'] || '-';
  const t20iMatches = row['T20I Matches'] || '-';

  return {
    name: row['Name'] || 'N/A',
    country: row['Country'] || 'N/A',
    role: row['Role'] || 'N/A',
    image: row['Image URL'] || null,
    summary: `Found player data for ${row['Name']} in the local CSV file.`,
    rankings: {
      batting: {
        test: row['Batting Test Rank'] || '-',
        odi: row['Batting ODI Rank'] || '-',
        t20: row['Batting T20 Rank'] || '-',
      },
      bowling: {
        test: row['Bowling Test Rank'] || '-',
        odi: row['Bowling ODI Rank'] || '-',
        t20: row['Bowling T20 Rank'] || '-',
      },
    },
    batting_stats: {
      test: {
        matches: testMatches,
        runs: row['Test Runs'] || '-',
        highest_score: row['Test HS'] || '-',
        average: row['Test Avg'] || '-',
        strike_rate: row['Test SR'] || '-',
        hundreds: row['Test 100s'] || '-',
        fifties: row['Test 50s'] || '-',
      },
      odi: {
        matches: odiMatches,
        runs: row['ODI Runs'] || '-',
        highest_score: row['ODI HS'] || '-',
        average: row['ODI Avg'] || '-',
        strike_rate: row['ODI SR'] || '-',
        hundreds: row['ODI 100s'] || '-',
        fifties: row['ODI 50s'] || '-',
      },
      t20i: {
        matches: t20iMatches,
        runs: row['T20I Runs'] || '-',
        highest_score: row['T20I HS'] || '-',
        average: row['T20I Avg'] || '-',
        strike_rate: row['T20I SR'] || '-',
        hundreds: row['T20I 100s'] || '-',
        fifties: row['T20I 50s'] || '-',
      },
    },
    bowling_stats: {
      test: {
        matches: testMatches,
        balls: 'N/A',
        runs: 'N/A',
        wickets: row['Test Wickets'] || '-',
        best_bowling_innings: row['Test BBI'] || '-',
        economy: row['Test Econ'] || '-',
        five_wickets: row['Test 5W'] || '-',
      },
      odi: {
        matches: odiMatches,
        balls: 'N/A',
        runs: 'N/A',
        wickets: row['ODI Wickets'] || '-',
        best_bowling_innings: row['ODI BBI'] || '-',
        economy: row['ODI Econ'] || '-',
        five_wickets: row['ODI 5W'] || '-',
      },
      t20i: {
        matches: t20iMatches,
        balls: 'N/A',
        runs: 'N/A',
        wickets: row['T20I Wickets'] || '-',
        best_bowling_innings: row['T20I BBI'] || '-',
        economy: row['T20I Econ'] || '-',
        five_wickets: row['T20I 5W'] || '-',
      },
    },
  };
}

export async function getPlayerFromCSV(playerName: string): Promise<PlayerStats | null> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'player-data.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const players = parseCSV(fileContent);

    const searchTerms = playerName.toLowerCase().split(' ').filter(t => t.length > 0);

    const player = players.find(p => {
      if (!p['Name']) {
        return false;
      }
      const csvPlayerName = p['Name'].toLowerCase();
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
