import CopyToClipboard from "react-copy-to-clipboard";

export default function RoomDetails({ room }: { room: string }) {
  const path = window.location.href;
  return (
    <div className="container">
      <h1>Room Details</h1>
      <p style={{ border: "1px solid black", padding: "5px 10px" }}>{path}</p>
      <h4>Room Name:</h4>
      <p>{room}</p>
      <CopyToClipboard text={room}>
        <button className="btn">Copy & Share</button>
      </CopyToClipboard>
    </div>
  );
}
