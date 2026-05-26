import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Card, CardTitle } from '../components/Card'
import { Input, Select } from '../components/Input'
import { Button } from '../components/Button'
import { api } from '../services/api'
import type { Team, Player, Match, PlayerStat } from '../types'

export default function Painel() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const champName = localStorage.getItem('currentChampName') ?? 'Campeonato'
  const championshipId = id!

  const [abaAtiva, setAbaAtiva] = useState('painel')
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [partidas, setPartidas] = useState<Match[]>([])

  const [teamName, setTeamName] = useState('')
  const [coachName, setCoachName] = useState('')

  const [playerName, setPlayerName] = useState('')
  const [playerTeamId, setPlayerTeamId] = useState('')
  const [playerShirt, setPlayerShirt] = useState('')

  const [matchTeam1, setMatchTeam1] = useState('')
  const [matchTeam2, setMatchTeam2] = useState('')
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [sumula, setSumula] = useState<PlayerStat[]>([])
  const [statPlayerId, setStatPlayerId] = useState('')
  const [statGoals, setStatGoals] = useState('')
  const [statYellow, setStatYellow] = useState('')
  const [statRed, setStatRed] = useState('')

  useEffect(() => {
    carregarDados()
  }, [championshipId])

  const carregarDados = async () => {
    try {
      const [teamsData, playersData, matchesData] = await Promise.all([
        api.teams.getAll(championshipId),
        api.players.getAll(championshipId),
        api.matches.getAll(championshipId),
      ])
      setTeams(teamsData.sort((a, b) => b.points - a.points || b.goals - a.goals))
      setPlayers(playersData)
      setPartidas(matchesData)
    } catch (err) {
      console.error(err)
    }
  }

  const sairCampeonato = () => {
    localStorage.removeItem('currentChampName')
    navigate('/')
  }

  const cadastrarTime = async () => {
    if (!teamName.trim()) return alert('O nome é obrigatório!')
    try {
      await api.teams.create(teamName.trim(), coachName, championshipId)
      setTeamName('')
      setCoachName('')
      await carregarDados()
      alert('Time cadastrado!')
    } catch {
      alert('Erro ao salvar time.')
    }
  }

  const cadastrarJogador = async () => {
    if (!playerName.trim() || !playerTeamId) return alert('Nome e time são obrigatórios!')
    try {
      await api.players.create(playerName.trim(), playerTeamId, playerShirt, championshipId)
      setPlayerName('')
      setPlayerShirt('')
      await carregarDados()
      alert('Jogador cadastrado!')
    } catch {
      alert('Erro ao salvar jogador.')
    }
  }

  const addStatToSumula = () => {
    const goals = parseInt(statGoals) || 0
    const yellowCards = parseInt(statYellow) || 0
    const redCards = parseInt(statRed) || 0
    if (!statPlayerId || (goals === 0 && yellowCards === 0 && redCards === 0)) return
    const player = players.find(p => p.id === statPlayerId)
    if (!player) return
    setSumula(prev => {
      const existente = prev.find(s => s.playerId === statPlayerId)
      if (existente) {
        return prev.map(s => s.playerId === statPlayerId
          ? { ...s, goals: s.goals + goals, yellowCards: s.yellowCards + yellowCards, redCards: s.redCards + redCards }
          : s
        )
      }
      return [...prev, { playerId: statPlayerId, playerName: player.name, goals, yellowCards, redCards }]
    })
    setStatGoals('')
    setStatYellow('')
    setStatRed('')
  }

  const cadastrarPartida = async () => {
    if (!matchTeam1 || !matchTeam2 || score1 === '' || score2 === '') return alert('Preencha os times e o placar!')
    if (matchTeam1 === matchTeam2) return alert('Um time não joga contra si mesmo!')
    try {
      await api.matches.create(championshipId, matchTeam1, matchTeam2, parseInt(score1), parseInt(score2), sumula)
      setScore1('')
      setScore2('')
      setMatchTeam1('')
      setMatchTeam2('')
      setSumula([])
      await carregarDados()
      alert('Partida salva!')
    } catch {
      alert('Erro ao registrar partida.')
    }
  }

  const getNomeTime = (teamId: string) => teams.find(t => t.id === teamId)?.name ?? teamId
  const artilharia = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0))
  const jogadoresPartida = players.filter(p => p.teamId === matchTeam1 || p.teamId === matchTeam2)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar champName={champName} abaAtiva={abaAtiva} onAbaChange={setAbaAtiva} onSair={sairCampeonato} />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {abaAtiva === 'painel' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardTitle>Classificacao</CardTitle>
                {teams.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum time cadastrado.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider">
                        <th className="text-left pb-3 font-medium">Pos</th>
                        <th className="text-left pb-3 font-medium">Time</th>
                        <th className="text-right pb-3 font-medium">Pts</th>
                        <th className="text-right pb-3 font-medium">Gols</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {teams.map((t, i) => (
                        <tr key={t.id} className="hover:bg-gray-800 transition-colors">
                          <td className="py-3 text-gray-400">{i + 1}</td>
                          <td className="py-3 text-white font-medium">
                            {t.name}
                            {i === 0 && t.points > 0 && (
                              <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full">lider</span>
                            )}
                          </td>
                          <td className="py-3 text-right text-green-400 font-bold">{t.points}</td>
                          <td className="py-3 text-right text-gray-300">{t.goals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>

              <Card>
                <CardTitle>Artilharia</CardTitle>
                {artilharia.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum jogador cadastrado.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider">
                        <th className="text-left pb-3 font-medium">Pos</th>
                        <th className="text-left pb-3 font-medium">Jogador</th>
                        <th className="text-right pb-3 font-medium">Gols</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {artilharia.map((p, i) => (
                        <tr key={p.id} className="hover:bg-gray-800 transition-colors">
                          <td className="py-3 text-gray-400">{i + 1}</td>
                          <td className="py-3">
                            <span className="text-white font-medium">{p.name}</span>
                            <span className="text-gray-500 text-xs ml-2">A:{p.yellowCards ?? 0} V:{p.redCards ?? 0}</span>
                          </td>
                          <td className="py-3 text-right text-green-400 font-bold">{p.goals ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </div>

            <Card>
              <CardTitle>Historico de Partidas</CardTitle>
              {partidas.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma partida registrada ainda.</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {partidas.map(m => (
                    <div key={m.id} className="flex items-center justify-between py-4 text-sm">
                      <span className="text-white font-medium flex-1 text-right pr-4">{getNomeTime(m.team1Id)}</span>
                      <span className="bg-gray-800 border border-gray-700 text-white font-bold px-5 py-1.5 rounded-lg text-base">
                        {m.score1} x {m.score2}
                      </span>
                      <span className="text-white font-medium flex-1 pl-4">{getNomeTime(m.team2Id)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {abaAtiva === 'partidas' && (
          <Card>
            <CardTitle>Nova Partida</CardTitle>
            <div className="flex items-center gap-4 mb-6 bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="flex-1">
                <Select value={matchTeam1} onChange={e => setMatchTeam1(e.target.value)}>
                  <option value="">Mandante</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
              </div>
              <Input className="w-16 text-center text-xl font-bold" type="number" value={score1} onChange={e => setScore1(e.target.value)} min="0" placeholder="0" />
              <span className="text-gray-500 font-bold text-xl">X</span>
              <Input className="w-16 text-center text-xl font-bold" type="number" value={score2} onChange={e => setScore2(e.target.value)} min="0" placeholder="0" />
              <div className="flex-1">
                <Select value={matchTeam2} onChange={e => setMatchTeam2(e.target.value)}>
                  <option value="">Visitante</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Sumula — Gols e Cartoes</p>
              <div className="grid grid-cols-5 gap-3 mb-4">
                <div className="col-span-2">
                  <Select value={statPlayerId} onChange={e => setStatPlayerId(e.target.value)}>
                    <option value="">Selecione um jogador...</option>
                    {jogadoresPartida.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </Select>
                </div>
                <Input type="number" value={statGoals} onChange={e => setStatGoals(e.target.value)} placeholder="Gols" min="0" />
                <Input type="number" value={statYellow} onChange={e => setStatYellow(e.target.value)} placeholder="Amarelos" min="0" />
                <Button variant="dark" onClick={addStatToSumula}>+</Button>
              </div>
              {sumula.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {sumula.map(s => (
                    <div key={s.playerId} className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
                      <span className="text-white font-medium">{s.playerName}</span>
                      <span className="text-gray-400">{s.goals} gols · {s.yellowCards} amarelo · {s.redCards} vermelho</span>
                      <button onClick={() => setSumula(prev => prev.filter(x => x.playerId !== s.playerId))} className="text-red-400 hover:text-red-300 font-bold ml-4 cursor-pointer">X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button variant="blue" fullWidth onClick={cadastrarPartida}>Salvar Partida</Button>
          </Card>
        )}

        {abaAtiva === 'times' && (
          <Card className="max-w-lg">
            <CardTitle>Cadastrar Time</CardTitle>
            <div className="flex flex-col gap-4">
              <Input label="Nome do time" placeholder="Ex: Atletico FC" value={teamName} onChange={e => setTeamName(e.target.value)} />
              <Input label="Tecnico (opcional)" placeholder="Nome do tecnico" value={coachName} onChange={e => setCoachName(e.target.value)} />
              <Button variant="green" fullWidth onClick={cadastrarTime}>Salvar Time</Button>
            </div>
          </Card>
        )}

        {abaAtiva === 'jogadores' && (
          <Card className="max-w-lg">
            <CardTitle>Cadastrar Jogador</CardTitle>
            <div className="flex flex-col gap-4">
              <Input label="Nome completo" placeholder="Nome do jogador" value={playerName} onChange={e => setPlayerName(e.target.value)} />
              <Select label="Time" value={playerTeamId} onChange={e => setPlayerTeamId(e.target.value)}>
                <option value="">Selecione o time...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
              <Input label="Numero da camisa" type="number" placeholder="Ex: 10" value={playerShirt} onChange={e => setPlayerShirt(e.target.value)} />
              <Button variant="orange" fullWidth onClick={cadastrarJogador}>Salvar Jogador</Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}
