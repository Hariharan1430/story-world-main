import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import moment from 'moment';

interface Story {
  _id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  createdBy: string;
  createdAt: string;
}

const Stories: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Draft');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStories = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/stories`, {
        params: { status },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStories(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories('Draft');
  }, []);

  const handleTabClick = (status: string) => {
    setActiveTab(status);
    fetchStories(status);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Stories</h2>
        <button
          onClick={() => navigate('/create-story')}
          className="px-4 py-2 border rounded-md bg-blue-500 text-white"
        >
          Create Story
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'Draft'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600'
            }`}
          onClick={() => handleTabClick('Draft')}
        >
          Draft
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'Published'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600'
            }`}
          onClick={() => handleTabClick('Published')}
        >
          Published
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {stories.length === 0 ? (
              <p>No stories found.</p>
            ) : (
              <ul>
                {stories.map((story) => (
                  <li key={story._id} className="mb-4 border-b pb-4">
                    <div className="flex items-start">
                      <img src={story.thumbnailUrl} alt={story.title} className="w-24 h-24 rounded-md mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link to={`/story-preview/${story._id}`} className="text-blue-600 hover:underline">
                            {story.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{story.summary}</p>
                        <p className="text-sm text-gray-600"><strong>Created by:</strong> {story.createdBy}</p>
                        <p className="text-sm text-gray-600"><strong>Created on:</strong> {moment(story.createdAt).format('MMM D, YYYY')}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;