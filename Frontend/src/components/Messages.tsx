import { useEffect, useState } from "react";
import UserMessage from "./UserMessage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface messagesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  username: string;
  room: string;
}

type messages = {
  username: string;
  message: string;
  _createdtime_: string;
};

const messageData: messages[] = [];

export default function Messages({ socket, username, room }: messagesProps) {
  const [messagesReceived, setMessagesReceived] = useState(messageData);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // FOR SEND MESSAGE COMPONENT
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message !== "") {
      const _createdtime_ = Date.now();
      socket.emit("send_message", {
        username,
        room,
        message,
        _createdtime_,
      });
      setMessage("");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortMessagesByDate = (messages: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return messages.sort((a: any, b: any) => parseInt(b._createdtime_) - parseInt(a._createdtime_));
  };

  //Runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on("receive_message", (data: messages) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          username: data.username,
          message: data.message,
          _createdtime_: data._createdtime_,
        },
      ]);
      const match = /@(\w+)/.exec(data.message);
      if (match) {
        const mention = match[1];
        if (mention.toLowerCase() === "everyone") toast.info("Someone has mentioned you");
        if (mention.toLowerCase() === username.toLowerCase())
          toast.info("Someone has mentioned you");
      }
    });

    return () => socket.off("receive_message");
  }, [socket, username]);

  //USER JOINED AND LEFT NOTIFICATION
  useEffect(() => {
    socket.on("user_joined", (username: string) => {
      toast.info(`${username} has joined the room`);
    });
    socket.on("user_left", (username: string) => {
      toast.info(`${username}  has left the room`);
    });
    socket.on("is_kickout", (user: string) => {
      if (user === username) {
        toast.info("You have been kicked out");
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("is_kickout");
    };
  });

  //FOR REVEIVING last 100 messages when join
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("last_100_messages", (last100Messages: any) => {
      console.log("last 100 messages", last100Messages);
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  return (
    <div className="container" style={{ position: "relative" }}>
      <div>
        {messagesReceived.map((msg, id) => (
          <UserMessage key={id} messageData={msg} username={username} />
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ position: "absolute", width: "90%", bottom: "0" }}>
        <input
          type="text"
          placeholder="send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="send" onClick={sendMessage} />
      </form>
    </div>
  );
}
