import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserManagement from '../UserManagement';
import * as api from '../../services/databaseService';

jest.mock('../../services/databaseService');

const mockUsers = [
  {
    id: '1',
    full_name: 'Department Coordinator',
    role: 'coordinator',
    email: 'coordinator@example.com',
    department: 'Computer Science',
    status: 'Active',
  },
  {
    id: '2',
    full_name: 'Senior Guide',
    role: 'guide',
    email: 'guide@example.com',
    department: 'Computer Science',
    status: 'Active',
  },
  {
    id: '3',
    full_name: 'Student User',
    role: 'student',
    email: 'student@example.com',
    department: 'Computer Science',
    status: 'Active',
  },
];

const mockPendingUsers = [];

describe('UserManagement Component', () => {
  beforeEach(() => {
    (api.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    (api.getPendingUsers as jest.Mock).mockResolvedValue(mockPendingUsers);
  });

  test('renders all user roles including coordinator and guide', async () => {
    render(<UserManagement userRole="admin" onCreateUser={() => {}} onEditUser={() => {}} onDeleteUser={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Department Coordinator')).toBeInTheDocument();
      expect(screen.getByText('Senior Guide')).toBeInTheDocument();
      expect(screen.getByText('Student User')).toBeInTheDocument();
    });
  });

  test('filters users by role', async () => {
    render(<UserManagement userRole="admin" onCreateUser={() => {}} onEditUser={() => {}} onDeleteUser={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Department Coordinator')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox', { name: /all roles/i }), { target: { value: 'guide' } });

    await waitFor(() => {
      expect(screen.queryByText('Department Coordinator')).not.toBeInTheDocument();
      expect(screen.getByText('Senior Guide')).toBeInTheDocument();
    });
  });
});
