from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, employee, leave, payroll, performance, directory, documents

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Self-Service Portal", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employee.router)
app.include_router(leave.router)
app.include_router(payroll.router)
app.include_router(performance.router)
app.include_router(directory.router)
app.include_router(documents.router)


@app.get("/health")
def health():
    return {"status": "ok"}
