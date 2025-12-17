from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .core.database import engine as engine_db, Base, get_db
from .core.models import Player as PlayerDB
from .game.connection_manager import manager
from .game.active_game_manager import game_manager
from .web_api import router as web_router

app = FastAPI()

# Enable CORS for frontend (assuming plain HTML or React on localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all. change in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(web_router)

@app.get("/")
async def root():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    # Create tables
    async with engine_db.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Start game loop
    import asyncio
    asyncio.create_task(game_manager.start_game_loop())

@app.websocket("/ws/game/{lobby_id}/{username}")
async def websocket_endpoint(
    websocket: WebSocket, 
    lobby_id: str,
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
        
        # Register in Active Game Lobby
        game_manager.add_player(username, lobby_id)

        while True:
            data = await websocket.receive_json()
            game_manager.process_player_input(username, lobby_id, data)
            
    except WebSocketDisconnect:
        manager.disconnect(username)
        game_manager.remove_player(username, lobby_id)
