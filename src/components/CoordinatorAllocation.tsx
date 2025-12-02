import React, { useState, useEffect } from 'react';
import { Users, UserCheck, AlertCircle, CheckCircle, Clock, BookOpen, X } from 'lucide-react';
import { 
  User, 
  StudentProject, 
  getCoordinators, 
  getStudentProjects,
  getStudents,
  allocateCoordinatorToStudent 
} from '../services/databaseService';

interface CoordinatorAllocationProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocationChange: () => void;
}

export const CoordinatorAllocation: React.FC<CoordinatorAllocationProps> = ({
  isOpen,
  onClose,
  onAllocationChange,
}) => {
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load data with individual error handling
      let coordinatorsData: User[] = [];
      let projectsData: StudentProject[] = [];
      let studentsData: User[] = [];
      
      try {
        coordinatorsData = await getCoordinators();
      } catch (err) {
        console.error('Error loading coordinators:', err);
      }
      
      try {
        projectsData = await getStudentProjects();
      } catch (err) {
        console.error('Error loading projects:', err);
      }
      
      try {
        studentsData = await getStudents();
      } catch (err) {
        console.error('Error loading students:', err);
        // Students data is optional for coordinator allocation
        // We can still show projects without student names
      }
      
      setCoordinators(coordinatorsData);
      setProjects(projectsData);
      setStudents(studentsData);
      
      if (coordinatorsData.length === 0) {
        console.warn('No coordinators found in the system');
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStudentInfo = (studentId: string) => {
    // First try to find by exact match on id or student_id
    let student = students.find(student => 
      student.id === studentId || 
      student.student_id === studentId
    );

    // If not found, try case-insensitive match and trim whitespace
    if (!student) {
      const normalizedId = studentId.trim().toLowerCase();
      student = students.find(student => 
        (student.id && student.id.trim().toLowerCase() === normalizedId) ||
        (student.student_id && student.student_id.trim().toLowerCase() === normalizedId)
      );
    }

    // If still not found, try to find by partial match in student_id
    if (!student) {
      const partialMatch = students.find(student => 
        (student.student_id && student.student_id.includes(studentId)) ||
        (student.id && student.id.includes(studentId))
      );
      if (partialMatch) {
        student = partialMatch;
      }
    }

    // Return a default object if student not found to prevent UI errors
    if (!student) {
      console.warn(`Student not found with ID: ${studentId}`);
      // Try to find the project to get more context
      const project = projects.find(p => p.id === studentId || p.student_id === studentId);
      
      // Try to find the student by project's student_id if available
      const projectStudent = project?.student_id ? students.find(s => 
        s.id === project.student_id || s.student_id === project.student_id
      ) : null;
      
      return {
        id: studentId,
        full_name: projectStudent?.full_name || project?.title || 'Student Not Found',
        email: projectStudent?.email || '',
        role: 'student' as const,
        department: projectStudent?.department || project?.specialization || '',
        specialization: projectStudent?.specialization || project?.specialization || '',
        phone: projectStudent?.phone || '',
        created_at: projectStudent?.created_at || new Date().toISOString(),
        updated_at: projectStudent?.updated_at || new Date().toISOString(),
        project_title: project?.title
      };
    }
    
    return student;
  };

  const getCoordinatorInfo = (coordinatorId: string) => {
    return coordinators.find(coord => coord.id === coordinatorId);
  };

  const handleOpenAssignModal = (project: StudentProject) => {
    setSelectedProject(project);
    setSelectedCoordinator(project.coordinator_id || '');
    setShowAssignModal(true);
  };

  const handleAssignCoordinator = async () => {
    if (!selectedProject || !selectedCoordinator) {
      alert('Please select a coordinator');
      return;
    }

    setLoading(true);
    try {
      const response = await allocateCoordinatorToStudent(
        selectedProject.student_id,
        selectedProject.id,
        selectedCoordinator
      );
      
      if (response.success) {
        const coordinator = getCoordinatorInfo(selectedCoordinator);
        alert(`Coordinator ${coordinator?.full_name || 'Unknown'} assigned successfully!`);
        setShowAssignModal(false);
        setSelectedProject(null);
        setSelectedCoordinator('');
        loadData();
        onAllocationChange();
      } else {
        alert(response.message || 'Coordinator allocation failed');
      }
    } catch (error) {
      console.error('Allocation error:', error);
      alert('Coordinator allocation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProjectsWithoutCoordinator = () => {
    return projects.filter(project => !project.coordinator_id);
  };

  const getProjectsWithCoordinator = () => {
    return projects.filter(project => project.coordinator_id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-600 p-2 rounded-lg mr-3">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Coordinator Allocation</h2>
              <p className="text-gray-600">Assign coordinators to student projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Coordinators Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Coordinators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coordinators.length === 0 ? (
                <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No coordinators available</p>
                </div>
              ) : (
                coordinators.map((coordinator) => {
                  const assignedCount = projects.filter(p => p.coordinator_id === coordinator.id).length;
                  return (
                    <div key={coordinator.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{coordinator.full_name}</h4>
                          <p className="text-sm text-gray-600">{coordinator.specialization}</p>
                          <p className="text-xs text-gray-500">{coordinator.department}</p>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Coordinator
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Assigned Students</span>
                          <span className="font-medium">{assignedCount}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Email: {coordinator.email}</p>
                          {coordinator.phone && <p>Phone: {coordinator.phone}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Projects Without Coordinator */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects Without Coordinator ({getProjectsWithoutCoordinator().length})
            </h3>
            {getProjectsWithoutCoordinator().length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">All projects have been assigned coordinators!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getProjectsWithoutCoordinator().map((project) => {
                  const student = getStudentInfo(project.student_id);
                  return (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {student?.full_name || 'Unknown Student'}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {project.specialization}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(project.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenAssignModal(project)}
                          disabled={loading || coordinators.length === 0}
                          className="ml-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Assign Coordinator
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Projects With Coordinator */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projects With Coordinator ({getProjectsWithCoordinator().length})
            </h3>
            {getProjectsWithCoordinator().length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No projects have been assigned coordinators yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getProjectsWithCoordinator().map((project) => {
                  const student = getStudentInfo(project.student_id);
                  const coordinator = getCoordinatorInfo(project.coordinator_id!);
                  return (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {student?.full_name || 'Unknown Student'}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {project.specialization}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                              <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="font-medium text-purple-900">Assigned Coordinator</span>
                            </div>
                            <p className="text-sm text-purple-800">{coordinator?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-purple-600">{coordinator?.specialization}</p>
                            <button
                              onClick={() => handleOpenAssignModal(project)}
                              className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
                            >
                              Change Coordinator
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Assign Coordinator</h3>
              <p className="text-gray-600 mt-1">
                Student: {selectedProject.student_id ? getStudentInfo(selectedProject.student_id)?.full_name || 'Student Name Not Found' : 'Student Not Found'}
                <br />
                Project: {selectedProject.title}
              </p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Coordinator
              </label>
              <select
                value={selectedCoordinator}
                onChange={(e) => setSelectedCoordinator(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">-- Select a Coordinator --</option>
                {coordinators.map((coordinator) => (
                  <option key={coordinator.id} value={coordinator.id}>
                    {coordinator.full_name} - {coordinator.specialization} ({coordinator.department})
                  </option>
                ))}
              </select>

              {selectedCoordinator && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Selected Coordinator Details</h4>
                  {(() => {
                    const coord = getCoordinatorInfo(selectedCoordinator);
                    if (!coord) return null;
                    const assignedCount = projects.filter(p => p.coordinator_id === coord.id).length;
                    return (
                      <div className="text-sm text-purple-800 space-y-1">
                        <p><strong>Name:</strong> {coord.full_name}</p>
                        <p><strong>Department:</strong> {coord.department}</p>
                        <p><strong>Specialization:</strong> {coord.specialization}</p>
                        <p><strong>Email:</strong> {coord.email}</p>
                        <p><strong>Currently Assigned:</strong> {assignedCount} student(s)</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedProject(null);
                  setSelectedCoordinator('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCoordinator}
                disabled={!selectedCoordinator || loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Assigning...' : 'Assign Coordinator'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
