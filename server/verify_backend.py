import asyncio
import websockets
import json

async def hello():
    uri = "ws://127.0.0.1:8000/ws/game/test_user_1"
    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket")

        # Listen for game state updates
        for i in range(5):
            message = await websocket.recv()
            data = json.loads(message)
            print(f"Received Game State {i+1}: {data}")
            
            # Send a fake movement update
            await websocket.send(json.dumps({"x": i * 10, "y": i * 10}))
            
            await asyncio.sleep(0.1)

if __name__ == "__main__":
    try:
        asyncio.run(hello())
    except Exception as e:
        print(f"FAILED: {e}")
