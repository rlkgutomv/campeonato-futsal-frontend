interface NavbarProps {
  champName?: string
  abaAtiva?: string
  onAbaChange?: (aba: string) => void
  onSair?: () => void
}

const abas = [
  { id: 'painel', label: 'Painel' },
  { id: 'partidas', label: 'Partidas' },
  { id: 'times', label: 'Times' },
  { id: 'jogadores', label: 'Jogadores' },
]

export function Navbar({ champName, abaAtiva, onAbaChange, onSair }: NavbarProps) {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
        <div className="flex items-center gap-1 mr-auto">
          <span className="text-white font-bold text-lg">Futsal</span>
          <span className="text-green-400 font-bold text-lg">Manager</span>
          {champName && (
            <span className="text-gray-500 text-sm ml-2">/ {champName}</span>
          )}
        </div>
        {onAbaChange && (
          <div className="flex items-center gap-1">
            {abas.map(aba => (
              <button
                key={aba.id}
                onClick={() => onAbaChange(aba.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  abaAtiva === aba.id
                    ? 'bg-green-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        )}
        {onSair && (
          <button
            onClick={onSair}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950 hover:text-red-300 transition-all"
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  )
}
