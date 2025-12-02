import React, { useState, useEffect } from 'react';
import { Users, UserCheck, AlertCircle, CheckCircle, Clock, BookOpen, Mail, Phone } from 'lucide-react';
import { getAllUsers, getStudentProjects, allocateGuideToStudent, allocateCoordinatorToStudent } from '../../services/databaseService';

interface Student {
  id: string;
  full_name: string;
  email: string;
  student_id: string;
  department: string;
  specialization: string;
  project_id?: string;
}

interface Guide {
  id: string;
  full_name: string;
  email: string;
  department: string;
  specialization: string;
  expertise: string[];
  max_students: number;
  current_students: number;
  availability_status: string;
}

interface Project {
  id: string;
  student_id: string;
  title: string;
  description: string;
  specialization: string;
  status: string;
  created_at: string;
  guide_id?: string;
}

interface StudentGroup {
  id: string;
  name: string;
  students: Student[];
  project: Project | null;
  assigned_guide: Guide | null;
  specialization: string;
  created_at: string;
}

interface GroupGuideAllocationProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocationChange: () => void;
}

export const GroupGuideAllocation: React.FC<GroupGuideAllocationProps> = ({
  isOpen,
  onClose,
  onAllocationChange
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup | null>(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersData, projectsData] = await Promise.all([
        getAllUsers(),
        getStudentProjects()
      ]);

      const studentsData = usersData.filter(user => user.role === 'student');
      const guidesData = usersData.filter(user => user.role === 'guide').map(guide => ({
        ...guide,
        expertise: guide.expertise && guide.expertise.length > 0 
          ? guide.expertise 
          : ['Machine Learning', 'Data Science', 'Software Engineering', 'AI Research'],
        max_students: guide.max_students || 5,
        current_students: guide.current_students || 0,
        availability_status: guide.availability_status || 'available'
      }));

      setStudents(studentsData);
      setGuides(guidesData);
      setProjects(projectsData);

      // Create student groups (mock data - in real app, this would come from database)
      const mockGroups: StudentGroup[] = [
        {
          id: 'group1',
          name: 'AI Research Group',
          students: studentsData.slice(0, 3),
          project: projectsData[0] || null,
          assigned_guide: null,
          specialization: 'Machine Learning',
          created_at: new Date().toISOString()
        },
        {
          id: 'group2',
          name: 'Data Science Group',
          students: studentsData.slice(3, 5),
          project: projectsData[1] || null,
          assigned_guide: null,
          specialization: 'Data Science',
          created_at: new Date().toISOString()
        }
      ];

      setGroups(mockGroups);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBestGuideForGroup = (group: StudentGroup): Guide | null => {
    if (!group.specialization) return null;

    // Find guides with matching specialization and availability
    const availableGuides = guides.filter(guide => 
      guide.availability_status === 'available' && 
      guide.current_students < guide.max_students &&
      (guide.specialization.toLowerCase().includes(group.specialization.toLowerCase()) ||
       guide.expertise.some(exp => exp.toLowerCase().includes(group.specialization.toLowerCase())))
    );

    if (availableGuides.length === 0) return null;

    // Sort by current load (prefer guides with fewer students)
    return availableGuides.sort((a, b) => a.current_students - b.current_students)[0];
  };

  const handleAllocateGuide = (group: StudentGroup) => {
    setSelectedGroup(group);
    setShowAllocationModal(true);
  };

  const handleConfirmAllocation = async (guide: Guide) => {
    if (!selectedGroup) return;

    setLoading(true);
    try {
      // Call API to assign guide to all students in the group
      const { allocateGuideToGroup } = await import('../../services/databaseService');
      
      // Extract student IDs - use student_id field if available, otherwise use id
      const studentIds = selectedGroup.students.map(s => {
        // Priority: student_id field > id field
        const studentId = s.student_id || s.id;
        console.log(`Student: ${s.full_name}, student_id: ${s.student_id}, id: ${s.id}, using: ${studentId}`);
        return studentId;
      });
      
      console.log('Allocating guide:', {
        groupId: selectedGroup.id,
        guideId: guide.id,
        studentIds: studentIds
      });
      
      const result = await allocateGuideToGroup(studentIds, guide.id);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to assign guide');
      }

      // Update local state
      setGroups(prev => prev.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, assigned_guide: guide }
          : group
      ));

      // Update guide's current students count
      setGuides(prev => prev.map(g => 
        g.id === guide.id 
          ? { ...g, current_students: g.current_students + selectedGroup.students.length }
          : g
      ));

      alert(`Guide ${guide.full_name} assigned to ${selectedGroup.name} successfully!\n${result.message}`);
      setShowAllocationModal(false);
      setSelectedGroup(null);
      onAllocationChange();
    } catch (error) {
      console.error('Allocation error:', error);
      alert('Guide allocation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGuideLoadPercentage = (guide: Guide) => {
    return (guide.current_students / guide.max_students) * 100;
  };

  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
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
              <h2 className="text-2xl font-bold text-gray-900">Group Guide Allocation</h2>
              <p className="text-gray-600">Assign guides to student groups based on project specialization</p>
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
          {/* Student Groups */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Groups</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{group.name}</h4>
                      <p className="text-sm text-gray-600">{group.specialization}</p>
                      <p className="text-xs text-gray-500">{group.students.length} student{group.students.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      {group.assigned_guide ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span className="font-medium text-green-900">Guide Assigned</span>
                          </div>
                          <p className="text-sm text-green-800">{group.assigned_guide.full_name}</p>
                          <p className="text-xs text-green-600">{group.assigned_guide.specialization}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAllocateGuide(group)}
                          disabled={loading}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          {loading ? 'Allocating...' : 'Allocate Guide'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Students in Group */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Students:</p>
                    {group.students.map((student) => (
                      <div key={student.id} className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{student.full_name}</span>
                        <span className="ml-2 text-gray-400">({student.student_id})</span>
                      </div>
                    ))}
                  </div>

                  {/* Project Info */}
                  {group.project && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Project:</span>
                        <span className="ml-2">{group.project.title}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Available Guides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => {
                const loadPercentage = getGuideLoadPercentage(guide);
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
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {guide.availability_status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Student Load</span>
                          <span>{guide.current_students}/{guide.max_students}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getLoadColor(loadPercentage)}`}
                            style={{ width: `${Math.min(loadPercentage, 100)}%` }}
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
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{guide.email}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Allocation Modal */}
        {showAllocationModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Allocate Guide</h3>
                  <p className="text-gray-600">Assign a guide to {selectedGroup.name}</p>
                </div>
                <button
                  onClick={() => setShowAllocationModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <AlertCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Guide:</h4>
                  {(() => {
                    const recommendedGuide = getBestGuideForGroup(selectedGroup);
                    return recommendedGuide ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-blue-900">{recommendedGuide.full_name}</h5>
                            <p className="text-sm text-blue-700">{recommendedGuide.specialization}</p>
                            <p className="text-xs text-blue-600">Load: {recommendedGuide.current_students}/{recommendedGuide.max_students}</p>
                          </div>
                          <button
                            onClick={() => handleConfirmAllocation(recommendedGuide)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No suitable guide found for this specialization</p>
                    );
                  })()}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">All Available Guides:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {guides.map((guide) => (
                      <div key={guide.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{guide.full_name}</h5>
                          <p className="text-sm text-gray-600">{guide.specialization}</p>
                          <p className="text-xs text-gray-500">Load: {guide.current_students}/{guide.max_students}</p>
                        </div>
                        <button
                          onClick={() => handleConfirmAllocation(guide)}
                          disabled={guide.current_students >= guide.max_students}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};










