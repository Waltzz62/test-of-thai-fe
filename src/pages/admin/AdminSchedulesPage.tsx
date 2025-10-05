import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulesApi, classesApi, staffApi } from '../../lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function AdminSchedulesPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    maxStudents: 10,
  });

  const { data: schedules } = useQuery({
    queryKey: ['admin-schedules'],
    queryFn: schedulesApi.getAll,
  }) as { data: any };

  const { data: classes } = useQuery({
    queryKey: ['classes-list'],
    queryFn: () => classesApi.getAll(),
  }) as { data: any };

  const { data: staff } = useQuery({
    queryKey: ['staff-list'],
    queryFn: staffApi.getAll,
  }) as { data: any };

  const createMutation = useMutation({
    mutationFn: schedulesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
      setIsCreating(false);
      setFormData({ classId: '', staffId: '', startTime: '', endTime: '', maxStudents: 10 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: schedulesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      staffId: formData.staffId || undefined,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Schedules</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          <Plus className="h-5 w-5" />
          Add Schedule
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Schedule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a class</option>
                  {(classes?.data || classes)?.map((cls: any) => (
                    <option key={cls.id} value={cls.id}>{cls.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff (Optional)</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">No staff assigned</option>
                  {(staff?.data || staff)?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                <input
                  type="number"
                  required
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {(schedules?.data || schedules)?.map((schedule: any) => (
          <div key={schedule.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{schedule.class.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>📅 {new Date(schedule.startTime).toLocaleString()}</p>
                  <p>👥 {schedule.bookedCount}/{schedule.maxStudents} booked</p>
                  {schedule.staff && <p>👨‍🍳 Instructor: {schedule.staff.name}</p>}
                  <p>Status: <span className="px-2 py-0.5 bg-gray-100 rounded">{schedule.status}</span></p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Delete this schedule?')) {
                    deleteMutation.mutate(schedule.id);
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}