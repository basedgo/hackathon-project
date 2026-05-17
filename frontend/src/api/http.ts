import { API_BASE_URL } from '../config/api'

type RequestBody = object | unknown[] | string | number | boolean | null
type JsonRequestInit = Omit<RequestInit, 'body'> & { body?: RequestBody }

export class ApiError extends Error {
  status: number
  details: string

  constructor(status: number, message: string, details = '') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function joinUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export async function apiRequest<T>(path: string, init: JsonRequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)

  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(joinUrl(path), {
    ...init,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new ApiError(response.status, `Request failed: ${response.status} ${response.statusText}`, details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function createResourceApi<TResource, TPayload extends RequestBody>(basePath: string) {
  return {
    list: () => apiRequest<TResource[]>(basePath),
    get: (id: string) => apiRequest<TResource>(`${basePath}/${id}`),
    create: (payload: TPayload) => apiRequest<TResource>(basePath, { method: 'POST', body: payload }),
    update: (id: string, payload: TPayload) => apiRequest<TResource>(`${basePath}/${id}`, { method: 'PUT', body: payload }),
    remove: (id: string) => apiRequest<void>(`${basePath}/${id}`, { method: 'DELETE' }),
  }
}
