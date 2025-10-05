import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../lib/api';
import { Calendar, Users, Clock } from 'lucide-react';

export function MyBookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: bookingsApi.getMyBookings,
  }) as { data: any, isLoading: boolean };

  const statusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading bookings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {(bookings?.data || bookings)?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(bookings?.data || bookings)?.map((booking: any) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {booking.schedule.class.title}
                  </h3>
                  <p className="text-sm text-gray-500">Booking #{booking.bookingNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${statusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span>{new Date(booking.schedule.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>{new Date(booking.schedule.startTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span>{booking.numberOfPeople} {booking.numberOfPeople > 1 ? 'people' : 'person'}</span>
                </div>
                <div className="text-lg font-semibold text-orange-600">
                  ${booking.totalPrice}
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600"><strong>Notes:</strong> {booking.notes}</p>
                </div>
              )}

              {booking.schedule.staff && (
                <div className="mt-4 text-sm text-gray-600">
                  <strong>Instructor:</strong> {booking.schedule.staff.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}