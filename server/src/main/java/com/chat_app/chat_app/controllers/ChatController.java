package com.chat_app.chat_app.controllers;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import com.chat_app.chat_app.entities.Message;
import com.chat_app.chat_app.entities.Room;
import com.chat_app.chat_app.repositories.RoomRepository;
import com.chat_app.payload.MessageRequest;

@Controller
public class ChatController {

  private final RoomRepository roomRepository;

  public ChatController(RoomRepository roomRepository) {
    this.roomRepository = roomRepository;
  }

  @MessageMapping("/sendMessage/{roomId}") 
  @SendTo("/topic/room/{roomId}") 
  public Message sendMessage( 
    @DestinationVariable String roomId,
    @RequestBody MessageRequest request){

      Room room = roomRepository.findByRoomId(request.getRoomId());
      if(room == null) {
        throw new IllegalArgumentException("Room not found");
      }
      Message message = new Message();
      message.setContent(request.getContent());
      message.setSender(request.getSender());
      message.setTimestamp(LocalDateTime.now());
      room.getMessages().add(message);
      roomRepository.save(room);
      return message;
  }
}
