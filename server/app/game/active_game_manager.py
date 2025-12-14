import asyncio
from typing import Dict
from .player_state import Player
from .connection_manager import manager

class ActiveGameManager:
    """
    Singleton class that manages the authoritative game state and main loop.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ActiveGameManager, cls).__new__(cls)
            cls._instance.active_players: Dict[str, Player] = {}
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
            # 1. Broadcast State
            await self.broadcast_state()
            
            # 2. Tick Rate (20 TPS)
            await asyncio.sleep(0.05)

    async def broadcast_state(self):
        """
        Compiles and sends the current state to all connected clients.
        """
        # Serialize all players
        state_snapshot = {
            "players": {
                username: player.to_dict() 
                for username, player in self.active_players.items()
            }
        }
        await manager.broadcast(state_snapshot)

    def add_player(self, username: str):
        """
        Registers a new player into the active game.
        """
        if username not in self.active_players:
            print(f"ActiveGameManager: Adding player {username}")
            self.active_players[username] = Player(username)

    def remove_player(self, username: str):
        """
        Removes a player from the active game.
        """
        if username in self.active_players:
            print(f"ActiveGameManager: Removing player {username}")
            del self.active_players[username]

    def process_player_input(self, username: str, input_data: dict):
        """
        Handles input from a specific player.
        """
        if username in self.active_players:
            player = self.active_players[username]
            player.update_from_input(input_data)

# Global Singleton Access
game_manager = ActiveGameManager()
