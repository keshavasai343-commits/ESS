import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, employee, leave, payroll, performance, directory, documents, attendance, notifications, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Self-Service Portal", version="1.0.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
app.include_router(attendance.router)
app.include_router(notifications.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok"}
