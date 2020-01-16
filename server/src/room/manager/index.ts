import { RoomStatus, Room } from "..";

const ROOMS = new Map<string, Room>();
const PLAYER_TO_ROOM = new Map<string, string>();

export default class RoomManager {
  static initialize = (): void => {
    for (let i = 0; i < 50; i++) {
      const id = `room:${i}`;
      ROOMS.set(id, new Room(id));
    }
  };

  static getRoomByPlayer = (playerId: string): Room => {
    return ROOMS.get(PLAYER_TO_ROOM.get(playerId));
  };

  static getRooms = (): Room[] => {
    return Array.from(ROOMS.values());
  };

  static getRoomStatus = (roomId: string): RoomStatus => {
    return ROOMS.get(roomId).getStatus();
  };

  static isRoomAvailable = (room: string): boolean => {
    return RoomManager.getRoomStatus(room) !== RoomStatus.FULL;
  };

  static joinRoom = (
    roomId: string,
    socket: SocketIO.Socket,
  ): Promise<Room> => {
    return new Promise((resolve, reject) => {
      ROOMS.get(roomId)
        .join(socket)
        .then((room: Room) => {
          PLAYER_TO_ROOM.set(socket.id, room.id);
          resolve(room);
        })
        .catch(reason => reject(reason));
    });
  };
}
