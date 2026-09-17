import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const storedUser = localStorage.getItem("reviva_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn("Failed to parse stored user", e);
      }
    } else {
      // Default to demo merchant active for effortless reviewer experience
      const demoUser = {
        name: "Acme Merchant",
        email: "merchant@acmefintech.com",
        company: "Acme Fintech Corp",
        razorpayConnected: true,
        accountType: "Live Test Mode",
      };
      setUser(demoUser);
      localStorage.setItem("reviva_user", JSON.stringify(demoUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const userData = {
      name: email.split("@")[0].toUpperCase(),
      email,
      company: "Reviva Merchant Inc",
      razorpayConnected: true,
      accountType: "Live Test Mode",
    };
    setUser(userData);
    localStorage.setItem("reviva_user", JSON.stringify(userData));
    return true;
  };

  const register = (companyName, email, password, razorpayKey = "") => {
    const userData = {
      name: companyName || email.split("@")[0].toUpperCase(),
      email,
      company: companyName || "Reviva Merchant Inc",
      razorpayConnected: true,
      accountType: "Registered Merchant",
      razorpayKeyId: razorpayKey || "rzp_test_registered",
    };
    setUser(userData);
    localStorage.setItem("reviva_user", JSON.stringify(userData));
    return true;
  };

  const loginAsDemo = () => {
    const demoUser = {
      name: "Demo Merchant",
      email: "demo@reviva.io",
      company: "Acme Payments Solutions",
      razorpayConnected: true,
      accountType: "Live Test Mode",
    };
    setUser(demoUser);
    localStorage.setItem("reviva_user", JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reviva_user");
  };

  const toggleRazorpayOAuth = () => {
    if (!user) return;
    const updated = {
      ...user,
      razorpayConnected: !user.razorpayConnected,
    };
    setUser(updated);
    localStorage.setItem("reviva_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginAsDemo,
        logout,
        toggleRazorpayOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
