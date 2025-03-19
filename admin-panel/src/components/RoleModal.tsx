import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        description: ''
    });

    const handleSave = async () => {
        const newErrors = {
            name: '',
            description: ''
        };

        if (!name) newErrors.name = 'Name is required';
        if (!description) newErrors.description = 'Description is required';

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        try {
            await axios.post(`${API_URL}/roles`, {
                name,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onSave();
            onClose();
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Add Role</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 border rounded-md bg-blue-500 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;