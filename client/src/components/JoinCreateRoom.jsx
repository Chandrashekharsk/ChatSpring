import React, { useState } from 'react'
import chatIcon from '../assets/chat.png'
import toast from 'react-hot-toast';
import { createRoomApi, joinRoomApi } from '../services/RoomService';
import useChatContext from '../context/chatContext';
import { useNavigate } from 'react-router';

const JoinCreateChat = () => {
  const navigate = useNavigate();
  const { roomId, currUser, connected, setConnected, setRoomId, setCurrUser } = useChatContext()
  const [detail, setDetail] = useState({
    username: '',
    roomId: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setDetail(prev => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!detail.username || !detail.roomId) {
      toast.error("Please fill in all fields!");
      return false;
    }
    return true;
  }

  async function joinRoom() {
    if (!validateForm()) return;
    try {
      await joinRoomApi(detail.roomId);
      toast.success("Room Joined");
      setRoomId(detail.roomId);
      console.log("roomid is : ", roomId);
      setCurrUser(detail.username);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.status == 400) toast.error(error.response.data);
      else toast.error("Room not found!");
      console.log(error);
    }
  }

  async function createRoom() {
    if (!validateForm()) return;
    try {
      const data = await createRoomApi(detail.roomId);
      toast.success("Room Created");
      setRoomId(data.roomId);
      setCurrUser(detail.username);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.status == 400) {
        toast.error(error.response.data);
      } else {
        toast.error("Room already exists!");
      }
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-950'>
      <div className='flex flex-col border dark:border-gray-700 gap-5 p-10 w-full max-w-md rounded dark:bg-gray-800 bg-white shadow-lg'>
        <div>
          <img className='w-24 mx-auto' src={chatIcon} alt="chat icon" />
        </div>
        <h1 className='text-2xl font-semibold text-center mb-2'>Join Room / Create Room</h1>
        <div className='flex flex-col items-start gap-1'>
          <label htmlFor="username" className='block font-medium mb-2'>Your Name</label>
          <input
            className='w-full placeholder:text-gray-400 dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:text-gray-100'
            placeholder='Enter your name'
            type="text" name="username" id="username"
            onChange={handleChange}
            value={detail.username}
          />
        </div>
        <div className='flex flex-col items-start gap-1'>
          <label htmlFor="roomId" className='block font-medium mb-2'>Room Id / New Room Id</label>
          <input
            className='w-full placeholder:text-gray-400 dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:text-gray-100'
            type="text" name="roomId" id="roomId"
            placeholder='Enter room id'
            onChange={handleChange}
            value={detail.roomId}
          />
        </div>
        <div className='flex items-center justify-center gap-3 mt-2'>
          <button onClick={createRoom} className='px-4 py-2 font-medium rounded-full dark:bg-orange-500 bg-orange-400 hover:bg-orange-600 dark:hover:bg-orange-700 text-white'>Create Room</button>
          <button onClick={joinRoom} className='px-4 py-2 font-medium rounded-full dark:bg-blue-500 bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'>Join Room</button>
        </div>
      </div>
    </div>
  )
}

export default JoinCreateChat