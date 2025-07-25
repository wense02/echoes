import { Memorial } from '@/types/memorial'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class MemorialService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async create(formData: FormData): Promise<Memorial> {
    const response = await fetch(`${API_BASE_URL}/memorials`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create memorial')
    }

    return response.json()
  }

  async getBySlug(slug: string): Promise<Memorial> {
    const response = await fetch(`${API_BASE_URL}/memorials/${slug}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Memorial not found')
    }

    return response.json()
  }

  async update(id: string, data: Partial<Memorial>): Promise<Memorial> {
    const response = await fetch(`${API_BASE_URL}/memorials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update memorial')
    }

    return response.json()
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memorials/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete memorial')
    }
  }

  async getPublicMemorials(page = 1, limit = 12): Promise<{ memorials: Memorial[], total: number }> {
    const response = await fetch(`${API_BASE_URL}/memorials/public?page=${page}&limit=${limit}`)

    if (!response.ok) {
      throw new Error('Failed to fetch memorials')
    }

    return response.json()
  }

  async getUserMemorials(): Promise<Memorial[]> {
    const response = await fetch(`${API_BASE_URL}/memorials/user`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user memorials')
    }

    return response.json()
  }

  async incrementViewCount(slug: string): Promise<void> {
    await fetch(`${API_BASE_URL}/memorials/${slug}/view`, {
      method: 'POST',
    })
  }
}

export const memorialService = new MemorialService()