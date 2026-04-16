from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FaiNance API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}