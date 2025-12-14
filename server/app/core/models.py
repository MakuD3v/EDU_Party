from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    coins = Column(Integer, default=0)
    last_login = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
