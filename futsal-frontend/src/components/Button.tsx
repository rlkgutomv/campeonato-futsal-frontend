interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'orange' | 'dark'
  fullWidth?: boolean
  children: React.ReactNode
}

const variants = {
  green: 'bg-green-700 hover:bg-green-600 border-green-600 text-white',
  blue: 'bg-blue-700 hover:bg-blue-600 border-blue-600 text-white',
  orange: 'bg-orange-700 hover:bg-orange-600 border-orange-600 text-white',
  dark: 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white',
}

export function Button({ variant = 'green', fullWidth = false, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${fullWidth ? 'w-full' : ''} border rounded-lg px-4 py-2.5 font-semibold text-sm transition-all active:scale-95 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
