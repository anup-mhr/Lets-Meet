import formatDateFromTimestamp from "../utils/formatDateFromTimestamp";

interface userMessageProps {
  messageData: {
    username: string;
    message: string;
    _createdtime_: string;
  };
  username: string;
}

export default function UserMessage({ messageData, username }: userMessageProps) {
  return (
    <div className="user-messageData">
      <div className="profile">
        <img src="../public/assets/user.jpg" alt="user" />
      </div>
      <div className="messageData">
        <p>{messageData.username === username ? "You" : username}</p>
        <p>{messageData.message}</p>
        <p>{formatDateFromTimestamp(messageData._createdtime_)}</p>
      </div>
    </div>
  );
}
