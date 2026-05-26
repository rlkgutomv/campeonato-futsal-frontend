interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</label>}
      <input
        className={`bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all ${className}`}
        {...props}
      />
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: React.ReactNode
}

export function Select({ label, children, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</label>}
      <select
        className={`bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
