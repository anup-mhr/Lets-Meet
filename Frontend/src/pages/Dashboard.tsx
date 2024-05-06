import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./theme/Header";

export default function Dashboard({
  socket,
  username,
  room,
  handleRoom,
  setUsername,
}: {
  username: string;
  room: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  handleRoom: (room: string) => void;
  setUsername: (username: string) => void;
}) {
  const navigate = useNavigate();

  const createMeeting = async () => {
    const room_id = crypto.randomUUID() as string;
    if (username !== "") {
      socket.emit("join_room", { username, room: room_id });
    }
    handleRoom(room_id);
    localStorage.setItem("room", room_id);
    navigate(`/room/${room_id}`, { replace: true });
  };

  const joinMeeting = async () => {
    const res = await fetch(`${process.env.SOCKET_URL}/api/room/checkRoomStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ room_id: room }),
    });
    if (res.status === 403) {
      toast.error("Room not available");
      return;
    }
    if (res.status === 404) {
      toast.error("Room not available");
      return;
    }
    if (res.status === 500) {
      toast.error("Server error");
      return;
    }
    const data = await res.json();
    if (!data.data) {
      toast.error("Room not available");
      return;
    }

    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
    }
    localStorage.setItem("room", room);
    navigate(`/room/${room}`, { replace: true });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleRoom(event.target.value);
  };

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    if (localStorage.getItem("username") === null || localStorage.getItem("username") === "") {
      navigate("/login", { replace: true });
    }
  }, [setUsername, navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken === null || accessToken.length < 1) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Header />

      <div className="dashboard">
        <div className="sideImg">
          <img src="/assets/meeting.jfif" alt="" />
        </div>
        <div className="main-body">
          <h1 style={{ color: "#1649bd", fontSize: "40px" }}>Meeting for Everyone</h1>
          <h3 style={{ marginBlock: "10px", opacity: "0.5" }}>Making your meeting more easier</h3>
          <div className="align-flex">
            <input type="button" className="btn" value="Create meeting" onClick={createMeeting} />
            <input
              type="text"
              value={room}
              placeholder="Enter meeting id"
              onChange={handleChange}
            />
            <button className="btn" onClick={joinMeeting} disabled={room === ""}>
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
