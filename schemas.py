from pydantic import BaseModel

class TodoItemBase(BaseModel):
    title: str
    completed: bool = False

class TodoItemCreate(TodoItemBase):
    pass

class TodoItemUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None

class TodoItemResponse(TodoItemBase):
    id: int

    class Config:
        from_attributes = True