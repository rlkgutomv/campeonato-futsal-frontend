import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

export default function Lobby() {
    const [champs, setChamps] = useState([]);
    const [newChampName, setNewChampName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        carregarLobby();
    }, []);

    const carregarLobby = async () => {
        try {
            const res = await fetch(`${API_URL}/championships`);
            const data = await res.json();
            setChamps(data);
        } catch (err) {
            console.error(err);
        }
    };

    const criarCampeonato = async () => {
        if (!newChampName) return alert("Digite um nome!");
        try {
            const res = await fetch(`${API_URL}/championships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newChampName })
            });
            const newChamp = await res.json();
            entrarCampeonato(newChamp.id, newChamp.name);
        } catch (err) {
            alert("Erro ao criar.");
        }
    };

    const entrarCampeonato = (id, name) => {
        localStorage.setItem('currentChampName', name);
        navigate(`/campeonato/${id}`);
    };

    return (
        <div>
            <nav><h2>🏆 Futsal Manager</h2></nav>
            <div className="container">
                <div className="section active">
                    <h1>Criar Novo Campeonato</h1>
                    <div className="form-group">
                        <input
                            type="text"
                            value={newChampName}
                            onChange={(e) => setNewChampName(e.target.value)}
                            placeholder="Ex: Copa Interclasses 2026"
                        />
                    </div>
                    <button className="btn-submit btn-green" onClick={criarCampeonato}>
                        Criar e Entrar
                    </button>

                    <h1 style={{ marginTop: '40px' }}>Meus Campeonatos</h1>
                    <div>
                        {champs.length === 0 ? (
                            <p style={{ color: '#777' }}>Nenhum campeonato criado ainda.</p>
                        ) : (
                            champs.map(c => (
                                <div className="champ-card" key={c.id}>
                                    <strong>{c.name}</strong>
                                    <button
                                        className="btn-submit btn-blue"
                                        style={{ width: 'auto', padding: '8px 20px' }}
                                        onClick={() => entrarCampeonato(c.id, c.name)}
                                    >
                                        Entrar
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}