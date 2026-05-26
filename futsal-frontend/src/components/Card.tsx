interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-5 pb-3 border-b border-gray-800">
      {children}
    </h2>
  )
}
