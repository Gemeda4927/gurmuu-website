// Export everything from the admin API
export * from './admin';

// Export store and hook
export { useAdminStore, adminSelectors } from '../store/admin.store';
export { useAdmin } from '../hooks/useAdmin';

// Export types
export type { User, CreateUserRequest, UpdateUserRequest } from './admin';
export type { AdminStoreState } from '../store/admin.store';
export type { UseAdminReturn } from '../hooks/useAdmin';