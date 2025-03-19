import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import UserModal from '../components/UserModal';

interface User {
  id: string;
  name: string;
  email: string;
  avatarId: string;
  createdAt: string;
  roleName: string;
}

interface UsersProps {
  className?: string;
}

const Users: React.FC<UsersProps> = ({ className }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | "roleName";
    direction: "asc" | "desc";
  } | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRoleName = (user: User): string => user.roleName || "No Role";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((user) =>
        [user.name, user.email, getRoleName(user)]
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(searchLower))
      );
    }

    if (roleFilter) {
      result = result.filter((user) => getRoleName(user) === roleFilter);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue =
          sortConfig.key === "roleName" ? getRoleName(a) : a[sortConfig.key];
        const bValue =
          sortConfig.key === "roleName" ? getRoleName(b) : b[sortConfig.key];
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return result;
  }, [users, searchTerm, roleFilter, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const pageCount = Math.ceil(filteredUsers.length / pageSize);

  const uniqueRoles = useMemo(
    () => Array.from(new Set(users.map(getRoleName))),
    [users]
  );

  const handleSave = () => {
    setIsModalOpen(false);
    // Refresh the users list
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
        <h2 className="text-2xl font-semibold">Users</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md flex-1"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-md flex-1"
          >
            <option value="">All roles</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 border rounded-md flex-1 bg-blue-500 text-white"
          >
            Add User
          </button>
        </div>
      </div>
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              {["Name", "Email", "Avatar ID", "Created On", "Role"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      setSortConfig({
                        key: col.toLowerCase().replace(/\s+/g, "") as keyof User,
                        direction:
                          sortConfig?.key ===
                            col.toLowerCase().replace(/\s+/g, "") &&
                            sortConfig.direction === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  >
                    {col}
                    {sortConfig?.key === col.toLowerCase().replace(/\s+/g, "") &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {currentPage * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.avatarId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {moment(user.createdAt).format("MMM D, YYYY")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getRoleName(user)}
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
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
};

export default Users;