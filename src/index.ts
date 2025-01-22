import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import userService from "./services/userService";
import messageService from "./services/messageService";
import { translate } from "./utils/translate";

const app = express();
const expressServer = createServer(app);

app.use(cors());
app.use(express.static("dist"));

const io = new Server(expressServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Connected with id: ${socket.id}`);

  let userId: string;

  socket.on("createUser", async ({ username, userLang, roomId, secretKey }) => {
    userId = await userService.createUser({
      userLang,
      username,
      roomId,
      secretKey,
    });

    socket.join(roomId);

    socket.to(roomId).emit("createUser", {
      userId,
    });
  });

  socket.on("addUserToRoom", async ({ roomId, username }) => {
    try {
      const userLang = await userService.getUserLang(userId);

      await userService.addUserToRoom({ userId, username, userLang, roomId });

      const messages = await messageService.getAllMessages(roomId);

      io.to(roomId).emit("chatHistory", messages.length > 0 ? messages : []);

      socket.join(roomId);
      socket.to(roomId).emit("addUserToRoom", {
        message: `${username} joined room`,
      });
    } catch (error) {
      if (error instanceof Error) {
        socket.emit("error", error.message);
      } else {
        socket.emit("error", {
          message: "Unexpected error, try again later",
        });
      }
    }
  });

  socket.on("sendMessage", async ({ message, roomId }) => {
    const userLang = await userService.getUserLang(userId);

    const translatedMessage = await translate(message, userLang);

    if (translatedMessage) {
      const messageData = messageService.addMessage({
        userId,
        translatedMessage,
        messageLang: userLang,
        roomId,
      });
      socket.to(roomId).emit("sendMessage", messageData);
    } else {
      socket.emit("error", {
        message: "unable to send message",
      });
    }
  });

  socket.on("leaveRoom", async (roomId) => {
    const username = await userService.getUserName(userId);

    socket.leave(roomId);
    socket.to(roomId).emit("leaveRoom", {
      messagee: `${username || userId} left room`,
    });
  });

  socket.on("disconnet", async (roomId) => {
    const username = await userService.getUserName(userId);
    socket.to(roomId).emit("disconnect", {
      message: `${username} disconnected from chat`,
    });
  });
});

expressServer.listen(3001, () => {
  console.log(`server running on port 3001`);
});
