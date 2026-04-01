from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# IMPORT BOTH FUNCTIONS
from services.cleaner import clean_data, suggest_cleaning

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/clean")
async def clean(file: UploadFile = File(...)):

    # Step 1: Read file
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file.file)
    else:
        df = pd.read_excel(file.file)

    # Step 2: Clean data
    df, report = clean_data(df)

    # Step 3: AI suggestions
    suggestions = suggest_cleaning(df)

    # Step 4: Return response
    return {
        "report": report,
        "suggestions": suggestions,
        "preview": df.head().to_dict()
    }