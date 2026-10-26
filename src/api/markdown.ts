import type { MarkdownDocument, MarkdownListResponse } from '../@types'
import { apiEndpoint, jsonBody, requestJson } from './client'

type DocumentResponse = { document: MarkdownDocument }

const documentUrl = (id: string): string => apiEndpoint(`/api/markdown/${encodeURIComponent(id)}`)

// Saved Markdown files belong to the signed-in account and live in the server database.
export const fetchMarkdownList = (signal?: AbortSignal): Promise<MarkdownListResponse> =>
  requestJson<MarkdownListResponse>(apiEndpoint('/api/markdown'), { signal })

export const fetchMarkdownDocument = (id: string, signal?: AbortSignal): Promise<DocumentResponse> =>
  requestJson<DocumentResponse>(documentUrl(id), { signal })

export const createMarkdownDocument = (name: string, content: string): Promise<DocumentResponse> =>
  requestJson<DocumentResponse>(apiEndpoint('/api/markdown'), { method: 'POST', ...jsonBody({ name, content }) })

export const updateMarkdownDocument = (id: string, changes: { name?: string; content?: string }): Promise<DocumentResponse> =>
  requestJson<DocumentResponse>(documentUrl(id), { method: 'PUT', ...jsonBody(changes) })

export const deleteMarkdownDocument = (id: string): Promise<{ ok: true }> =>
  requestJson<{ ok: true }>(documentUrl(id), { method: 'DELETE' })
