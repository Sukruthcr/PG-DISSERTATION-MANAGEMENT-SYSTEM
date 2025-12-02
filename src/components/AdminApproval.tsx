import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Mail, Phone, Building, GraduationCap, AlertCircle } from 'lucide-react';
import { PendingUser, approvePendingUser, rejectPendingUser, getPendingUsers } from '../services/databaseService';

interface AdminApprovalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprovalChange: () => void;
}

export const AdminApproval: React.FC<AdminApprovalProps> = ({
  isOpen,
  onClose,
  onApprovalChange,
}) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPendingUsers();
    }
  }, [isOpen]);

  const loadPendingUsers = async () => {
    const users = await getPendingUsers();
    setPendingUsers(users);
  };

  const handleApprove = async (user: PendingUser) => {
    if (!confirm(`Are you sure you want to approve ${user.full_name}'s registration?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await approvePendingUser(user.id, 'admin'); // In real app, use actual admin ID
      if (response.success) {
        alert('User approved successfully!');
        // Refresh pending users list
        await loadPendingUsers();
        // Notify parent component to refresh user management
        onApprovalChange();
      } else {
        alert(response.message || 'Approval failed');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Approval failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (user: PendingUser) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setLoading(true);
    try {
      const response = await rejectPendingUser(user.id, 'admin', rejectionReason); // In real app, use actual admin ID
      if (response.success) {
        alert('User registration rejected.');
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedUser(null);
        loadPendingUsers();
        onApprovalChange();
      } else {
        alert(response.message || 'Rejection failed');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Rejection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openRejectionModal = (user: PendingUser) => {
    setSelectedUser(user);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pending User Approvals</h2>
              <p className="text-gray-600">Review and approve user registration requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
              <p className="text-gray-600">All registration requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => {
                const StatusIcon = getStatusIcon(user.status);
                return (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {user.department}
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {user.specialization}
                            </div>
                            {user.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status)}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {user.status.toUpperCase()}
                        </div>
                        {user.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(user)}
                              disabled={loading}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectionModal(user)}
                              disabled={loading}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-700">Requested Role:</label>
                        <p className="text-gray-900 capitalize">{user.requested_role ? user.requested_role.replace('_', ' ') : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Requested At:</label>
                        <p className="text-gray-900">{new Date(user.requested_at).toLocaleString()}</p>
                      </div>
                      {user.student_id && (
                        <div>
                          <label className="font-medium text-gray-700">Student ID:</label>
                          <p className="text-gray-900">{user.student_id}</p>
                        </div>
                      )}
                      {user.employee_id && (
                        <div>
                          <label className="font-medium text-gray-700">Employee ID:</label>
                          <p className="text-gray-900">{user.employee_id}</p>
                        </div>
                      )}
                    </div>

                    {user.status === 'rejected' && user.rejection_reason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-900">Rejection Reason:</p>
                            <p className="text-red-800 text-sm">{user.rejection_reason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {user.status === 'approved' && user.reviewed_at && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <p className="text-green-800 text-sm">
                            Approved on {new Date(user.reviewed_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {showRejectionModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Reject Registration Request
                </h3>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for rejecting {selectedUser.full_name}'s registration:
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter rejection reason..."
                />
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectionModal(false);
                      setSelectedUser(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedUser)}
                    disabled={loading || !rejectionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
