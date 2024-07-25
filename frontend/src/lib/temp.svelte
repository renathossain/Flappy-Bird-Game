<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Button from "./components/Button.svelte";
  import Avatar from "./components/Avatar.svelte";
  import { user } from "../store";
  import { get } from "svelte/store";
  import io, { Socket } from "socket.io-client";

  let socket: Socket | null = null;
  let lobbyId: number | null = null;
  let players: { userId: number; userName: string }[] = [];
  const userData = get(user);

  function initializeSocket() {
    if (userData) {
      socket = io("http://localhost:3000");

      socket.on("connect", () => {
        console.log("Client connected:", socket.id);
        socket.emit("test");
      });

      socket.on("test-response", () => {
        alert("test succeeded");
      });

      socket.on(`lobby-send-code-${userData.id}`, (code) => {
        console.log("Received lobby code:", code);
        lobbyId = code;

        // Register player event listener when lobbyId is set
        socket.on(`lobby-send-player-${lobbyId}`, (data) => {
          console.log("Received player data:", data);
          const { userId, userName } = data;
          players = [...players, { userId, userName }];
        });
      });

      socket.emit("lobby-create", userData.id);
    }
  }

  onMount(() => {
    initializeSocket();

    return () => {
      if (socket) {
        console.log("Disconnecting socket...");
        socket.disconnect();
      }
    };
  });
</script>
