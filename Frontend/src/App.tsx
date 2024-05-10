import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import Room from "./pages/Room";
import { useState } from "react";
import PrivateRoute from "./routes/PrivateRoute";

const socket = io(process.env.SOCKET_URL || "http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleRoom = (room: string) => {
    setRoom(room);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" key="home" element={<Login />} />
          <Route path="/login" key="login" element={<Login />} />
          <Route path="/signup" key="signup" element={<Signup />} />
          <Route
            path="/dashboard"
            key="dashboard"
            element={
              <PrivateRoute
                component={Dashboard}
                socket={socket}
                username={username}
                room={room}
                handleRoom={handleRoom}
                setUsername={setUsername}
              />
            }
          />
          <Route
            path="/room/:roomId"
            key="room"
            element={
              <PrivateRoute
                component={Room}
                socket={socket}
                room={room}
                username={username}
                handleRoom={handleRoom}
              />
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="bottom-left" />
    </>
  );
}

export default App;
