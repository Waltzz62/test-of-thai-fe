import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi, schedulesApi } from '../../lib/api';
import { Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

export function AdminStaffPage() {
  const queryClient = useQueryClient();
  const [assigningStaff, setAssigningStaff] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState('');

  const { data: staff, isLoading } = useQuery({
    queryKey: ['admin-staff'],
    queryFn: staffApi.getAll,
  }) as { data: any, isLoading: boolean };

  const { data: schedules } = useQuery({
    queryKey: ['unassigned-schedules'],
    queryFn: () => schedulesApi.getAll(),
  }) as { data: any };

  const assignMutation = useMutation({
    mutationFn: ({ scheduleId, staffId }: any) => schedulesApi.update(scheduleId, { staffId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-schedules'] });
      setAssigningStaff(null);
      setSelectedSchedule('');
      alert('Staff assigned successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: staffApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
  });

  const handleAssignStaff = (staff: any) => {
    setAssigningStaff(staff);
  };

  const handleAssignSubmit = () => {
    if (!selectedSchedule) {
      alert('Please select a schedule');
      return;
    }
    assignMutation.mutate({ scheduleId: selectedSchedule, staffId: assigningStaff.id });
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Staff</h1>
        <p className="text-gray-600 mt-2">Assign staff members to class schedules</p>
      </div>



      <div className="grid gap-4">
        {(staff?.data || staff)?.map((s: any) => (
          <div key={s.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{s.name}</h3>
                <p className="text-gray-600">{s.email}</p>
                {s.phone && <p className="text-gray-600">{s.phone}</p>}
                {s.specialties?.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Specialties: </span>
                    {s.specialties.map((spec: string, idx: number) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded mr-1">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAssignStaff(s)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Assign to Schedule"
                >
                  <Calendar className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this staff member?')) {
                      deleteMutation.mutate(s.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {assigningStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Assign {assigningStaff.name} to Schedule
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Schedule
                </label>
                <select
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Choose a schedule</option>
                  {(schedules?.data || schedules)?.map((schedule: any) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.class.title} - {new Date(schedule.startTime).toLocaleString()}
                      {schedule.staff ? ` (Currently: ${schedule.staff.name})` : ' (Unassigned)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAssignSubmit}
                  disabled={assignMutation.isPending}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                </button>
                <button
                  onClick={() => {
                    setAssigningStaff(null);
                    setSelectedSchedule('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}