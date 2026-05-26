import type { Championship, Team, Player, Match, PlayerStat } from '../types'

const API_URL = 'http://localhost:3000/api'

export const api = {
  championships: {
    getAll: async (): Promise<Championship[]> => {
      const res = await fetch(`${API_URL}/championships`)
      return res.json()
    },
    create: async (name: string): Promise<Championship> => {
      const res = await fetch(`${API_URL}/championships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      return res.json()
    },
  },
  teams: {
    getAll: async (championshipId: string): Promise<Team[]> => {
      const res = await fetch(`${API_URL}/teams?championshipId=${championshipId}`)
      return res.json()
    },
    create: async (name: string, coach: string, championshipId: string): Promise<Team> => {
      const res = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, coach, championshipId }),
      })
      return res.json()
    },
  },
  players: {
    getAll: async (championshipId: string): Promise<Player[]> => {
      const res = await fetch(`${API_URL}/players?championshipId=${championshipId}`)
      return res.json()
    },
    create: async (name: string, teamId: string, shirtNumber: string, championshipId: string): Promise<Player> => {
      const res = await fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, teamId, shirtNumber, championshipId }),
      })
      return res.json()
    },
  },
  matches: {
    getAll: async (championshipId: string): Promise<Match[]> => {
      const res = await fetch(`${API_URL}/matches?championshipId=${championshipId}`)
      const data = await res.json()
      return Array.isArray(data) ? data : []
    },
    create: async (championshipId: string, team1Id: string, team2Id: string, score1: number, score2: number, playerStats: PlayerStat[]): Promise<Match> => {
      const res = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ championshipId, team1Id, team2Id, score1, score2, playerStats }),
      })
      return res.json()
    },
  },
}
