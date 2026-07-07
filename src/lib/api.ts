import { API_BASE_URL, HTTP_HEADERS } from '@shared/constants'

export class ApiError extends Error {
  status: number
  details?: string

  constructor(message: string, status: number, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function getAuthHeaders(): Record<string, string> {
  const trainerId = localStorage.getItem('trainerId')
  const headers: Record<string, string> = {
    [HTTP_HEADERS.CONTENT_TYPE_JSON]: 'application/json',
  }
  if (trainerId) {
    headers[HTTP_HEADERS.TRAINER_ID_HEADER] = trainerId
  }
  return headers
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    let details: string | undefined
    try {
      const body = await response.json()
      message = body.error || message
      details = body.details
    } catch {}
    throw new ApiError(message, response.status, details)
  }
  return response.json() as Promise<T>
}

export const api = {
  get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    return fetch(url.toString(), { headers: getAuthHeaders() }).then<T>(handleResponse)
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }).then<T>(handleResponse)
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }).then<T>(handleResponse)
  },

  delete<T = void>(path: string): Promise<T> {
    return fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then<T>(handleResponse)
  },

  upload<T>(path: string, formData: FormData): Promise<T> {
    const trainerId = localStorage.getItem('trainerId')
    const headers: Record<string, string> = {}
    if (trainerId) {
      headers[HTTP_HEADERS.TRAINER_ID_HEADER] = trainerId
    }
    return fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    }).then<T>(handleResponse)
  },
}
