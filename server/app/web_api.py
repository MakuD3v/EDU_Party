from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional

from .core.database import get_db
from .core.models import Player
from .game.active_game_manager import game_manager

router = APIRouter(prefix="/api")

# --- Pydantic Models ---
class ProfileUpdate(BaseModel):
    username: str
    display_name: str
    skin: str

class ProfileResponse(BaseModel):
    id: int
    username: str
    display_name: Optional[str]
    skin: str
    coins: int

class LobbyInfo(BaseModel):
    host_username: str
    loaded_game: str
    players: List[str]

# --- Endpoints ---

@router.get("/profile/{username}", response_model=ProfileResponse)
async def get_profile(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).filter(Player.username == username))
    player = result.scalars().first()
    if not player:
        # Auto-create for simplicity if queried via menu first time? 
        # Or return 404. Let's return 404 to be specific, or auto-create if we want seamlessness.
        # Given the flow, the user might type a username in the menu.
        # Let's return 404 and let the frontend decide to "Create" via POST.
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.post("/profile", response_model=ProfileResponse)
async def update_create_profile(profile_data: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).filter(Player.username == profile_data.username))
    player = result.scalars().first()
    
    if player:
        player.display_name = profile_data.display_name
        player.skin = profile_data.skin
    else:
        player = Player(
            username=profile_data.username,
            display_name=profile_data.display_name,
            skin=profile_data.skin
        )
        db.add(player)
    
    await db.commit()
    await db.refresh(player)
    return player

@router.get("/lobbies", response_model=List[LobbyInfo])
async def list_lobbies():
    lobbies_info = []
    for lobby_id, lobby_data in game_manager.lobbies.items():
        lobbies_info.append(LobbyInfo(
            host_username=lobby_data["host"],
            loaded_game=lobby_id, # Using lobby_id as game name for now
            players=list(lobby_data["players"].keys())
        ))
    return lobbies_info

@router.post("/lobbies/host")
async def host_game(username: str):
    import uuid
    lobby_id = str(uuid.uuid4())[:8]
    game_manager.create_lobby(lobby_id, username)
    # The token needs to encode the lobby ID for the client to join.
    # Hand-off format: "lobby_id:username" or similar if we change client.
    # But Godot client connects to /ws/game/lobby_id/username
    # So we return the launch arguments or token.
    return {
        "status": "lobby_created", 
        "lobby_id": lobby_id,
        "connection_url": f"ws://localhost:8000/ws/game/{lobby_id}/{username}"
    }
