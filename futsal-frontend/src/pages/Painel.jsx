import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

export default function Painel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const champName = localStorage.getItem('currentChampName') || 'Campeonato';

    const [abaAtiva, setAbaAtiva] = useState('painel');
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    
    const [teamName, setTeamName] = useState('');
    const [coachName, setCoachName] = useState('');
    
    const [playerName, setPlayerName] = useState('');
    const [playerTeamId, setPlayerTeamId] = useState('');
    const [playerShirt, setPlayerShirt] = useState('');
    
    const [matchTeam1, setMatchTeam1] = useState('');
    const [matchTeam2, setMatchTeam2] = useState('');
    const [score1, setScore1] = useState('');
    const [score2, setScore2] = useState('');
    
    const [sumula, setSumula] = useState([]);
    const [statPlayerId, setStatPlayerId] = useState('');
    const [statGoals, setStatGoals] = useState('');
    const [statYellow, setStatYellow] = useState('');
    const [statRed, setStatRed] = useState('');

    useEffect(() => {
        carregarDados();
    }, [id]);

    const carregarDados = async () => {
        try {
            const resTeams = await fetch(`${API_URL}/teams?championshipId=${id}`);
            const teamsData = await resTeams.json();
            teamsData.sort((a, b) => b.points - a.points || b.goals - a.goals);
            setTeams(teamsData);

            const resPlayers = await fetch(`${API_URL}/players?championshipId=${id}`);
            const playersData = await resPlayers.json();
            setPlayers(playersData);
        } catch (err) {
            console.error(err);
        }
    };

    const sairCampeonato = () => {
        localStorage.removeItem('currentChampName');
        navigate('/');
    };

    const cadastrarTime = async () => {
        if (!teamName) return alert("O nome é obrigatório!");
        try {
            await fetch(`${API_URL}/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: teamName, coach: coachName, championshipId: id })
            });
            setTeamName('');
            setCoachName('');
            carregarDados();
            alert("Time Cadastrado!");
        } catch (err) {
            alert("Erro ao salvar time");
        }
    };

    const cadastrarJogador = async () => {
        if (!playerName || !playerTeamId) return alert("Nome e Time são obrigatórios!");
        try {
            await fetch(`${API_URL}/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playerName, teamId: playerTeamId, shirtNumber: playerShirt, championshipId: id })
            });
            setPlayerName('');
            setPlayerShirt('');
            carregarDados();
            alert("Jogador Cadastrado!");
        } catch (err) {
            alert("Erro ao salvar jogador");
        }
    };

    const addStatToSumula = () => {
        const goals = parseInt(statGoals) || 0;
        const yellowCards = parseInt(statYellow) || 0;
        const redCards = parseInt(statRed) || 0;

        if (!statPlayerId || (goals === 0 && yellowCards === 0 && redCards === 0)) return;

        const player = players.find(p => p.id === statPlayerId);
        if (!player) return;

        setSumula(prev => {
            const existente = prev.find(s => s.playerId === statPlayerId);
            if (existente) {
                return prev.map(s => s.playerId === statPlayerId 
                    ? { ...s, goals: s.goals + goals, yellowCards: s.yellowCards + yellowCards, redCards: s.redCards + redCards } 
                    : s
                );
            }
            return [...prev, { playerId: statPlayerId, playerName: player.name, goals, yellowCards, redCards }];
        });

        setStatGoals('');
        setStatYellow('');
        setStatRed('');
    };

    const removerStat = (playerId) => {
        setSumula(prev => prev.filter(s => s.playerId !== playerId));
    };

    const cadastrarPartida = async () => {
        if (!matchTeam1 || !matchTeam2 || score1 === '' || score2 === '') return alert("Preencha os times e o placar!");
        if (matchTeam1 === matchTeam2) return alert("Um time não joga contra si mesmo!");

        try {
            await fetch(`${API_URL}/matches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    championshipId: id,
                    team1Id: matchTeam1,
                    team2Id: matchTeam2,
                    score1: parseInt(score1),
                    score2: parseInt(score2),
                    playerStats: sumula
                })
            });
            setScore1('');
            setScore2('');
            setSumula([]);
            alert("Partida salva com sucesso!");
            carregarDados();
        } catch (err) {
            alert("Erro ao registrar a partida.");
        }
    };

    const renderAba = () => {
        if (abaAtiva === 'painel') {
            return (
                <div className="dashboard-grid">
                    <div>
                        <h1>📊 Classificação</h1>
                        <table>
                            <thead><tr><th>Pos</th><th>Time</th><th>Pts</th><th>Gols</th></tr></thead>
                            <tbody>
                                {teams.map((t, i) => (
                                    <tr key={t.id} className={i === 0 && t.points > 0 ? 'first-place' : ''}>
                                        <td>{i + 1}º</td><td>{t.name}</td><td>{t.points}</td><td>{t.goals}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h1>👟 Artilharia</h1>
                        <table>
                            <thead><tr><th>Pos</th><th>Jogador</th><th>Gols</th></tr></thead>
                            <tbody>
                                {players.map((p, i) => (
                                    <tr key={p.id}>
                                        <td>{i + 1}º</td>
                                        <td>{p.name} <span style={{ fontSize: '0.8rem', color: '#888' }}>(A: {p.yellowCards} | V: {p.redCards})</span></td>
                                        <td>{p.goals}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (abaAtiva === 'partidas') {
            const jogadoresPartida = players.filter(p => p.teamId === matchTeam1 || p.teamId === matchTeam2);
            
            return (
                <div>
                    <h1>⚽ Nova Partida</h1>
                    <div className="match-group">
                        <select value={matchTeam1} onChange={(e) => setMatchTeam1(e.target.value)}>
                            <option value="">Mandante</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <input type="number" value={score1} onChange={(e) => setScore1(e.target.value)} min="0" placeholder="0" />
                        <span>X</span>
                        <input type="number" value={score2} onChange={(e) => setScore2(e.target.value)} min="0" placeholder="0" />
                        <select value={matchTeam2} onChange={(e) => setMatchTeam2(e.target.value)}>
                            <option value="">Visitante</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="stats-builder">
                        <h3>Súmula: Gols e Cartões</h3>
                        <div className="stats-grid">
                            <select value={statPlayerId} onChange={(e) => setStatPlayerId(e.target.value)}>
                                <option value="">Selecione um jogador...</option>
                                {jogadoresPartida.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input type="number" value={statGoals} onChange={(e) => setStatGoals(e.target.value)} placeholder="Gols" min="0" />
                            <input type="number" value={statYellow} onChange={(e) => setStatYellow(e.target.value)} placeholder="Amarelos" min="0" max="2" />
                            <input type="number" value={statRed} onChange={(e) => setStatRed(e.target.value)} placeholder="Vermelhos" min="0" max="1" />
                            <button className="btn-submit btn-dark" style={{ padding: '10px' }} onClick={addStatToSumula}>Adicionar</button>
                        </div>
                        <ul className="stats-list">
                            {sumula.map(s => (
                                <li key={s.playerId}>
                                    <span><strong>{s.playerName}</strong>: {s.goals} Gols | {s.yellowCards}A | {s.redCards}V</span>
                                    <span className="remove-stat" onClick={() => removerStat(s.playerId)}>X</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="btn-submit btn-blue" onClick={cadastrarPartida}>Salvar Partida Completa</button>
                </div>
            );
        }

        if (abaAtiva === 'times') {
            return (
                <div>
                    <h1>🛡️ Cadastrar Time</h1>
                    <div className="form-group">
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Nome do Time" />
                    </div>
                    <div className="form-group">
                        <input type="text" value={coachName} onChange={(e) => setCoachName(e.target.value)} placeholder="Nome do Técnico" />
                    </div>
                    <button className="btn-submit btn-green" onClick={cadastrarTime}>Salvar Time</button>
                </div>
            );
        }

        if (abaAtiva === 'jogadores') {
            return (
                <div>
                    <h1>🏃‍♂️ Cadastrar Jogador</h1>
                    <div className="form-group">
                        <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nome Completo" />
                    </div>
                    <div className="form-group">
                        <select value={playerTeamId} onChange={(e) => setPlayerTeamId(e.target.value)}>
                            <option value="">Selecione o Time...</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="number" value={playerShirt} onChange={(e) => setPlayerShirt(e.target.value)} placeholder="Número" />
                    </div>
                    <button className="btn-submit btn-orange" onClick={cadastrarJogador}>Salvar Jogador</button>
                </div>
            );
        }
    };

    return (
        <div>
            <nav>
                <h2>🏆 {champName}</h2>
                <div className="nav-links">
                    <button className={`nav-btn ${abaAtiva === 'painel' ? 'active' : ''}`} onClick={() => setAbaAtiva('painel')}>Painel</button>
                    <button className={`nav-btn ${abaAtiva === 'partidas' ? 'active' : ''}`} onClick={() => setAbaAtiva('partidas')}>Partidas</button>
                    <button className={`nav-btn ${abaAtiva === 'times' ? 'active' : ''}`} onClick={() => setAbaAtiva('times')}>Times</button>
                    <button className={`nav-btn ${abaAtiva === 'jogadores' ? 'active' : ''}`} onClick={() => setAbaAtiva('jogadores')}>Jogadores</button>
                    <button className="nav-btn btn-logout" onClick={sairCampeonato}>Sair</button>
                </div>
            </nav>
            <div className="container">
                <div className="section active">
                    {renderAba()}
                </div>
            </div>
        </div>
    );
}