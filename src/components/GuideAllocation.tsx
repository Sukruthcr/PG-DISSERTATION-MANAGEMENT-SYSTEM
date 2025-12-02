import React, { useState, useEffect } from 'react';
import { Users, UserCheck, AlertCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { 
  UserWithExpertise, 
  StudentProject, 
  StudentGuideAssignment, 
  getGuides, 
  getStudentProjects, 
  allocateGuideToStudent 
} from '../services/databaseService.ts';

interface GuideAllocationProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocationChange: () => void;
}

export const GuideAllocation: React.FC<GuideAllocationProps> = ({
  isOpen,
  onClose,
  onAllocationChange,
}) => {
  const [guides, setGuides] = useState<UserWithExpertise[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [assignments, setAssignments] = useState<StudentGuideAssignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const guidesData = await getGuides();
      const projectsData = await getStudentProjects();
      
      // Convert User[] to UserWithExpertise[] with default values
      const guidesWithExpertise: UserWithExpertise[] = guidesData.map(guide => ({
        ...guide,
        expertise: guide.expertise || ['Machine Learning', 'Data Science', 'Software Engineering'],
        availability_status: guide.availability_status || 'available' as const,
        max_students: guide.max_students || 5,
        current_students: guide.current_students || 0
      }));
      setGuides(guidesWithExpertise);
      setProjects(projectsData);
      
      // Derive assignments from projects that have guide_id
      const derivedAssignments: StudentGuideAssignment[] = projectsData
        .filter(p => p.guide_id)
        .map(p => ({
          id: `assignment_${p.id}`,
          student_id: p.student_id,
          guide_id: p.guide_id!,
          project_id: p.id,
          assigned_at: p.updated_at,
          assignment_reason: 'Assigned via admin panel',
          status: 'active' as const
        }));
      setAssignments(derivedAssignments);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Failed to load data. Please try again.');
    }
  };

  const handleAllocateGuide = async (project: StudentProject) => {
    if (!confirm(`Are you sure you want to automatically allocate a guide for "${project.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await allocateGuideToStudent(project.student_id, project.id);
      if (response.success) {
        const assignedGuide = guides.find(g => g.id === response.assignment.guide_id);
        alert(`Guide ${assignedGuide?.full_name || 'Unknown'} assigned successfully!`);
        loadData();
        onAllocationChange();
      } else {
        alert(response.message || 'Guide allocation failed');
      }
    } catch (error) {
      console.error('Allocation error:', error);
      alert('Guide allocation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProjectAssignment = (projectId: string) => {
    return assignments.find(assignment => assignment.project_id === projectId);
  };

  const getGuideForProject = (projectId: string) => {
    const assignment = getProjectAssignment(projectId);
    if (assignment) {
      return guides.find(guide => guide.id === assignment.guide_id);
    }
    return null;
  };

  const getUnassignedProjects = () => {
    return projects.filter(project => !getProjectAssignment(project.id));
  };

  const getAssignedProjects = () => {
    return projects.filter(project => getProjectAssignment(project.id));
  };

  const getGuideLoad = (guideId: string) => {
    const guide = guides.find(g => g.id === guideId);
    if (!guide) return { current: 0, max: 0, percentage: 0 };
    
    const current = guide.current_students || 0;
    const max = guide.max_students || 0;
    const percentage = max > 0 ? (current / max) * 100 : 0;
    
    return { current, max, percentage };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Guide Allocation Management</h2>
              <p className="text-gray-600">Automatic guide allocation based on expertise matching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <AlertCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Guide Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => {
                const load = getGuideLoad(guide.id);
                return (
                  <div key={guide.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{guide.full_name}</h4>
                        <p className="text-sm text-gray-600">{guide.specialization}</p>
                        <p className="text-xs text-gray-500">{guide.department}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guide.availability_status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : guide.availability_status === 'busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {guide.availability_status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Student Load</span>
                          <span>{load.current}/{load.max}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              load.percentage > 80 ? 'bg-red-500' : 
                              load.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(load.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expertise:</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.expertise.slice(0, 3).map((exp, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {exp}
                            </span>
                          ))}
                          {guide.expertise.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                              +{guide.expertise.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unassigned Projects */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unassigned Projects</h3>
            {getUnassignedProjects().length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">All projects have been assigned guides!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getUnassignedProjects().map((project) => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                        onClick={() => handleAllocateGuide(project)}
                        disabled={loading}
                        className="ml-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        {loading ? 'Allocating...' : 'Allocate Guide'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Projects */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Projects</h3>
            {getAssignedProjects().length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No projects have been assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getAssignedProjects().map((project) => {
                  const assignment = getProjectAssignment(project.id);
                  const guide = getGuideForProject(project.id);
                  return (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {project.specialization}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Assigned: {assignment ? new Date(assignment.assigned_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          {guide && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center mb-1">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                <span className="font-medium text-green-900">Assigned Guide</span>
                              </div>
                              <p className="text-sm text-green-800">{guide.full_name}</p>
                              <p className="text-xs text-green-600">{guide.specialization}</p>
                              {assignment && (
                                <p className="text-xs text-green-600 mt-1">
                                  Reason: {assignment.assignment_reason}
                                </p>
                              )}
                            </div>
                          )}
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
    </div>
  );
};
