import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currUser, setCurrUser] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider value={{ roomId, currUser,connected, setConnected, setRoomId, setCurrUser }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = ()=> useContext(ChatContext);
export default useChatContext;
