import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

import urllib.parse

# Use environment variable for DB connection. 
# Robustly get env var, default to empty string, and strip whitespace/quotes.
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Handle accidental copy-paste of 'psql ' command
if DATABASE_URL.startswith("psql "):
    print("WARNING: Detected 'psql' command in DATABASE_URL. Stripping it.")
    DATABASE_URL = DATABASE_URL.replace("psql ", "", 1).strip()

# Strip quotes again after potential psql removal
DATABASE_URL = DATABASE_URL.strip("'").strip('"')

if not DATABASE_URL:
    print("WARNING: DATABASE_URL environment variable is not set or empty.")
    print("Using LOCAL fallback: postgresql+asyncpg://postgres:makugam3r@localhost:5432/EDU_Party_db")
    DATABASE_URL = "postgresql+asyncpg://postgres:makugam3r@localhost:5432/EDU_Party_db"
else:
    # Handle common prefixes to ensure asyncpg driver usage
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

    # REMOVE QUERY PARAMETERS (sslmode, channel_binding) causing asyncpg errors
    # asyncpg does not handle 'sslmode' in the query string well when passed via SQLAlchemy
    try:
        if "?" in DATABASE_URL:
            print("WARNING: Removing query parameters from DATABASE_URL to prevent asyncpg errors.")
            DATABASE_URL = DATABASE_URL.split("?")[0]
    except Exception as e:
        print(f"Error parsing URL query params: {e}")

    # Debug: Print the URL (masking password) to verify structure in logs
    try:
        masked_url = DATABASE_URL.split("@")[-1] # Show host/db part
        print(f"INFO: Connecting to database at ...@{masked_url}")
    except Exception:
        print("INFO: Connecting to database (URL could not be masked for logs)")

try:
    # Pass ssl="require" explicitly for Neon/Cloud implementations if needed, 
    # but usually just stripping the bad params allows the default negotiation to work.
    # We will pass connect_args to be safe if it's a remote URL.
    connect_args = {}
    if "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL:
        connect_args = {"ssl": "require"}
        
    engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)
except Exception as e:
    print(f"CRITICAL ERROR: Could not create database engine. URL was: {DATABASE_URL[:15]}...")
    raise e

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
