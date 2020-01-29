import Room from "../room";
import RoomStatus from "../status";

jest.useFakeTimers();

describe("Room Tests", () => {
  it("should create new room", () => {
    const room: Room = new Room("room:0");
    expect(room.id).not.toBeNull();
    expect(room.id).toBe("room:0");
    expect(room.game).not.toBeNull();
    expect(room.numberOfPlayers).toBe(0);
    expect(room.status).toBe(RoomStatus.EMPTY);
    expect(room.players).toStrictEqual(["", ""]);
    expect(room.endGameTimer).toBe(60);
    expect(room.endGameInterval).toBeNull();
    expect(room.rejoinedPlayers).toStrictEqual(["", ""]);
  });

  describe("Room Join Tests", () => {
    it("should join room", async () => {
      const room: Room = new Room("room:0");
      const joinedRoom = await room.join("player_one");
      expect(joinedRoom.players).toStrictEqual(["player_one", ""]);
      expect(joinedRoom.numberOfPlayers).toBe(1);
      expect(joinedRoom.status).toBe(RoomStatus.WAITING);
      const joinedRoom2 = await room.join("player_two");
      expect(joinedRoom2.players).toStrictEqual(["player_one", "player_two"]);
      expect(joinedRoom2.numberOfPlayers).toBe(2);
      expect(joinedRoom2.status).toBe(RoomStatus.FULL);
    });

    it("should throw error on full room", async () => {
      const room: Room = new Room("room:0");
      await room.join("player_one");
      await room.join("player_two");
      await expect(room.join("player_three")).rejects.toThrow("Room is full");
    });

    it("should throw error on same player joining", async () => {
      const room: Room = new Room("room:0");
      await room.join("player_one");
      await expect(room.join("player_one")).rejects.toThrow(
        "You are already in this room",
      );
    });
  });

  describe("End Game Tests", () => {
    it("should reset room after timer expires", async () => {
      const room: Room = new Room("room:0");
      await room.join("player_one");
      await room.join("player_two");
      const callback: Function = jest.fn();
      expect(room.endGameInterval).toBeNull();
      const promise = room.endGame(callback);
      jest.advanceTimersByTime(61000);
      await promise;
      expect(room.endGameTimer).toBe(60);
      expect(callback).toBeCalled();
      expect(room.endGameInterval).toBeNull();
    });
  });

  describe("Play Again Tests", () => {
    it("should reset room after timer expires", async () => {
      const room: Room = new Room("room:0");
      await room.join("player_one");
      await room.join("player_two");
      const callback: Function = jest.fn();
      expect(room.endGameInterval).toBeNull();
      room.endGame(callback);
      room.playAgain("player_one");
      expect(room.rejoinedPlayers).toStrictEqual(["player_one", ""]);
      room.playAgain("player_two");
      expect(room.rejoinedPlayers).toStrictEqual(["", ""]);
      expect(room.endGameInterval).toBeNull();
    });
  });
});
