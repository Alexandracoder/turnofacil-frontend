import { useEffect, useState } from 'react'
import {
  Clock,
  Plus,
  User,
  Loader2,
  Trash2,
  CalendarClock,
  Calendar,
} from 'lucide-react'
import { shiftApi, userApi } from '../services/api'
import type { ShiftResponseDTO, UserResponseDTO } from '../types/api'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gestor',
  SUPERVISOR: 'Supervisor',
  CAREGIVER: 'Auxiliar',
}

export default function Shifts() {
  const [shifts, setShifts] = useState<ShiftResponseDTO[]>([])
  const [employees, setEmployees] = useState<UserResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    employeeId: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [shiftsData, employeesData] = await Promise.all([
        shiftApi.getAllShifts(),
        userApi.getAllUsers(),
      ])
      setShifts(shiftsData)
      setEmployees(employeesData)
    } catch (err) {
      setError('Error al conectar con el servidor. Verifica el Backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (new Date(formData.date) < today) {
      setError('La fecha no puede ser anterior a hoy')
      return
    }
    if (formData.endTime <= formData.startTime) {
      setError('La hora de fin debe ser posterior a la de inicio')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        employeeId: formData.employeeId,
        startTime: `${formData.date}T${formData.startTime}:00`,
        endTime: `${formData.date}T${formData.endTime}:00`,
      }
      await shiftApi.createShift(payload as any)
      setFormData({ date: '', startTime: '', endTime: '', employeeId: 0 })
      setShowForm(false)
      loadData()
    } catch (err: any) {
      setError(err.message || 'Error al crear el turno')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      try {
        await shiftApi.deleteShift(id)
        setShifts(shifts.filter(s => s.id !== id))
      } catch (err) {
        alert('Error al borrar el turno')
      }
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getShiftStyles = (startTime: string, endTime: string) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (now > end)
      return {
        card: 'bg-slate-50 border-slate-200 opacity-75',
        badge: 'bg-slate-200 text-slate-600',
        label: 'Finalizado',
      }
    if (now >= start && now <= end)
      return {
        card: 'bg-green-50 border-green-300 ring-1 ring-green-400',
        badge: 'bg-green-200 text-green-700',
        label: 'En directo',
      }
    return {
      card: 'bg-white border-blue-200 shadow-sm',
      badge: 'bg-blue-100 text-blue-700',
      label: 'Programado',
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Turnos</h1>
          <p className="text-slate-600 mt-1">Organiza y gestiona tus turnos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Añadir Turno</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Nuevo Turno
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Empleado *
                </label>
                <select
                  required
                  value={formData.employeeId}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      employeeId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Elegir profesional</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {ROLE_LABELS[emp.role] || emp.role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Inicio *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={e =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fin *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={e =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || formData.employeeId === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Creando...' : 'Crear Turno'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {shifts.map(shift => {
          const styles = getShiftStyles(shift.startTime, shift.endTime)
          return (
            <div
              key={shift.id}
              className={`rounded-xl border p-5 relative transition-all ${styles.card}`}
            >
              <button
                onClick={() => handleDelete(shift.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {shift.employeeName || 'Empleado'}
                    </h3>
                    <p className="text-sm font-medium text-blue-600">
                      {ROLE_LABELS[shift.employeeRole] || shift.employeeRole}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-xs text-slate-500">
                        ID: {shift.employeeId}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {shift.totalHours
                          ? `${shift.totalHours.toFixed(1)} hrs`
                          : '0 hrs'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <CalendarClock className="h-4 w-4 mr-2 text-blue-500" />
                      <span>
                        <strong>Inicio:</strong>{' '}
                        {formatDateTime(shift.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      <span>
                        <strong>Fin:</strong> {formatDateTime(shift.endTime)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${styles.badge}`}
                  >
                    {styles.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
