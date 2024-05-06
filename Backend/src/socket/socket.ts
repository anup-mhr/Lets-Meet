import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

import app from "../app";
import { roomService } from "../services/roomService";
import { messageService } from "../services/messageService";

dotenv.config();
const { SOCKET_URL } = process.env;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [SOCKET_URL || "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

let chatRoom = "";
let count = 0;

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  // Add user to room
  socket.on("join_room", async (data) => {
    const { username, room } = data;
    socket.join(room);
    // io.emit("user_joined", username); //use io.to()

    const _createdtime_ = Date.now();
    //send msg to all users in the room
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the room`,
      username: "chatbot",
      _createdtime_,
    });
    socket.to(room).emit("user_joined", username);

    //save new user to room
    chatRoom = room;
    await roomService.joinChatRoom(socket.id, room, username);
    const chatRoomUsers = await roomService.getUsersByRoom(room);
    console.log(chatRoomUsers);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

    //THIS SHOULD BE IN JOIN ROOM I.E. WHENEVER A USER JOIN A ROOM
    //GET LAST 100 MSG SENT IN CHAT ROOM
    const last100Messages = await messageService.getMessageByRoom(room);
    socket.emit("last_100_messages", last100Messages);
  });

  //send msg to all users in the room
  socket.on("send_message", async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, username, room, _createdtime_ } = data;
    console.log(data);
    io.in(room).emit("receive_message", data);
    //  SAVE MSG IN DB
    await messageService.createMessage(message, room, username, _createdtime_);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket.on("kickout_user", async (data: any) => {
    const { user, room } = data;
    const targetSocketId = await roomService.getSocketIdByUsername(user);
    if (!targetSocketId || targetSocketId === undefined) return;
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    console.log("target socket_id", targetSocket);
    if (targetSocket) {
      const _createdtime_ = Date.now();
      await roomService.leaveRoom(targetSocketId);
      const allUsers = await roomService.getUsersByRoom(room);
      io.to(room).emit("chatroom_users", allUsers);
      io.to(room).emit("receive_message", {
        username: "chatbot",
        message: `${user} has been kicked out`,
        _createdtime_,
      });
      io.to(room).emit("is_kickout", user);
      targetSocket.leave(room);
      console.log(`${user} has been kicked out`);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket.on("leave_room", async (data: any) => {
    const { username, room } = data;
    socket.leave(room);
    const _createdtime_ = Date.now();
    //remove user from memory
    await roomService.leaveRoom(socket.id);
    const allUsers = await roomService.getUsersByRoom(room);
    if (allUsers.length === 0) {
      await messageService.deleteMessageFromRoom(room);
    }
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: "chatbot",
      message: `${username} has left the chat room`,
      _createdtime_,
    });
    socket.to(room).emit("user_left", username);
    console.log(`${username} has left the chat room`);
  });

  //FOR VIDEO CALLING BEGINS
  socket.on("join_video_chat", async (roomID) => {
    const users = await roomService.getUsersDataByRoom(roomID);
    const usersInThisRoom = users.map((user) => user.socket_id).filter((id) => id !== socket.id);
    count += 1;
    socket.emit("all users", { usersInThisRoom, count });
  });
  socket.on("sending signal", (payload) => {
    console.log("receiving singnal from backend");
    const { userToSignal, signal, callerID } = payload;
    io.to(userToSignal).emit("user joined", {
      signal: signal,
      callerID: callerID,
    });
    console.log("user joined from backend");
  });

  socket.on("returning signal", (payload) => {
    const { signal, callerID } = payload;
    io.to(callerID).emit("receiving returned signal", {
      signal: signal,
      id: socket.id,
    });
  });

  socket.on("change", (payload) => {
    socket.broadcast.emit("change", payload);
  });

  socket.on("leave_video_chat", (userId: string) => {
    io.to(chatRoom).emit("user_left_video", userId);
  });
  //FOR VIDEO CALLING ENDS

  socket.on("disconnect", async () => {
    console.log("user disconnected from the server", socket.id);
    const user = await roomService.getUserBySocketId(socket.id);
    if (user?.username) {
      await roomService.leaveRoom(socket.id);
      const allUsers = await roomService.getUsersByRoom(chatRoom);
      if (allUsers.length === 0) {
        await messageService.deleteMessageFromRoom(chatRoom);
      }
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("user_left", user.username);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.username} has disconnected the chat room`,
      });
    }
  });
});

export { app, io, server };
