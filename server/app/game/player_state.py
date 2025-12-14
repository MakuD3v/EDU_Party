from typing import Dict, Any

class Player:
    """
    Represents the runtime state of a player in the active game.
    Different from the database model which stores persistent data.
    """
    def __init__(self, username: str):
        self.username = username
        self.x: float = 0.0
        self.y: float = 0.0
        # Add other runtime attributes here (health, animation_state, etc.)
    
    def update_from_input(self, input_data: Dict[str, Any]):
        """
        Process input data to update player state.
        """
        if "x" in input_data:
            self.x = float(input_data["x"])
        if "y" in input_data:
            self.y = float(input_data["y"])
            
    def to_dict(self) -> Dict[str, Any]:
        """
        Serialize player state for broadcasting.
        """
        return {
            "x": self.x,
            "y": self.y
        }
