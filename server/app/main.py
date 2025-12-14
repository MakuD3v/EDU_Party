import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .core.database import engine as engine_db, Base, get_db
from .core.models import Player as PlayerDB
from .game.connection_manager import manager
from .game.active_game_manager import game_manager

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    # Create tables
    async with engine_db.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Start game loop
    asyncio.create_task(game_manager.start_game_loop())

@app.websocket("/ws/game/{username}")
async def websocket_endpoint(
    websocket: WebSocket, 
    username: str, 
    db: AsyncSession = Depends(get_db)
):
    await manager.connect(websocket, username)
    try:
        # DB Logic: Get or Create Player
        result = await db.execute(select(PlayerDB).filter(PlayerDB.username == username))
        player_db = result.scalars().first()
        
        if not player_db:
            print(f"Creating new player DB record: {username}")
            player_db = PlayerDB(username=username)
            db.add(player_db)
            await db.commit()
            await db.refresh(player_db)
        else:
            print(f"Player found in DB: {username}, Coins: {player_db.coins}")
        
        # Register in Active Game
        game_manager.add_player(username)

        while True:
            data = await websocket.receive_json()
            game_manager.process_player_input(username, data)
            
    except WebSocketDisconnect:
        manager.disconnect(username)
        game_manager.remove_player(username)
