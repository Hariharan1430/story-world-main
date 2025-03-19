import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface Story {
    _id: string;
    title: string;
    genre: string;
    summary: string;
    content: string;
    imageUrl: string;
    thumbnailUrl: string;
    status: string;
    createdBy: string;
    createdAt: string;
}

const StoryPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_URL}/stories/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStory(response.data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [id]);

    const handlePublish = async () => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/stories/publish`, null, {
                params: { id },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/stories');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="p-6">
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
                        story && (
                            <div className="max-w-3xl mx-auto">
                                <img src={story.imageUrl} alt={story.title} className="w-full h-auto rounded-md mb-4" />
                                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                                <p className="text-sm text-gray-600 mb-4"><strong>Genre:</strong> {story.genre}</p>
                                <p className="text-sm text-gray-600 mb-4"><strong>Summary:</strong> {story.summary}</p>
                                <div className="prose">
                                    <p>{story.content}</p>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="px-4 py-2 border rounded-md bg-gray-200 mr-4"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        className="px-4 py-2 border rounded-md bg-blue-500 text-white"
                                    >
                                        Publish
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryPreview;