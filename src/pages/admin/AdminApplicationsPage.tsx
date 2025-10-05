import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApplicationsApi } from '../../lib/api';
import { Check, X, Eye } from 'lucide-react';
import { useState } from 'react';

export function AdminApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: staffApplicationsApi.getAll,
  }) as { data: any, isLoading: boolean };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => staffApplicationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      setSelectedApplication(null);
      
      if (variables.data.status === 'APPROVED') {
        alert('Application approved! User has been promoted to staff.');
      } else if (variables.data.status === 'REJECTED') {
        alert('Application rejected.');
      }
    },
  });

  const handleStatusUpdate = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const statusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Applications</h1>

      <div className="grid gap-4">
        {(applications?.data || applications)?.map((app: any) => (
          <div key={app.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{app.fullName}</h3>
                <p className="text-gray-600">{app.email}</p>
                <p className="text-gray-600">{app.phone}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${statusBadge(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                {app.skills?.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-500">Skills: </span>
                    {app.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mr-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedApplication(app)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
                {app.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Reject"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <p><strong>Name:</strong> {selectedApplication.fullName}</p>
                  <p><strong>Email:</strong> {selectedApplication.email}</p>
                  <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${statusBadge(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.experience}</p>
                </div>

                {selectedApplication.skills?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedApplication.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplication.status === 'PENDING' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'APPROVED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Application
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}