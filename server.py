from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str

@app.get("/")
def read_root():
    return {
        "status": "Hello world",
    }

    
@app.post("/hello")
def say_Hello(item: Item):
    return{
        "status": f"Hello, {item.name}!"
    }
