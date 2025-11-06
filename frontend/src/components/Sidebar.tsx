import { NavLink } from 'react-router-dom'
import { Sparkles, TrendingUp } from 'lucide-react'
import clsx from 'clsx'

export default function Sidebar() {
  const navItems = [
    { path: '/catalogue', icon: Sparkles, label: 'Catalogue Generator' },
    { path: '/trends', icon: TrendingUp, label: 'Trend Analyzer' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 shadow-sm z-50">
      <div className="p-6 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900">FashionB2B</h1>
        <p className="text-sm text-neutral-500 mt-1">AI Catalogue Platform</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}


