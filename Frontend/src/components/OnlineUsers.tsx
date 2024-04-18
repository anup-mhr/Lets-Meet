import { useEffect, useState } from "react";
import UserItems from "./UserItems";

interface onlineUserseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  username: string;
  room: string;
}
export default function OnlineUsers({ socket, username, room }: onlineUserseProps) {
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("chatroom_users", (data: any) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  });

  return (
    <div className="container">
      <h1>Online Users</h1>
      <ul>
        {roomUsers.map((user, id) => (
          <UserItems key={id} user={user} username={username} socket={socket} room={room} />
        ))}
      </ul>
    </div>
  );
}
