import { useEffect, useState } from 'react'
import {
  CalendarDays,
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

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    employeeId: 0,
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError(
        'Failed to load data. Make sure the backend is running on localhost:8080',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(formData.date)

    if (selectedDate < today) {
      setError('La fecha no puede ser anterior a hoy')
      return
    }

    if (formData.endTime <= formData.startTime) {
      setError('La hora de fin debe ser posterior a la de inicio')
      return
    }

    setSubmitting(true)
    setError(null)

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
      const msg =
        err.response?.data?.message || 'Error del servidor al crear el turno'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

const handleDelete = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
    console.log('Intentando borrar el turno con ID:', id) // <-- Para ver si el ID es correcto
    try {
      await shiftApi.deleteShift(id)
      setShifts(shifts.filter(s => s.id !== id))
      console.log('Turno borrado con éxito en el Front')
    } catch (err) {
      console.error('ERROR DETECTADO:', err) // <-- Aquí verás el error real
      alert('Error al borrar el turno: ' + err)
    }
  }
}


const calculateDuration = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime())

  if (isNaN(diffMs)) return '0 min'

  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${minutes} min`
  }

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
  }

  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${hours}h ${formattedMinutes}min`
}
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
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

    if (now > end) {
      return {
        card: 'bg-slate-50 border-slate-200 opacity-75',
        badge: 'bg-slate-200 text-slate-600',
        label: 'Finalizado',
      }
    } else if (now >= start && now <= end) {
      return {
        card: 'bg-green-50 border-green-300 ring-1 ring-green-400',
        badge: 'bg-green-200 text-green-700',
        label: 'En directo',
      }
    } else {
      return {
        card: 'bg-white border-blue-200 shadow-sm',
        badge: 'bg-blue-100 text-blue-700',
        label: 'Programado',
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Turnos</h1>
          <p className="text-slate-600 mt-1">Organiza y gestiona tus turnos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
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
                  Empleado <span className="text-red-500">*</span>
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
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={e =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={e =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                {submitting ? 'Creating...' : 'Crear Turno'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {shifts.map(shift => {
          const styles = getShiftStyles(shift.startTime, shift.endTime)
          return (
            <div
              key={shift.id}
              className={`rounded-xl shadow-sm border p-5 relative ${styles.card}`}
            >
              <button
                onClick={() => handleDelete(shift.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Eliminar turno"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {shift.employeeName || 'Empleado'}
                      </h3>

                      <p className="text-sm font-medium text-blue-600">
                        {ROLE_LABELS[shift.employeeRole] || shift.employeeRole}
                      </p>

                      <p className="text-sm text-slate-500">
                        ID: {shift.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Bloque de Inicio */}
                    <div className="flex items-center text-sm text-slate-600">
                      <CalendarClock className="h-5 w-5 mr-2 text-blue-500" />{' '}
                      {/* Añadí un color opcional */}
                      <span>
                        <strong>Inicio:</strong>{' '}
                        {formatDateTime(shift.startTime)}
                      </span>
                    </div>

                    {/* Bloque de Fin */}
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="h-5 w-5 mr-2 text-slate-400" />{' '}
                      {/* Aquí podrías usar Clock para variar */}
                      <span>
                        <strong>Fin:</strong> {formatDateTime(shift.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="...">
                  <p
                    className={`text-xs font-medium uppercase tracking-wider ${styles.badge}`}
                  >
                    {styles.label}
                  </p>
                  <p className="text-base font-bold text-green-800">
                    {calculateDuration(shift.startTime, shift.endTime)}{' '}
                    {parseFloat(
                      calculateDuration(shift.startTime, shift.endTime),
                    ) === 1}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
