#fastapi dev main.py to launch webserver

from sqlmodel import Session, select
from models import Inventory, engine

with Session(engine) as session:
    statement = select(Inventory).where(Inventory.id == 9)
    volleyball = session.exec(statement).one()

    print(volleyball)

    volleyball.quantity += 60

    session.add(volleyball)
    session.commit()
    session.refresh(volleyball)

    print(volleyball)