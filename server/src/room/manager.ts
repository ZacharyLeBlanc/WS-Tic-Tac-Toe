import Room from "./room";

export default class RoomManager {
  private io: SocketIO.Server;
  private rooms = new Map<string, Room>();
  private players = new Map<string, string>();

  public constructor(io: SocketIO.Server) {
    this.io = io;
    for (let i = 0; i < 50; i++) {
      const id = `room:${i}`;
      this.rooms.set(id, new Room(id));
    }
  }

  private getRoomByPlayer = (playerId: string): Room | undefined => {
    return this.rooms.get(this.players.get(playerId) ?? "");
  };

  public getRooms = (): Room[] => {
    return Array.from(this.rooms.values());
  };

  public joinRoom = async (
    roomId: string,
    socket: SocketIO.Socket,
  ): Promise<void> => {
    const room: Room | undefined = this.rooms.get(roomId);
    if (room) {
      const joinedRoom: Room = await room.join(socket.id);
      socket.join(joinedRoom.id, () => {
        joinedRoom.startGame();
        this.players.set(socket.id, room.id);
        this.io.emit("room:getAll", { data: this.getRooms() });
        this.io
          .to(room.id)
          .emit("room", { data: { ...room, endGameInterval: null } });
      });
    }
  };

  public leaveRoom = (socket: SocketIO.Socket): void => {
    const room: Room | undefined = this.getRoomByPlayer(socket.id);
    room?.players.forEach((playerId: string) => {
      if (playerId !== socket.id) {
        this.io.sockets.connected[playerId]?.emit("room:destroy", {
          data: "Other Player disconnected",
        });
      } else {
        this.io.sockets.connected[playerId]?.emit("room:destroy", {
          data: "You disconnected",
        });
      }
      this.io.sockets.connected[playerId]?.leave(room.id);
    });
    room?.reset();
    this.io.emit("room:getAll", { data: this.getRooms() });
  };

  public move = (
    data: { x: number; y: number },
    socket: SocketIO.Socket,
  ): void => {
    const room: Room | undefined = this.getRoomByPlayer(socket.id);
    if (room) {
      room.game?.move(data, socket.id);
      this.io
        .to(room.id)
        .emit("room", { data: { ...room, endGameInterval: null } });
      if (room.game?.isGameOver) {
        room
          .endGame(() => {
            this.io
              .to(room.id)
              .emit("room", { data: { ...room, endGameInterval: null } });
          })
          .then((players: [string, string]) => {
            players.forEach((playerId: string) => {
              this.io.sockets.connected[playerId]?.emit("room:destroy", {
                data: "Room timed out",
              });
              this.io.sockets.connected[playerId]?.leave(room.id);
            });
            this.io.emit("room:getAll", { data: this.getRooms() });
          });
      }
    }
  };

  public rejoin = async (socket: SocketIO.Socket): Promise<void> => {
    const room: Room | undefined = this.getRoomByPlayer(socket.id);
    if (room) {
      await room.playAgain(socket.id);
      this.io
        .to(room.id)
        .emit("room", { data: { ...room, endGameInterval: null } });
    }
  };
}
