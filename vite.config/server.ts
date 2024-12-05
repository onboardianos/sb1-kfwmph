import { ServerOptions } from './types'
import { SECURITY_HEADERS } from './constants'

export const serverConfig: ServerOptions = {
  port: 3000,
  open: true,
  headers: SECURITY_HEADERS
}