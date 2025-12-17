import asyncio
from typing import Dict
from .player_state import Player
from .connection_manager import manager

class ActiveGameManager:
    """
    Singleton class that manages the authoritative game state and main loop.
    Supports multiple lobbies.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ActiveGameManager, cls).__new__(cls)
            # lobbies: lobby_id -> { "players": { username: Player }, "state": ... }
            cls._instance.lobbies: Dict[str, Dict] = {}
            cls._instance.is_running = False
        return cls._instance

    async def start_game_loop(self):
        """
        Starts the main game loop.
        """
        if self.is_running:
            return

        self.is_running = True
        print("ActiveGameManager: Game Loop Started.")
        
        while self.is_running:
            # 1. Broadcast State for each lobby
            await self.broadcast_state()
            
            # 2. Tick Rate (20 TPS)
            await asyncio.sleep(0.05)

    async def broadcast_state(self):
        """
        Compiles and sends the current state to all connected clients in each lobby.
        """
        for lobby_id, lobby in self.lobbies.items():
            state_snapshot = {
                "status": lobby.get("status", "WAITING"),
                "players": {
                    username: p.to_dict() 
                    for username, p in lobby["players"].items()
                }
            }
            # Broadcast to players in this lobby
            for username in lobby["players"]:
                await manager.send_to_user(username, state_snapshot)

    def create_lobby(self, lobby_id: str, host_username: str):
        if lobby_id not in self.lobbies:
            # lobby_id should already be 4-digit code passed from API
            self.lobbies[lobby_id] = {
                "players": {},
                "host": host_username,
                "status": "WAITING",
                "created_at": asyncio.get_event_loop().time()
            }
            print(f"Lobby created: {lobby_id} by {host_username}")

    async def start_lobby(self, lobby_id: str):
        if lobby_id in self.lobbies:
            print(f"Starting lobby {lobby_id}")
            self.lobbies[lobby_id]["status"] = "PLAYING"
            # Broadcast distinct 'GAME_START' message or rely on status update
            msg = {"type": "GAME_START", "lobby_id": lobby_id}
            for username in self.lobbies[lobby_id]["players"]:
                 await manager.send_to_user(username, msg)

    def add_player(self, username: str, lobby_id: str):
        """
        Registers a new player into a specific lobby.
        """
        if lobby_id not in self.lobbies:
            # Auto-create if not exists (or handle error)
            # For robustness, let's auto-create "default" if needed
            self.create_lobby(lobby_id, username)
        
        if username not in self.lobbies[lobby_id]["players"]:
            print(f"ActiveGameManager: Adding player {username} to {lobby_id}")
            self.lobbies[lobby_id]["players"][username] = Player(username)

    def remove_player(self, username: str, lobby_id: str):
        """
        Removes a player from the lobby.
        """
        if lobby_id in self.lobbies and username in self.lobbies[lobby_id]["players"]:
            print(f"ActiveGameManager: Removing player {username} from {lobby_id}")
            del self.lobbies[lobby_id]["players"][username]
            # Clean up empty lobby?
            if not self.lobbies[lobby_id]["players"]:
                pass # distinct policy on when to kill lobby

    def process_player_input(self, username: str, lobby_id: str, input_data: dict):
        """
        Handles input from a specific player.
        """
        if lobby_id in self.lobbies and username in self.lobbies[lobby_id]["players"]:
            player = self.lobbies[lobby_id]["players"][username]
            player.update_from_input(input_data)

# Global Singleton Access
game_manager = ActiveGameManager()
