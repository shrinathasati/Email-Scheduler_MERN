import React, { useState } from "react";
import axios from "axios";
import './LoginSignup.css';


const LoginSignup = ({ setLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // For signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const data = isLogin ? { email, password } : { name, email, password }; // Include name only for signup

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${endpoint}`,
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert(isLogin ? "Login successful!" : "Signup successful!");
        setLoggedIn(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error during login/signup");
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>
  );
};

export default LoginSignup;
