// Shared frontend types. Expanded stage by stage as each feature lands.

export type UserRole = 'admin' | 'verification_officer' | 'data_entry_operator'

export interface AppUser {
  uid: string
  email: string
  displayName?: string
  role: UserRole
}
