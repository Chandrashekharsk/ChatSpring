package com.chat_app.chat_app.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.chat_app.chat_app.entities.Room;

public interface RoomRepository extends MongoRepository<Room, String> {
    //get room using room id
    Room findByRoomId(String roomId);
}
