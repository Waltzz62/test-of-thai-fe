import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../../lib/api';
import { Calendar, Users, Clock } from 'lucide-react';

export function StaffSchedulesPage() {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['staff-schedules'],
    queryFn: schedulesApi.getByStaff,
  }) as { data: any, isLoading: boolean };

  const statusBadge = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Teaching Schedule</h1>

      {(schedules?.data || schedules)?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No schedules assigned yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(schedules?.data || schedules)?.map((schedule: any) => (
            <div key={schedule.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {schedule.class.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{schedule.class.description}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${statusBadge(schedule.status)}`}>
                  {schedule.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span>{new Date(schedule.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>
                    {new Date(schedule.startTime).toLocaleTimeString()} - {new Date(schedule.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span>{schedule.bookedCount}/{schedule.maxStudents} students</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Class Details:</strong>
                  <p>Duration: {schedule.class.duration} minutes</p>
                  <p>Difficulty: {schedule.class.difficulty}</p>
                  <p>Max Students: {schedule.class.maxStudents}</p>
                </div>
                <div>
                  <strong>Booking Status:</strong>
                  <p>Available Seats: {schedule.maxStudents - schedule.bookedCount}</p>
                  <p>Price per Person: ${schedule.class.price}</p>
                </div>
              </div>

              {schedule.bookings?.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">Enrolled Students:</h4>
                  <div className="space-y-2">
                    {schedule.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex justify-between items-center text-sm">
                        <span>{booking.user?.name || 'N/A'} ({booking.numberOfPeople} people)</span>
                        <span className={`px-2 py-1 rounded text-xs ${statusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}