export interface AuditRecord {
  action: string
  timestamp: string
  user: {
    name: string
    user_identifier: string
  }
}
