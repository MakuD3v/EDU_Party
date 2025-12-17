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
    status: str
    players: List[str]

# --- Endpoints ---

@router.get("/profile/{username}", response_model=ProfileResponse)
async def get_profile(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).filter(Player.username == username))
    player = result.scalars().first()
    if not player:
        # Auto-create for simplicity if queried via menu
        # This simplifies the flow for "Guest" users in the new Cartoony UI
        player = Player(username=username, display_name=username, skin="default")
        db.add(player)
        await db.commit()
        await db.refresh(player)
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
        if lobby_data["status"] == "WAITING":
            lobbies_info.append(LobbyInfo(
                host_username=lobby_data["host"],
                loaded_game=lobby_id, # This is the Code
                status=lobby_data["status"],
                players=list(lobby_data["players"].keys())
            ))
    return lobbies_info

@router.post("/lobbies/host")
async def host_game(username: str):
    import random, string
    # Generate 4-digit code
    lobby_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    game_manager.create_lobby(lobby_id, username)
    
    return {
        "status": "lobby_created", 
        "lobby_id": lobby_id,
        "connection_url": f"ws://localhost:8000/ws/game/{lobby_id}/{username}"
    }

@router.post("/lobbies/start")
async def start_game(lobby_id: str):
    await game_manager.start_lobby(lobby_id)
    return {"status": "started"}
