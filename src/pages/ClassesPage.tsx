import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { classesApi } from '../lib/api';
import { Clock, Users} from 'lucide-react';
import { useState } from 'react';

export function ClassesPage() {
  const [filters, setFilters] = useState({
    difficulty: '',
    minPrice: '',
    maxPrice: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['classes', filters],
    queryFn: () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      return classesApi.getAll(cleanFilters);
    },
  }) as { data: any, isLoading: boolean };

  const difficultyBadge = (level: string) => {
    const colors = {
      BEGINNER: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
      ADVANCED: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cooking Classes</h1>
        <p className="mt-2 text-gray-600">Discover our authentic Thai cooking experiences</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={() => setFilters({ difficulty: '', minPrice: '', maxPrice: '' })}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Clear Filters
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading classes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.data || data)?.map((classItem: any) => (
            <Link
              key={classItem.id}
              to={`/classes/${classItem.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                {classItem.image ? (
                  <img src={classItem.image} alt={classItem.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-6xl">🍜</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyBadge(classItem.difficulty)}`}>
                    {classItem.difficulty}
                  </span>
                  <span className="text-lg font-bold text-orange-600">${classItem.price}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{classItem.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{classItem.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{classItem.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max {classItem.maxStudents}</span>
                  </div>
                </div>
                {classItem.schedules?.length > 0 && (
                  <div className="mt-4 text-sm text-green-600">
                    {classItem.schedules.length} upcoming sessions
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
