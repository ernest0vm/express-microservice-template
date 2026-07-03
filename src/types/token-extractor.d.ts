declare module 'token-extractor' {
  import { Request } from 'express'

  function bearer(req: Request, callback: (err: Error | null, token: string) => void): void

  export = bearer
}
