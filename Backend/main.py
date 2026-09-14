from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from pathlib import Path

app = FastAPI()

# Connect to the CityZen database
DB_PATH = Path(__file__).resolve().parent.parent / "cityzen.db"
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:8443",
    "http://127.0.0.1:8443",
    "https://city-zen-henna.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Connect to database
from pathlib import Path
cursor = conn.cursor()

# Create complaints table
cursor.execute("""
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    description TEXT,
    location TEXT,
    status TEXT,
    resolution_description TEXT,
    resolution_photo TEXT
)
""")

conn.commit()
# Seed demo complaints when running on a fresh deployment
cursor.execute("SELECT COUNT(*) FROM complaints")
complaint_count = cursor.fetchone()[0]

if complaint_count == 0:
    cursor.executemany(
        """
        INSERT INTO complaints
        (category, description, location, status,
         resolution_description, resolution_photo)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        [
            (
                "Pothole",
                "Large pothole near the road",
                "Vasant Vihar",
                "Reported",
                None,
                None,
            ),
            (
                "Pothole",
                "Large pothole near the road",
                "Vasant Vihar",
                "Reported",
                None,
                None,
            ),
            (
                "Roads",
                "pothole in road",
                "Vasant Vihar, Delhi",
                "Resolution Submitted",
                "Pothole repaired and road surface restored",
                "resolution-photo-demo.jpg",
            ),
        ],
    )
    conn.commit()
try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN resolution_description TEXT")
    cursor.execute("ALTER TABLE complaints ADD COLUMN resolution_photo TEXT")
    conn.commit()
except sqlite3.OperationalError:
    pass

@app.get("/")
def home():
    return {"message": "Welcome to CityZen!"}
class Complaint(BaseModel):
    category: str
    description: str
    location: str


@app.post("/complaints")
def create_complaint(complaint: Complaint):

    cursor.execute(
        """
        INSERT INTO complaints (category, description, location, status)
        VALUES (?, ?, ?, ?)
        """,
        (
            complaint.category,
            complaint.description,
            complaint.location,
            "Reported"
        )
    )

    conn.commit()

    complaint_number = cursor.lastrowid

    complaint_id = f"CZ-2026-{complaint_number:04d}"

    return {
        "complaint_id": complaint_id,
        "status": "Reported"
    }

@app.get("/complaints/{complaint_id}")
def get_complaint(complaint_id: str):
    try:
        complaint_number = int(complaint_id.split("-")[-1])
    except (ValueError, IndexError):
        return {"error": "Invalid complaint ID"}

    cursor.execute(
        """
        SELECT id, category, description, location, status,
               resolution_description, resolution_photo
        FROM complaints
        WHERE id = ?
        """,
        (complaint_number,)
    )

    complaint = cursor.fetchone()

    if complaint is None:
        return {"error": "Complaint not found"}

    return {
        "complaint_id": f"CZ-2026-{complaint[0]:04d}",
        "category": complaint[1],
        "description": complaint[2],
        "location": complaint[3],
        "status": complaint[4],
        "resolution_description": complaint[5],
        "resolution_photo": complaint[6]
    }

@app.get("/complaints")
def get_complaints():

    cursor.execute(
        """
        SELECT id, category, description, location, status
        FROM complaints
        ORDER BY id DESC
        """
    )

    complaints = cursor.fetchall()

    result = []

    for complaint in complaints:
        result.append({
            "complaint_id": f"CZ-2026-{complaint[0]:04d}",
            "category": complaint[1],
            "description": complaint[2],
            "location": complaint[3],
            "status": complaint[4]
        })

    return result

@app.put("/complaints/{complaint_id}/status")
def update_complaint_status(complaint_id: str, status: str):
    complaint_number = int(complaint_id.split("-")[-1])

    cursor.execute(
        """
        UPDATE complaints
        SET status = ?
        WHERE id = ?
        """,
        (status, complaint_number)
    )

    conn.commit()

    if cursor.rowcount == 0:
        return {"error": "Complaint not found"}

    return {
        "complaint_id": complaint_id,
        "status": status
    }


class Resolution(BaseModel):
    description: str
    photo: str


@app.put("/complaints/{complaint_id}/resolution")
def submit_resolution(complaint_id: str, resolution: Resolution):

    complaint_number = int(complaint_id.split("-")[-1])

    cursor.execute(
        """
        UPDATE complaints
        SET resolution_description = ?,
            resolution_photo = ?,
            status = ?
        WHERE id = ?
        """,
        (
            resolution.description,
            resolution.photo,
            "Resolution Submitted",
            complaint_number
        )
    )

    conn.commit()

    if cursor.rowcount == 0:
        return {"error": "Complaint not found"}

    return {
        "complaint_id": complaint_id,
        "status": "Resolution Submitted",
        "message": "Resolution evidence submitted successfully"
    }