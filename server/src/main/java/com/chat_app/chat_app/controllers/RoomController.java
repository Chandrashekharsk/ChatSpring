package com.chat_app.chat_app.controllers;

import com.chat_app.chat_app.entities.Message;
import com.chat_app.chat_app.entities.Room;
import com.chat_app.chat_app.repositories.RoomRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(origins = "${app.frontend.url}", allowedHeaders = "*", allowCredentials = "true")
public class RoomController {

  private final RoomRepository roomRepository;

  // Inject frontend URL for logging or optional use
  @Value("${app.frontend.url}")
  private String frontendUrl;

  public RoomController(RoomRepository roomRepository) {
    this.roomRepository = roomRepository;
  }

  // ✅ Create Room
  @PostMapping
  public ResponseEntity<?> createRoom(@RequestBody String roomId) {
    if (roomRepository.findByRoomId(roomId) != null) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Room already exists");
    }

    Room room = new Room();
    room.setRoomId(roomId);
    roomRepository.save(room);

    System.out.println("🔧 Room created: " + roomId);
    return ResponseEntity.status(HttpStatus.CREATED).body(room);
  }

  // ✅ Join Room
  @GetMapping("/{roomId}")
  public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
    Room room = roomRepository.findByRoomId(roomId);
    if (room == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }

    return ResponseEntity.ok(room);
  }

  // ✅ Get Paginated Messages
  @GetMapping("/{roomId}/messages")
  public ResponseEntity<?> getMessages(
      @PathVariable String roomId,
      @RequestParam(value = "page", defaultValue = "0") int page,
      @RequestParam(value = "size", defaultValue = "20") int size) {

    Room room = roomRepository.findByRoomId(roomId);
    if (room == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }

    List<Message> messages = room.getMessages();
    int total = messages.size();

    int start = Math.max(0, total - (page + 1) * size);
    int end = Math.min(total, total - page * size);

    if (start >= end || start < 0 || end > total) {
      return ResponseEntity.ok(List.of()); // Return empty list for out-of-bound pages
    }

    List<Message> paginatedMessages = messages.subList(start, end);
    System.out.println("📨 Fetched messages from Room: " + roomId + " | Page: " + page + ", Size: " + size);

    return ResponseEntity.ok(paginatedMessages);
  }
}
