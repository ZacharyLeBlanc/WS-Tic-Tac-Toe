<script>
  import { navigate } from "svelte-routing";
  import List from "../components/List/index.svelte";
  import { rooms } from "../stores/room.js";

  const STATUS = {
    0: "Empty",
    1: "Waiting",
    2: "Full",
  };

  $: data = $rooms.map(room => {
    let [, roomNumber] = room.id.split(":");
    return {
      primary: `Room: #${roomNumber}`,
      secondary: `Status: ${STATUS[room.status]} - Number of players: ${
        room.numberOfPlayers
      }`,
      onClick: () => {
        if (room.numberOfPlayers < 2) {
          navigate(`/rooms/${roomNumber}`);
        }
      },
    };
  });
</script>

<List {data} />
