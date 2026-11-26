
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const demoUsers = [
  {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    name: "Admin"
  },
  {
    email: "student@gmail.com",
    password: "student123",
    role: "student",
    name: "Student"
  },
  {
    email: "faculty@gmail.com",
    password: "faculty123",
    role: "faculty",
    name: "Faculty"
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

const login = (email, password, selectedRole) => {
  const found = demoUsers.find(
    (u) =>
      u.email === email &&
      u.password === password &&
      u.role === selectedRole
  );

  if (!found) return null;

  const loggedUser = {
    name: found.name,
    email: found.email,
    role: found.role
  };

  localStorage.setItem("user", JSON.stringify(loggedUser));
  setUser(loggedUser);

  return found.role;
};

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
