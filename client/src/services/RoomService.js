import { Axios, baseURL } from "../config/AxiosConfig";

export const createRoomApi = async (roomId) => {
  const res = await Axios.post(`${baseURL}/api/v1/rooms`, roomId, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const joinRoomApi = async (roomId) => {
  const res = await Axios.get(`${baseURL}/api/v1/rooms/${roomId}`);
  return res.data;
};

export const getMessages = async (roomId, size = 50, page = 0) => {
  const res = await Axios.get(
    `${baseURL}/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return res.data;
};
