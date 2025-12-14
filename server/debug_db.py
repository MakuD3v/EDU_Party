import asyncio
import asyncpg

async def test_connection():
    print("------------------------------------------------")
    print("Testing connection with provided credentials:")
    print("User: postgres")
    print("Pass: makugam3r")
    print("DB:   EDU_Party_db")
    print("------------------------------------------------")
    
    try:
        # Construct the URL exactly as given for the target DB
        url = 'postgresql://postgres:makugam3r@localhost:5432/EDU_Party_db'
        print(f"Connecting to: {url}")
        conn = await asyncpg.connect(url)
        print("SUCCESS! Connected to EDU_Party_db.")
        await conn.close()
    except Exception as e:
        print(f"FAILED to connect to EDU_Party_db: {e}")
        
    print("\n------------------------------------------------")
    print("Testing connection to 'postgres' DB to check creation rights:")
    try:
        url = 'postgresql://postgres:makugam3r@localhost:5432/postgres'
        print(f"Connecting to: {url}")
        conn = await asyncpg.connect(url)
        print("SUCCESS! Connected to postgres DB.")
        
        # Check if EDU_Party_db exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'EDU_Party_db'")
        if exists:
            print("Database 'EDU_Party_db' EXISTS.")
        else:
            print("Database 'EDU_Party_db' DOES NOT EXIST.")
            try:
                print("Attempting to create database...")
                await conn.execute('CREATE DATABASE "EDU_Party_db"')
                print("Database created!")
            except Exception as e:
                print(f"Failed to create database: {e}")
        
        await conn.close()
    except Exception as e:
        print(f"FAILED to connect to postgres DB: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
