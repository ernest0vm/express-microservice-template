import { ErrorMessage } from '../types'

const messages: Record<string, ErrorMessage> = {
  notAuthenticated: {
    code: 'EA0002',
    userMessage: 'E0010',
    message: 'Not authenticated'
  },
  tokenExpired: {
    code: 'EA0003',
    userMessage: 'E0011',
    message: 'Token expired'
  },
  userHaventRoles: {
    code: 'EA0004',
    userMessage: 'E0012',
    message: 'User does not have required roles'
  },
  invalidCredentials: {
    code: 'EA0005',
    userMessage: 'E0013',
    message: 'Invalid credentials'
  },
  credentialsRequired: {
    code: 'EA0006',
    userMessage: 'E0014',
    message: 'Username and password are required'
  },
  nameIsRequired: {
    code: 'EA0010',
    userMessage: 'E0020',
    message: 'Name is required'
  }
}

export default messages
