import { Users, Calendar, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
  activeTab: 'empleados' | 'turnos'
  onTabChange: (tab: 'empleados' | 'turnos') => void
}

export default function Layout({
  children,
  activeTab,
  onTabChange,
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-slate-800">
                  TurnoFácil
                </span>
              </div>

              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                <button
                  onClick={() => onTabChange('empleados')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    activeTab === 'empleados'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Empleados</span>
                </button>

                <button
                  onClick={() => onTabChange('turnos')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    activeTab === 'turnos'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Turnos</span>
                </button>
              </div>
            </div>

            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  onTabChange('empleados')
                  setMobileMenuOpen(false)
                }}
                className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === 'empleados'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Empleados</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('turnos')
                  setMobileMenuOpen(false)
                }}
                className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === 'turnos'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Turnos</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
