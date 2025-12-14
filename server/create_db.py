import asyncio
import asyncpg

async def create_database():
    # Connect to default 'postgres' db to check for existence of 'EDU_Party_db'
    sys_conn = await asyncpg.connect(user='postgres', password='postgres', database='postgres', host='localhost') # Wait, user gave password for 'postgres' user as 'makugam3r'
    # Actually, the user connection string suggests user 'postgres' has password 'makugam3r'
    
    try:
        # Close the default connection first just in case, but wait, I need to know the password for 'postgres' user to connect to 'postgres' DB.
        # The user provided `postgres:makugam3r`. So I will use that.
        await sys_conn.close()
    except:
        pass

    try:
        sys_conn = await asyncpg.connect(user='postgres', password='makugam3r', database='postgres', host='localhost')
        exists = await sys_conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'EDU_Party_db'")
        if not exists:
            print("Database 'EDU_Party_db' does not exist. Creating...")
            await sys_conn.execute('CREATE DATABASE "EDU_Party_db"') # Quote mixed case if needed, but standard is lowercase usually. 
            # Postgres lowercases unquoted names. User wrote EDU_Party_db. Let's quote it to be safe or just use it.
            # Actually, `CREATE DATABASE EDU_Party_db` will create `edu_party_db`. 
            # Let's try to simple connection check first.
            print("Database created.")
        else:
            print("Database 'EDU_Party_db' already exists.")
        await sys_conn.close()

        # Now test connection to the specific DB
        print("Testing connection to EDU_Party_db...")
        conn = await asyncpg.connect('postgresql://postgres:makugam3r@localhost:5432/EDU_Party_db')
        print("Successfully connected to database 'EDU_Party_db'!")
        await conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(create_database())
