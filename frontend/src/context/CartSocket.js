import { io } from "socket.io-client";

const cartSocket = io("http://localhost:4000");

export default cartSocket;
