import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import RoleModal from '../components/RoleModal';
import { Loader2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

interface Role {
  _id: string;
  name: string;
  description: string;
}

const UserRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/userRoles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch roles');
        }

        setRoles(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const paginatedRoles = useMemo(() => {
    const start = currentPage * pageSize;
    return roles.slice(start, start + pageSize);
  }, [roles, currentPage, pageSize]);

  const pageCount = Math.ceil(roles.length / pageSize);

  const handleSave = () => {
    setIsModalOpen(false);
    // Refresh the roles list
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/userRoles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch roles');
        }

        setRoles(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-16" style={{ marginTop: '4rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">User Roles</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 border rounded-md bg-blue-500 text-white"
        >
          Add Role
        </button>
      </div>
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRoles.map((role, index) => (
              <tr key={role._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {currentPage * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {role.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {role.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <select
            className="border rounded-md px-3 py-2"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(0)}
          >
            <ChevronFirst />
          </button>
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft />
          </button>
          <span className="text-sm">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage + 1 === pageCount}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight />
          </button>
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage + 1 === pageCount}
            onClick={() => setCurrentPage(pageCount - 1)}
          >
            <ChevronLast />
          </button>
        </div>
      </div>
      <RoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
};

export default UserRoles;