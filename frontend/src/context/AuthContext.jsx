import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

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
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const register = (name, email, password, role) => {
    const normalizedEmail = email.trim().toLowerCase();

    let registeredUsers = [];

    try {
      registeredUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );
      if (!Array.isArray(registeredUsers)) registeredUsers = [];
    } catch {
      registeredUsers = [];
    }

    const allUsers = [...demoUsers, ...registeredUsers];

    const exists = allUsers.some(
      u => u.email?.trim().toLowerCase() === normalizedEmail
    );

    if (exists) {
      return {
        success: false,
        message: "Account already exists."
      };
    }

    registeredUsers.push({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    });

    localStorage.setItem("users", JSON.stringify(registeredUsers));

    return { success: true };
  };

 const login = (identifier, password, selectedRole) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  let registeredUsers = [];

  try {
    registeredUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    if (!Array.isArray(registeredUsers)) {
      registeredUsers = [];
    }
  } catch {
    registeredUsers = [];
  }

  const allUsers = [...demoUsers, ...registeredUsers];

  const found = allUsers.find(u =>
    (
      u.email?.trim().toLowerCase() === normalizedIdentifier ||
      u.name?.trim().toLowerCase() === normalizedIdentifier
    ) &&
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);