import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import moment from 'moment';
import { Loader2 } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Story {
  _id: string;
  title: string;
  genre: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/stories`, {
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

    fetchStories();
  }, []);

  const storiesToday = stories.filter(story => moment(story.createdAt).isSame(moment(), 'day')).length;
  const storiesThisWeek = stories.filter(story => moment(story.createdAt).isSame(moment(), 'week')).length;
  const storiesThisMonth = stories.filter(story => moment(story.createdAt).isSame(moment(), 'month')).length;

  const storiesByGenre = stories.reduce((acc, story) => {
    acc[story.genre] = (acc[story.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
      {
        label: 'Number of Stories',
        data: [storiesToday, storiesThisWeek, storiesThisMonth],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(storiesByGenre),
    datasets: [
      {
        label: 'Stories by Genre',
        data: Object.values(storiesByGenre),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Stories Created',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-16 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
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
          <div className="flex justify-between mb-8">
            <div className="w-1/2 pr-2">
              <h3 className="text-xl font-semibold mb-4">Stories Created</h3>
              <Bar data={barData} options={barOptions} />
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="text-xl font-semibold mb-4">Stories by Genre</h3>
              <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Stories by Genre' } } }} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Stories</h3>
            <ul>
              {stories.slice(0, 5).map(story => (
                <li key={story._id} className="mb-2">
                  <p className="text-sm text-gray-600">
                    <Link to={`/story-preview/${story._id}`} className="text-blue-600 hover:underline">
                      <strong>{story.title}</strong>
                    </Link> - {moment(story.createdAt).format('MMM D, YYYY')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;