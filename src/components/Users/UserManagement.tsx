import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, Building, X, Save } from 'lucide-react';
import { User, UserRole } from '../../types';
import { UserRegistration } from '../UserRegistration';
import { getAllUsers, getPendingUsers, updateUser, deleteUser, deletePendingUser } from '../../services/databaseService';

interface UserManagementProps {
  userRole: string;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  userRole,
  onCreateUser,
  onEditUser,
  onDeleteUser
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    email: '',
    role: 'student' as UserRole,
    department: '',
    specialization: '',
    phone: '',
    student_id: '',
    employee_id: '',
    max_students: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const [allUsers, pendingUsersData] = await Promise.all([
          getAllUsers(),
          getPendingUsers()
        ]);
        setUsers(allUsers);
        setPendingUsers(pendingUsersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allUsers, pendingUsersData] = await Promise.all([
        getAllUsers(),
        getPendingUsers()
      ]);
      setUsers(allUsers);
      setPendingUsers(pendingUsersData);
    } catch (err) {
      console.error('Error refreshing users:', err);
      setError('Failed to refresh users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  // Set default role filter to 'all' to show all roles including guide and coordinator
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Combine approved and pending users for display
  const allUsersWithStatus = [
    ...users.map(user => ({ ...user, status: 'Active' as const })),
    ...pendingUsers.map(pendingUser => ({
      id: pendingUser.id,
      email: pendingUser.email,
      full_name: pendingUser.full_name,
      role: pendingUser.requested_role,
      department: pendingUser.department,
      specialization: pendingUser.specialization,
      phone: pendingUser.phone,
      student_id: pendingUser.student_id,
      employee_id: pendingUser.employee_id,
      created_at: pendingUser.requested_at,
      updated_at: pendingUser.requested_at,
      status: 'Pending' as const
    }))
  ];

  const filteredUsers = allUsersWithStatus.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.student_id && user.student_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.employee_id && user.employee_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = [...new Set(allUsersWithStatus.map(u => u.department).filter(Boolean))];
  const roles = [...new Set(allUsersWithStatus.map(u => u.role))];

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      coordinator: 'bg-purple-100 text-purple-800',
      guide: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      ethics_committee: 'bg-orange-100 text-orange-800',
      examiner: 'bg-teal-100 text-teal-800',
      unknown: 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'student',
      department: user.department || '',
      specialization: user.specialization || '',
      phone: user.phone || '',
      student_id: user.student_id || '',
      employee_id: user.employee_id || '',
      max_students: user.max_students ? user.max_students.toString() : '',
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    console.log('Attempting to delete user:', user);
    if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      try {
        let response;
        console.log('User status:', user.status);
        if (user.status === 'Pending') {
          console.log('Calling deletePendingUser for user ID:', user.id);
          response = await deletePendingUser(user.id);
        } else {
          console.log('Calling deleteUser for user ID:', user.id);
          response = await deleteUser(user.id);
        }
        console.log('Delete user response:', response);
        if (response && response.success) {
          console.log('Delete successful, refreshing user data');
          await refreshUserData();
          alert('User deleted successfully');
        } else {
          console.error('Delete failed with response:', response);
          alert(`Failed to delete user. Reason: ${response?.message || 'An unknown server error occurred.'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error instanceof Error ? error.message : 'Please try again.';
        alert(`Failed to delete user: ${errorMessage}`);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const updates = {
        full_name: editFormData.full_name,
        email: editFormData.email,
        role: editFormData.role,
        department: editFormData.department,
        specialization: editFormData.specialization,
        phone: editFormData.phone,
        student_id: editFormData.student_id || undefined,
        employee_id: editFormData.employee_id || undefined,
        max_students: editFormData.max_students ? Number(editFormData.max_students) : undefined,
      };

      const response = await updateUser(editingUser.id, updates);
      if (response.success) {
        await refreshUserData();
        setShowEditModal(false);
        setEditingUser(null);
        alert('User updated successfully');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserRegistered = async () => {
    await refreshUserData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage system users and their roles</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage system users and their roles</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Users</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        {(userRole === 'admin' || userRole === 'coordinator') && (
          <button
            onClick={() => setShowRegistration(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {(role || 'unknown').replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={`${user.id}-${user.status}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {(user.role || 'unknown').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status || 'Active')}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user as User)}
                        className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user as User)}
                        className="inline-flex items-center px-3 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-sm text-gray-500" colSpan={6}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">Add User</h3>
              <button onClick={() => setShowRegistration(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <UserRegistration onSuccess={handleUserRegistered} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    value={editFormData.full_name}
                    onChange={(e) => handleEditFormChange('full_name', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    value={editFormData.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => handleEditFormChange('role', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{(role || 'unknown').replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    value={editFormData.department}
                    onChange={(e) => handleEditFormChange('department', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    value={editFormData.specialization}
                    onChange={(e) => handleEditFormChange('specialization', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    value={editFormData.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    value={editFormData.student_id}
                    onChange={(e) => handleEditFormChange('student_id', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <input
                    value={editFormData.employee_id}
                    onChange={(e) => handleEditFormChange('employee_id', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Students</label>
                  <input
                    value={editFormData.max_students}
                    onChange={(e) => handleEditFormChange('max_students', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-md border border-gray-300">Cancel</button>
                <button onClick={handleUpdateUser} className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
 
