import { io } from "socket.io-client";

const cartSocket = io("https://webuy-backend-0459.onrender.com");

export default cartSocket;
