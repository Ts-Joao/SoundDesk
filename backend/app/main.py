from fastapi import FastAPI

app = FastAPI(title="SoundDesk API")

@app.get("/")
def root():
    return {
        "message": "API running"
    }