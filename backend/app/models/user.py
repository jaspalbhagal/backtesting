from sqlalchemy import Column, Integer, String, Enum, DateTime , func
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID
from app.models.enums import UserRole
import uuid


class User(Base):
    __tablename__ = "users"

    id =  Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)