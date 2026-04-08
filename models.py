from typing import Optional
from sqlmodel import Field, SQLModel, create_engine


class Inventory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sku: str = Field(unique=True)
    name: str
    category: str
    quantity: int = Field(default=0)
    unit_price: float


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    password_hash: str


DATABASE_URL = "sqlite:///warehouse.db"
engine = create_engine(DATABASE_URL)
SQLModel.metadata.create_all(engine)
