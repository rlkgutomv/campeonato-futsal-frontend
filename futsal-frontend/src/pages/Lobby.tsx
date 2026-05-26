import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Card, CardTitle } from '../components/Card'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { api } from '../services/api'
import type { Championship } from '../types'

export default function Lobby() {
  const [champs, setChamps] = useState<Championship[]>([])
  const [newChampName, setNewChampName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.championships.getAll().then(setChamps).catch(console.error)
  }, [])

  const criarCampeonato = async () => {
    if (!newChampName.trim()) return alert('Digite um nome!')
    try {
      const newChamp = await api.championships.create(newChampName.trim())
      localStorage.setItem('currentChampName', newChamp.name)
      navigate(`/campeonato/${newChamp.id}`)
    } catch {
      alert('Erro ao criar campeonato.')
    }
  }

  const entrarCampeonato = (champ: Championship) => {
    localStorage.setItem('currentChampName', champ.name)
    navigate(`/campeonato/${champ.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Futsal <span className="text-green-400">Manager</span>
          </h1>
          <p className="text-gray-400">Gerencie campeonatos, times, jogadores e partidas</p>
        </div>

        <Card className="mb-6">
          <CardTitle>Novo Campeonato</CardTitle>
          <div className="flex flex-col gap-4">
            <Input
              label="Nome do campeonato"
              placeholder="Ex: Copa Interclasses 2026"
              value={newChampName}
              onChange={e => setNewChampName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && criarCampeonato()}
            />
            <Button variant="green" fullWidth onClick={criarCampeonato}>
              Criar e Entrar
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Campeonatos</CardTitle>
          {champs.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">Nenhum campeonato criado ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {champs.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-gray-950 border border-gray-800 hover:border-green-700 rounded-lg px-4 py-3 transition-all">
                  <span className="text-white font-medium">{c.name}</span>
                  <Button variant="blue" onClick={() => entrarCampeonato(c)}>Entrar</Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
