import type { ContentResponse, EbookResponse, LibraryResponse, UploadCommitResponse, UploadResponse } from '../@types'
import { content as copy } from '../content.js'
import { ApiError, apiEndpoint, jsonBody, requestJson, writeHeaders } from './client'

const withPath = (route: string, filePath: string): string => `${route}?${new URLSearchParams({ path: filePath }).toString()}`

export const fetchLibrary = (signal?: AbortSignal): Promise<LibraryResponse> =>
  requestJson<LibraryResponse>(apiEndpoint('/api/library'), { signal })

export const fetchContent = (filePath: string, signal?: AbortSignal): Promise<ContentResponse> =>
  requestJson<ContentResponse>(apiEndpoint(withPath('/api/content', filePath)), { signal })

export const assetUrl = (filePath: string): string => apiEndpoint(withPath('/api/asset', filePath))

export const fileUrl = (filePath: string): string => apiEndpoint(withPath('/api/file', filePath))

export const uploadFile = (file: File, signal?: AbortSignal): Promise<UploadResponse> => {
  const body = new FormData()
  body.append('file', file)
  return requestJson<UploadResponse>(apiEndpoint('/api/uploads'), { method: 'POST', body, signal })
}

export const commitUpload = (
  uploadId: string,
  category: string,
  fileName: string,
  signal?: AbortSignal,
): Promise<UploadCommitResponse> =>
  requestJson<UploadCommitResponse>(apiEndpoint(`/api/uploads/${encodeURIComponent(uploadId)}/commit`), {
    method: 'POST',
    ...jsonBody({ category, fileName }),
    signal,
  })

export const discardUpload = async (uploadId: string): Promise<void> => {
  const response = await fetch(apiEndpoint(`/api/uploads/${encodeURIComponent(uploadId)}`), {
    method: 'DELETE',
    credentials: 'include',
    headers: writeHeaders(),
  })
  if (response.ok) return
  const body = (await response.json().catch(() => null)) as { message?: unknown; code?: unknown } | null
  throw new ApiError(
    typeof body?.message === 'string' ? body.message : copy.api.theUploadCouldNotBeDiscarded,
    response.status,
    typeof body?.code === 'string' ? body.code : null,
  )
}

export const createEbook = (paths: string[], title: string, signal?: AbortSignal): Promise<EbookResponse> =>
  requestJson<EbookResponse>(apiEndpoint('/api/ebooks'), { method: 'POST', ...jsonBody({ paths, title }), signal })
