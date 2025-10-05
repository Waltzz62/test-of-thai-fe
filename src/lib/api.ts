const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data as T;
}

// Auth API
export const authApi = {
  register: (data: any) =>
    fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: any) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  staffLogin: (data: any) =>
    fetchApi("/auth/staff/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Classes API
export const classesApi = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/classes${query ? `?${query}` : ""}`);
  },
  getById: (id: string) => fetchApi(`/classes/${id}`),
  create: (data: any) =>
    fetchApi("/classes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi(`/classes/${id}`, {
      method: "DELETE",
    }),
};

// Schedules API
export const schedulesApi = {
  getAll: () => fetchApi("/schedules"),
  getByStaff: () => fetchApi("/schedules/my-schedules"),
  create: (data: any) =>
    fetchApi("/schedules", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi(`/schedules/${id}`, {
      method: "DELETE",
    }),
};

// Bookings API
export const bookingsApi = {
  create: (data: any) =>
    fetchApi("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMyBookings: () => fetchApi("/bookings/my-bookings"),
  getAll: () => fetchApi("/bookings"),
  getById: (id: string) => fetchApi(`/bookings/${id}`),
  updateStatus: (id: string, status: string) =>
    fetchApi(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Staff API
export const staffApi = {
  getAll: () => fetchApi("/staff"),
  getById: (id: string) => fetchApi(`/staff/${id}`),
  create: (data: any) =>
    fetchApi("/staff", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi(`/staff/${id}`, {
      method: "DELETE",
    }),
};

// Staff Applications API
export const staffApplicationsApi = {
  create: (data: any) =>
    fetchApi("/staff-applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: () => fetchApi("/staff-applications"),
  getById: (id: string) => fetchApi(`/staff-applications/${id}`),
  update: (id: string, data: any) =>
    fetchApi(`/staff-applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
