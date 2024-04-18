interface UserItemsProps {
  user: string;
  username: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  room: string;
}

export default function UserItems({ user, username, socket, room }: UserItemsProps) {
  const removeFromChat = () => {
    if (user === username) return;
    socket.emit("kickout_user", { user, room });
  };

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "5px 10px",
        marginBlock: "10px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="profile">
        <img src="../src/assets/user.jpg" alt="" />
      </div>
      <div>
        <p>{user === username ? "You" : user}</p>
      </div>
      <div>
        <p
          style={{
            alignSelf: "flex-end",
            cursor: "pointer",
            display: `${user === username ? "none" : "block"}`,
          }}
          onClick={removeFromChat}
        >
          remove from chat
        </p>
      </div>
    </div>
  );
}
