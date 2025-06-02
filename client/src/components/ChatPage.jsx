import { useEffect, useRef, useState } from "react";
import { IoMdAttach, IoMdSend } from "react-icons/io";
import useChatContext from "../context/chatContext";
import { useNavigate } from "react-router";
import { baseURL } from "../config/AxiosConfig";
import SockJS from "sockjs-client";
import { Stomp } from '@stomp/stompjs';
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompclient, setStompClient] = useState(null);
  const { currUser, roomId, connected, setConnected } = useChatContext();
  const navigate = useNavigate();

  // Fetch messages when roomId changes
  useEffect(() => {
    if (!roomId) return;
    (async () => {
      try {
        const fetchedmessages = await getMessages(roomId);
        setMessages(fetchedmessages);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    })();
  }, [roomId]);

  // WebSocket connection and subscription
  useEffect(() => {
    if (!connected || !currUser || !roomId) {
      navigate("/");
      return;
    }
    const socket = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      setStompClient(client);
      toast.success("Connected to the chat room");
      setConnected(true);
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        if (message.body) {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    });
    return () => {
      if (client && client.connected) client.disconnect();
    };
  }, [connected, currUser, roomId, navigate, setConnected]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !stompclient) return;
    const msg = {
      sender: currUser,
      content: input,
      roomId: roomId,
    };
    stompclient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(msg));
    setInput("");
  };

  const leaveRoom = () => {
    if (stompclient && stompclient.connected) {
      stompclient.disconnect(() => {
        toast('Disconnected from room.');
      });
    }
    setConnected(false);
    setMessages([]);
    navigate("/");
  };

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col bg-gray-200 dark:bg-gray-950">
      <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-none shadow-none border-0">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="font-semibold text-lg text-gray-700 dark:text-gray-100">
            Room ID: {" "}
            <span className="font-mono text-green-700 dark:text-green-700">
              {roomId}
            </span>
          </div>
          <button
            onClick={leaveRoom}
            className="ml-4 px-4 py-1 rounded-full bg-red-500 hover:bg-red-700 text-white font-medium text-sm shadow"
          >
            Leave Room
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6" ref={chatBoxRef}>
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${msg.sender === currUser ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs break-words shadow-sm ${msg.sender === currUser
                  ? "bg-green-700 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                  }`}
              >
                <div className=" flex items-center justify-start gap-2 text-xs font-semibold mb-1">
                  <img src="https://avatar.iran.liara.run/public" width={20} height={20} alt="avatar" />
                  <div>{msg.sender}</div>
                </div>
                <div>{msg.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button className="mr-2 text-gray-500 hover:text-green-700">
            <IoMdAttach size={24} />
          </button>
          <input
            className="flex-1 border dark:bg-gray-700 dark:text-gray-100 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-700 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center justify-center"
          >
            <IoMdSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
