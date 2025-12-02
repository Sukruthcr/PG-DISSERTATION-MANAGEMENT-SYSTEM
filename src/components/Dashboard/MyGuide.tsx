import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Clock, MessageCircle, Calendar, Building, GraduationCap } from 'lucide-react';
import { getGuideForStudent, getCoordinatorForStudent } from '../../services/databaseService';

interface MyGuideProps {
  studentId?: string;
}

interface GuideInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  specialization: string;
  expertise?: string[];
  availability_status?: string;
  office_location?: string;
  consultation_hours?: string;
}

interface CoordinatorInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  specialization: string;
  office_location?: string;
  consultation_hours?: string;
}

export const MyGuide: React.FC<MyGuideProps> = ({ studentId }) => {
  const [guide, setGuide] = useState<GuideInfo | null>(null);
  const [coordinator, setCoordinator] = useState<CoordinatorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuideAndCoordinator = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!studentId) throw new Error('Missing studentId');
        const [guideResp, coordResp] = await Promise.all([
          getGuideForStudent(studentId),
          getCoordinatorForStudent(studentId)
        ]);
        if (guideResp) {
          setGuide({
            id: guideResp.id,
            full_name: guideResp.full_name,
            email: guideResp.email,
            phone: guideResp.phone,
            department: guideResp.department,
            specialization: guideResp.specialization,
            expertise: ['Machine Learning', 'Data Science', 'AI Research'],
            availability_status: 'available',
            office_location: 'Building A, Room 205',
            consultation_hours: 'Mon-Fri 2:00 PM - 4:00 PM'
          });
        } else {
          setGuide(null);
        }

        if (coordResp) {
          setCoordinator({
            id: coordResp.id,
            full_name: coordResp.full_name,
            email: coordResp.email,
            phone: coordResp.phone,
            department: coordResp.department,
            specialization: coordResp.specialization,
            office_location: 'Building A, Room 101',
            consultation_hours: 'Mon-Fri 9:00 AM - 5:00 PM'
          });
        } else {
          setCoordinator(null);
        }
      } catch (err) {
        console.error('Error fetching guide and coordinator:', err);
        setError('Failed to load guide information');
      } finally {
        setLoading(false);
      }
    };

    fetchGuideAndCoordinator();
  }, [studentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading guide information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Guide & Coordinator</h3>
          <p className="text-gray-600">Contact information for your academic support team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guide Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <GraduationCap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Research Guide</h4>
              <p className="text-sm text-gray-600">Your assigned academic guide</p>
            </div>
          </div>

          {guide ? (
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-900">{guide.full_name}</h5>
                <p className="text-sm text-gray-600">{guide.specialization}</p>
                <p className="text-xs text-gray-500">{guide.department}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a href={`mailto:${guide.email}`} className="hover:text-blue-600">
                    {guide.email}
                  </a>
                </div>
                
                {guide.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`tel:${guide.phone}`} className="hover:text-blue-600">
                      {guide.phone}
                    </a>
                  </div>
                )}

                {guide.office_location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{guide.office_location}</span>
                  </div>
                )}

                {guide.consultation_hours && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{guide.consultation_hours}</span>
                  </div>
                )}
              </div>

              {guide.expertise && guide.expertise.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Areas of Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {guide.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </button>
                <button className="flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No guide assigned yet</p>
              <p className="text-xs text-gray-400 mt-1">Contact coordinator for assignment</p>
            </div>
          )}
        </div>

        {/* Coordinator Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Department Coordinator</h4>
              <p className="text-sm text-gray-600">Department administration contact</p>
            </div>
          </div>

          {coordinator ? (
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-900">{coordinator.full_name}</h5>
                <p className="text-sm text-gray-600">{coordinator.specialization}</p>
                <p className="text-xs text-gray-500">{coordinator.department}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a href={`mailto:${coordinator.email}`} className="hover:text-blue-600">
                    {coordinator.email}
                  </a>
                </div>
                
                {coordinator.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`tel:${coordinator.phone}`} className="hover:text-blue-600">
                      {coordinator.phone}
                    </a>
                  </div>
                )}

                {coordinator.office_location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{coordinator.office_location}</span>
                  </div>
                )}

                {coordinator.consultation_hours && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{coordinator.consultation_hours}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <button className="flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </button>
                <button className="flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No coordinator information available</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Contact Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h5 className="font-medium text-gray-900 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message to Guide
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Request Meeting
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm">
            <Phone className="h-4 w-4 mr-2" />
            Contact Coordinator
          </button>
        </div>
      </div>
    </div>
  );
};
