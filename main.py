from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, get_db
from backend.models import Base, TodoItem
from backend.schemas import TodoItemCreate, TodoItemUpdate, TodoItemResponse

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173"
    "http://RACHEL18ANN.github.io"
] 

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tasks CRUD operations
@app.post("/tasks/", response_model=TodoItemResponse)
def create_task(task: TodoItemCreate, db: Session = Depends(get_db)):
    new_task = TodoItem(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/tasks/", response_model=list[TodoItemResponse])
def read_tasks(completed: bool = None, db: Session = Depends(get_db)):
    query = db.query(TodoItem)
    if completed is not None:
        query = query.filter(TodoItem.completed == completed)
    return query.all()

@app.get("/tasks/{filter}", response_model=TodoItemResponse)
def filter_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TodoItem).filter(TodoItem.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=TodoItemResponse)
def update_task(task_id: int, task: TodoItemUpdate, db: Session = Depends(get_db)):
    db_task = db.query(TodoItem).filter(TodoItem.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.dict().items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TodoItem).filter(TodoItem.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}
