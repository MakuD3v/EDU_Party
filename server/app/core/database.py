import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Use environment variable for DB connection. 
# For local dev, you can set this env var or use a .env file.
# Default is set to a placeholder that will fail if not set in production.
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback for local testing if env var not set (OPTIONAL: Remove this for strict production safety)
    # WARNING: Do not commit real passwords to version control
    DATABASE_URL = "postgresql+asyncpg://postgres:makugam3r@localhost:5432/EDU_Party_db"


engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
