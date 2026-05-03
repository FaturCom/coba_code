from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "*", # Mengizinkan semua frontend (karena sekarang dihosting bersama)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str

# Ubah rute ini dengan menambahkan /api
@app.get("/")
def read_root():
    return {
        "status": "Hello world",
    }

# Ubah rute ini dengan menambahkan /api
@app.post("/api/hello")
def say_Hello(item: Item):
    return{
        "status": f"Hello, {item.name}!"
    }