import { useState, useEffect } from 'react';
import { Topic } from '../types';

// No initial topics - start with empty array
const initialTopics: Topic[] = [];

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>(() => {
    // Load topics from localStorage on initialization
    const savedTopics = localStorage.getItem('pg_dissertation_topics');
    if (savedTopics) {
      try {
        return JSON.parse(savedTopics);
      } catch (error) {
        console.error('Error parsing saved topics:', error);
        return initialTopics;
      }
    }
    return initialTopics;
  });

  // Save topics to localStorage whenever topics change
  useEffect(() => {
    localStorage.setItem('pg_dissertation_topics', JSON.stringify(topics));
  }, [topics]);

  const addTopic = async (topicData: Partial<Topic>) => {
    try {
      // Call backend API to save project to database
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: topicData.student_id || 'current_student',
          title: topicData.title || '',
          description: topicData.description || '',
          specialization: topicData.domain || '',
          keywords: topicData.keywords || [],
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit project');
      }

      // Create topic object for local state
      const newTopic: Topic = {
        id: result.project.id || `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: topicData.title || '',
        description: topicData.description || '',
        keywords: topicData.keywords || [],
        domain: topicData.domain || '',
        methodology: topicData.methodology || '',
        objectives: topicData.objectives || '',
        expected_outcomes: topicData.expected_outcomes || '',
        student_id: topicData.student_id || 'current_student',
        guide_id: topicData.guide_id,
        co_guide_id: topicData.co_guide_id,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        similarity_score: Math.floor(Math.random() * 30) + 10,
        ethics_approval_required: topicData.ethics_approval_required || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...topicData,
      };

      setTopics(prevTopics => [...prevTopics, newTopic]);
      console.log('✅ Project saved to database:', result.project);
      return newTopic;
    } catch (error) {
      console.error('❌ Error saving project:', error);
      throw error;
    }
  };

  const updateTopic = (topicId: string, updates: Partial<Topic>) => {
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === topicId
          ? { ...topic, ...updates, updated_at: new Date().toISOString() }
          : topic
      )
    );
  };

  const deleteTopic = (topicId: string) => {
    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
  };

  const getTopicsByStudent = (studentId: string) => {
    return topics.filter(topic => topic.student_id === studentId);
  };

  const getTopicsByGuide = (guideId: string) => {
    return topics.filter(topic => topic.guide_id === guideId || topic.co_guide_id === guideId);
  };

  const getTopicsByStatus = (status: string) => {
    return topics.filter(topic => topic.status === status);
  };

  return {
    topics,
    addTopic,
    updateTopic,
    deleteTopic,
    getTopicsByStudent,
    getTopicsByGuide,
    getTopicsByStatus,
  };
};