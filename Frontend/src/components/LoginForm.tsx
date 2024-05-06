import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    password: "",
    email: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.SOCKET_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (res.status === 401) {
        toast.error("Invalid email or password");
        return;
      }
      if (res.status === 500) {
        toast.error("Something went wrong in backend");
        return;
      }
      if (res.status === 404) {
        toast.error("User not found");
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        navigate("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="login-form">
      <h1 className="form-title">Login</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={handleInputChange} value={user.email} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleInputChange}
            value={user.password}
          />
        </div>
        <span style={{ fontSize: "12px" }}>
          Don't have account? <Link to={"/signup"}>Sign up</Link>
        </span>
        <div className="form-group">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}
