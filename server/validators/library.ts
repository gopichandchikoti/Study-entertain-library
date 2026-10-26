import type { Request } from 'express'
import { queryValue } from '../helpers/query.js'

/** The `path` query parameter, or null when it is missing or not a single string. */
export const requestedPath = (request: Request): string | null => queryValue(request.query.path)
