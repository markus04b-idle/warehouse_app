from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException
from sqlmodel import Session, select
from models import Inventory, User, engine
from pydantic import BaseModel
import bcrypt

app = FastAPI()


class UserRegister(BaseModel):
    username: str
    password: str


@app.post("/register")
def register_user(credentials: UserRegister):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.username == credentials.username)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        password_hash = bcrypt.hashpw(credentials.password.encode(), bcrypt.gensalt()).decode()
        user = User(username=credentials.username, password_hash=password_hash)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"id": user.id, "username": user.username}


@app.get("/inventory")
async def get_inventory():
    with Session(engine) as session:
        statement = select(Inventory)
        items = session.exec(statement).all()
        return items

@app.post("/inventory")
def create_item(item: Inventory):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

@app.put("/inventory/{id}")
def update_item(id: int, updated_item: Inventory):
    with Session(engine) as session:
        statement = select(Inventory).where(Inventory.id == id)
        record = session.exec(statement).one()
        record.sku = updated_item.sku
        record.name = updated_item.name
        record.category = updated_item.category
        record.quantity = updated_item.quantity
        record.unit_price = updated_item.unit_price
        session.add(record)
        session.commit()
        session.refresh(record)
        return record

@app.delete('/inventory/{id}')
def delete_item(id:int):
    with Session(engine) as session:
        statement = select(Inventory).where(Inventory.id == id)
        record = session.exec(statement).one()
        session.delete(record)
        session.commit()

app.mount("/", StaticFiles(directory="static", html=True), name="static")