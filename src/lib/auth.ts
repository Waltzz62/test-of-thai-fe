export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'STAFF' | 'ADMIN' | 'DEV';
}

export const auth = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user: User) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),
  
  logout: () => {
    auth.removeToken();
    auth.removeUser();
    window.location.href = '/login';
  },
  
  isAuthenticated: () => !!auth.getToken(),
  
  hasRole: (roles: string[]) => {
    const user = auth.getUser();
    return user ? roles.includes(user.role) : false;
  },
};