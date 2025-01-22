import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SignUpForm from "./components/SignupForm";

const url = "http://localhost:3001";

const socket = io(url);

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState();

  useEffect(() => {
    console.log("Hey");

    socket.on("connect", () => {
      console.log(`server connected`);
      setIsConnected(true);
    });

    socket.on("leaveRoom", (message) => {
      socket.emit("leaveRoom", "yalaa");
      console.log(message);
    });
  });

  return (
    <>
      <h1>Hello wolrd</h1>
      {isConnected ? <SignUpForm /> : null}
    </>
  );
};

export default App;
