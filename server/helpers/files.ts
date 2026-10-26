import { promises as fs } from 'node:fs'
import path from 'node:path'

export const pathExists = (candidate: string): Promise<boolean> =>
  fs.access(candidate).then(
    () => true,
    () => false,
  )

/** The first free name for a new file: `name.ext`, then `name-2.ext`, `name-3.ext` and so on. */
export const uniqueLocalPath = async (absolutePath: string): Promise<string> => {
  const extension = path.extname(absolutePath)
  const stem = extension ? absolutePath.slice(0, -extension.length) : absolutePath
  let candidate = absolutePath
  for (let suffix = 2; await pathExists(candidate); suffix += 1) candidate = `${stem}-${suffix}${extension}`
  return candidate
}
