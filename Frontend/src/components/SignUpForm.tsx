import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validateEmail from "../utils/ValidateEmail";
import InputField from "./InputField";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errorMsg, setErrMsg] = useState({
    username: "",
    password: "",
    email: "",
  });

  const validateForm = () => {
    let isValid = true;
    const err = { ...errorMsg };
    if (user.username === "") {
      err.username = "Username is required";
      isValid = false;
    } else {
      err.username = "";
    }
    if (user.email === "") {
      err.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(user.email)) {
      err.email = "Email is not valid";
      isValid = false;
    } else {
      err.email = "";
    }

    if (user.password === "") {
      err.password = "Password is required";
      isValid = false;
    } else if (user.password.length < 8) {
      err.password = "Password is must be at least 8 characters";
      isValid = false;
    } else {
      err.password = "";
    }
    setErrMsg(err);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await fetch(`${process.env.SOCKET_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (res.status === 401) {
        toast.error("User already exists");
        return;
      }
      if (res.status === 500) {
        toast.error("Something went wrong");
        return;
      }

      const data = await res.json();
      if (data.status === "success") navigate("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  return (
    <div className="login-form">
      <h1 className="form-title">SignUp</h1>
      <form action="" onSubmit={handleSubmit}>
        <InputField
          type="text"
          title="Username"
          name="username"
          value={user.username}
          handleInputChange={handleInputChange}
          errMessage={errorMsg.username}
        />
        <InputField
          type="email"
          title="Email"
          name="email"
          value={user.email}
          handleInputChange={handleInputChange}
          errMessage={errorMsg.email}
        />
        <InputField
          type="password"
          title="Password"
          name="password"
          value={user.password}
          handleInputChange={handleInputChange}
          errMessage={errorMsg.password}
        />
        <div className="form-group">
          <input type="submit" value="Signup" />
        </div>
      </form>
    </div>
  );
}
