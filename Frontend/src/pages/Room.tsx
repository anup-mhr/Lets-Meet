import { useEffect, useState } from "react";
import RoomDetails from "../components/RoomDetails";
import { useNavigate, useParams } from "react-router-dom";
import Messages from "../components/Messages";
import OnlineUsers from "../components/OnlineUsers";
import { toast } from "react-toastify";
import VideoCall from "../components/VideoCall";
import { Socket } from "socket.io-client";

interface roomProps {
  socket: Socket;
  username: string;
  room: string;
  handleRoom: (room: string) => void;
}

export default function Room({ socket, username, room, handleRoom }: roomProps) {
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const leaveRoom = () => {
    const _createdtime_ = Date.now();
    socket.emit("leave_room", { username, room, _createdtime_ });
    socket.emit("leave_video_chat", socket.id);
    navigate("/dashboard", { replace: true });
    localStorage.setItem("room", "");
    handleRoom("");
  };

  useEffect(() => {
    if (!roomId) {
      toast.error("Room not available");
      navigate("/dashboard", { replace: true });
      return;
    }
    const checkRoomStatus = async (room: string) => {
      setTimeout(() => {}, 5000);
      try {
        const res = await fetch(`${process.env.SOCKET_URL}/api/room/checkRoomStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ room_id: room }),
        });
        const data = await res.json();
        console.log(data);
        if (!data.data) {
          toast.error("Room not available");
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (error) {
        toast.error("Room not available");
        navigate("/dashboard", { replace: true });
      }
    };
    checkRoomStatus(roomId);
  }, [roomId, navigate]);

  return (
    <div>
      <div>
        <div className="align-flex" style={{ height: "70vh", gap: "20px" }}>
          {/* {showVideoCall && <VideoCall socket={socket} room={room} showVideo={setShowVideoCall} />} */}
          <VideoCall socket={socket} room={room} showVideo={setShowVideoCall} />
          {showRoomDetails && <RoomDetails room={room} />}
          <OnlineUsers socket={socket} username={username} room={room} />
          <Messages socket={socket} username={username} room={room} />
        </div>
        <div className="align-flex">
          <input
            type="button"
            className="btn"
            value="Show Video"
            onClick={() => setShowVideoCall(!showVideoCall)}
          />
          <input
            type="button"
            className="btn"
            value="Room details"
            onClick={() => setShowRoomDetails(!showRoomDetails)}
          />
          <input type="button" className="btn btn-danger" value="End Call" onClick={leaveRoom} />
        </div>
      </div>
    </div>
  );
}
