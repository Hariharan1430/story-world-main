import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CreateStory: React.FC = () => {
    const [description, setDescription] = useState('');
    const [wordsCount, setWordsCount] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        description: '',
        wordsCount: '',
    });
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {
            description: '',
            wordsCount: '',
        };

        if (!description) newErrors.description = 'Description is required';
        if (!wordsCount) newErrors.wordsCount = 'Words count is required';

        setErrors(newErrors);

        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const user = localStorage.getItem('user');
            let uid;
            if (user) {
                uid = JSON.parse(user).uid;
            }

            if (!uid) {
                throw new Error('User ID not found in local storage');
            }

            const response = await axios.post(
                `${API_URL}/stories`,
                {
                    description,
                    wordCount: wordsCount,
                    uid,
                    byContentCreator: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const storyId = response.data._id;
            navigate(`/story-preview/${storyId}`);
        } catch (error) {
            console.error('Error creating story:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create Story</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 p-2 border rounded-md w-full"
                                rows={5}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Words Count <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={wordsCount}
                                onChange={(e) => setWordsCount(e.target.value)}
                                className="mt-1 p-2 border rounded-md w-full"
                            />
                            {errors.wordsCount && <p className="text-red-500 text-xs mt-1">{errors.wordsCount}</p>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => navigate('/stories')}
                                className="px-4 py-2 border rounded-md bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border rounded-md bg-blue-500 text-white"
                            >
                                Create Story
                            </button>
                        </div>
                    </form>
                    {loading && (
                        <div className="flex items-center justify-center mt-4">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateStory;