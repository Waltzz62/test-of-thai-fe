import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { classesApi, bookingsApi } from '../lib/api';
import { auth } from '../lib/auth';
import { Clock, Users, Award } from 'lucide-react';
import { useState } from 'react';

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = auth.isAuthenticated();
  
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [notes, setNotes] = useState('');

  const { data: classData, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: () => classesApi.getById(id!),
    enabled: !!id,
  }) as { data: any, isLoading: boolean };

  const bookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (data: any) => {
      // Reset form
      setSelectedSchedule('');
      setNumberOfPeople(1);
      setNotes('');
      
      alert(`Booking confirmed! Your booking number is ${data.bookingNumber || 'N/A'}`);
      navigate('/my-bookings');
    },
    onError: (error: any) => {
      alert(`Booking failed: ${error.message || 'Please try again'}`);
    },
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSchedule) {
      alert('Please select a time slot');
      return;
    }

    if (numberOfPeople < 1) {
      alert('Number of people must be at least 1');
      return;
    }

    const selectedScheduleData = classData.schedules?.find((s: any) => s.id === selectedSchedule);
    if (selectedScheduleData) {
      const availableSeats = selectedScheduleData.maxStudents - (selectedScheduleData.bookedCount || 0);
      if (numberOfPeople > availableSeats) {
        alert(`Only ${availableSeats} seats available for this time slot`);
        return;
      }
    }

    const confirmMessage = `Confirm booking for ${numberOfPeople} ${numberOfPeople > 1 ? 'people' : 'person'}?\n\nClass: ${classData.title}\nDate: ${new Date(selectedScheduleData?.startTime).toLocaleDateString()}\nTime: ${new Date(selectedScheduleData?.startTime).toLocaleTimeString()}\nTotal: $${classData.price * numberOfPeople}`;
    
    if (confirm(confirmMessage)) {
      bookingMutation.mutate({
        scheduleId: selectedSchedule,
        numberOfPeople,
        notes: notes.trim() || undefined,
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="h-96 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
            {classData.image ? (
              <img src={classData.image} alt={classData.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-white text-9xl">🍜</span>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.title}</h1>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${difficultyBadge(classData.difficulty)}`}>
                {classData.difficulty}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed">{classData.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>{classData.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-5 w-5 text-orange-600" />
                <span>Max {classData.maxStudents} students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Award className="h-5 w-5 text-orange-600" />
                <span>{classData.difficulty} Level</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                ${classData.price}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Class</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Schedule
              </label>
              {classData.schedules?.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-md text-center text-gray-600">
                  No available schedules at the moment
                </div>
              ) : (
                <div className="space-y-3">
                  {classData.schedules?.map((schedule: any) => {
                    const availableSeats = schedule.maxStudents - (schedule.bookedCount || 0);
                    const isSelected = selectedSchedule === schedule.id;
                    const isDisabled = availableSeats <= 0;
                    
                    return (
                      <div
                        key={schedule.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-orange-500 bg-orange-50' 
                            : isDisabled 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                        onClick={() => !isDisabled && setSelectedSchedule(schedule.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {new Date(schedule.startTime).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {new Date(schedule.startTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {new Date(schedule.endTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {schedule.staff && (
                              <div className="text-sm text-gray-600 mt-1">
                                👨‍🍳 Instructor: {schedule.staff.name}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              availableSeats > 5 ? 'text-green-600' : 
                              availableSeats > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {availableSeats > 0 ? `${availableSeats} seats left` : 'Fully booked'}
                            </div>
                            {isSelected && (
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Selected
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People
              </label>
              <input
                type="number"
                min="1"
                max={selectedSchedule ? 
                  classData.schedules?.find((s: any) => s.id === selectedSchedule)?.maxStudents - 
                  (classData.schedules?.find((s: any) => s.id === selectedSchedule)?.bookedCount || 0) 
                  : classData.maxStudents
                }
                value={numberOfPeople}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setNumberOfPeople(Math.max(1, value));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {selectedSchedule && (
                <p className="text-sm text-gray-500 mt-1">
                  Maximum {classData.schedules?.find((s: any) => s.id === selectedSchedule)?.maxStudents - 
                  (classData.schedules?.find((s: any) => s.id === selectedSchedule)?.bookedCount || 0)} people for selected time slot
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Any special requests or dietary restrictions?"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total Price:</span>
                <span className="text-orange-600">${classData.price * numberOfPeople}</span>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingMutation.isPending}
                className="w-full py-3 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
