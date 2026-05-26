import { Routes, Route } from 'react-router-dom'
import Lobby from './pages/Lobby'
import Painel from './pages/Painel'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/campeonato/:id" element={<Painel />} />
    </Routes>
  )
}
