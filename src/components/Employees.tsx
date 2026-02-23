import { useEffect, useState } from 'react';
import { UserPlus, Trash2, Mail, Phone, Shield, Loader2, Users } from 'lucide-react';
import { userApi } from '../services/api';
import type { UserResponseDTO, UserRequestDTO } from '../types/api';

const ROLE_COLORS = {
  ADMIN: 'bg-red-100 text-red-700 border-red-200',
  MANAGER: 'bg-purple-100 text-purple-700 border-purple-200',
  SUPERVISOR: 'bg-blue-100 text-blue-700 border-blue-200',
  CAREGIVER: 'bg-green-100 text-green-700 border-green-200',
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  supervisor: 'Supervisor',
  auxiliary: 'Auxiliar',
}

export default function Employees() {
  const [employees, setEmployees] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<UserRequestDTO>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'CAREGIVER',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees. Make sure the backend is running on localhost:8080');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await userApi.createUser(formData);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'CAREGIVER',
      });
      setShowForm(false);
      loadEmployees();
    } catch (err) {
      setError('Failed to create employee');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await userApi.deleteUser(id);
      loadEmployees();
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Empleados</h1>
          <p className="text-slate-600 mt-1">
            Gestiona tu equipo de asistencia
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <UserPlus className="h-5 w-5" />
          <span>Añadir Empleado</span>
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
            Nuevo Empleado
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Usuario <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                minLength={4}
                maxLength={20}
                value={formData.username}
                onChange={e =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john_doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="******"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.role}
                onChange={e =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CAREGIVER">Auxiliar</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="MANAGER">Gestor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{submitting ? 'Creating...' : 'Crear Empleado'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => (
          <div
            key={employee.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800">
                  {employee.fullName}
                </h3>
                <p className="text-sm text-slate-500">@{employee.username}</p>
              </div>
              <button
                onClick={() => handleDelete(employee.id, employee.fullName)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete employee"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{employee.phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-slate-400" />
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  ROLE_COLORS[employee.role]
                }`}
              >
                {employee.role === 'ADMIN'
                  ? 'Administrador'
                  : employee.role === 'MANAGER'
                  ? 'Gestor'
                  : employee.role === 'SUPERVISOR'
                  ? 'Supervisor'
                  : employee.role === 'CAREGIVER'
                  ? 'Auxiliar'
                  : employee.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-800 mb-1">
            No hay empleados todavía
          </h3>
          <p className="text-slate-600">
            Empieza por añadir al primer miembro de tu equipo
          </p>
        </div>
      )}
    </div>
  )
}
