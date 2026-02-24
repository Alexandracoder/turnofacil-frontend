import type {
  ShiftRequestDTO,
  UserRequestDTO,
  UserResponseDTO,
  ShiftResponseDTO,
} from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api'

export const userApi = {
  async getAllUsers(): Promise<UserResponseDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  async getUserById(id: number): Promise<UserResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  async createUser(user: UserRequestDTO): Promise<UserResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  },

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete user')
  },
}

export const shiftApi = {
  async getAllShifts(): Promise<ShiftResponseDTO[]> {
    const response = await fetch(`${API_BASE_URL}/shifts`)
    if (!response.ok) throw new Error('Failed to fetch shifts')
    return response.json()
  },

  async getShiftById(id: number): Promise<ShiftResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/shifts/${id}`)
    if (!response.ok) throw new Error('Failed to fetch shift')
    return response.json()
  },

  async createShift(shift: ShiftRequestDTO): Promise<ShiftResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/shifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shift),
    })
    if (!response.ok) throw new Error('Failed to create shift')
    return response.json()
  },

  async deleteShift(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shifts/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete shift')
  },
}