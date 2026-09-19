from fastapi import FastAPI, File, Form, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from pathlib import Path
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


app = FastAPI()
app = FastAPI()

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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
    latitude REAL,
    longitude REAL,
    status TEXT,
    complaint_photo TEXT,
    resolution_description TEXT,
    resolution_photo TEXT, challenge_photo TEXT, challenge_description TEXT
)
""")

try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN complaint_photo TEXT")
    conn.commit()
except sqlite3.OperationalError:
    pass
try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN challenge_photo TEXT")
    conn.commit()
except sqlite3.OperationalError:
    pass
try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN challenge_description TEXT")
    conn.commit()
except sqlite3.OperationalError:
    pass

conn.commit()
# Add recurring issue fields to complaints
try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN is_recurring INTEGER DEFAULT 0")
except sqlite3.OperationalError:
    pass

try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN recurring_of INTEGER")
except sqlite3.OperationalError:
    pass

conn.commit()
# Create users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mobile_number TEXT UNIQUE NOT NULL,
    mobile_verified INTEGER DEFAULT 0,
    email TEXT,
    password TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
# Add OTP fields to users table
try:
    cursor.execute("ALTER TABLE users ADD COLUMN otp TEXT")
except sqlite3.OperationalError:
    pass

try:
    cursor.execute("ALTER TABLE users ADD COLUMN otp_expires_at TEXT")
except sqlite3.OperationalError:
    pass

conn.commit()
# Add GPS columns to existing complaints table
try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN latitude REAL")
except sqlite3.OperationalError:
    pass

try:
    cursor.execute("ALTER TABLE complaints ADD COLUMN longitude REAL")
except sqlite3.OperationalError:
    pass

conn.commit()
# Seed demo complaints when running on a fresh deployment
cursor.execute("SELECT COUNT(*) FROM complaints")
complaint_count = cursor.fetchone()[0]

if complaint_count == 0:
    cursor.executemany(
        """
        INSERT INTO complaints
        (category, description, location, status,
         complaint_photo, resolution_description, resolution_photo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                "Pothole",
                "Large pothole near the road",
                "Vasant Vihar",
                "Reported",
                None,
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
                None,
            ),
            (
                "Roads",
                "pothole in road",
                "Vasant Vihar, Delhi",
                "Resolution Submitted",
                None,
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
class OTPRequest(BaseModel):
    mobile_number: str


@app.post("/send-otp")
def send_otp(request: OTPRequest):
    print("SEND OTP ENDPOINT HIT")

    mobile = request.mobile_number

    # Validate Indian mobile number
    if not mobile.isdigit() or len(mobile) != 10 or mobile[0] not in "6789":
        return {
            "success": False,
            "message": "Please enter a valid 10-digit Indian mobile number."
        }

    # Generate a 6-digit OTP
    import random
    otp = str(random.randint(100000, 999999))

    # Save/update user
    cursor.execute(
        """
        INSERT INTO users (mobile_number, otp, otp_expires_at)
        VALUES (?, ?, datetime('now', '+5 minutes'))
        ON CONFLICT(mobile_number)
        DO UPDATE SET
            otp = excluded.otp,
            otp_expires_at = excluded.otp_expires_at
        """,
        (mobile, otp)
    )

    conn.commit()

    # Temporary: show OTP in response for local testing
    return {
        "success": True,
        "message": "OTP generated successfully.",
        "otp": otp
    }
class VerifyOTPRequest(BaseModel):
    mobile_number: str
    otp: str


@app.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest):

    mobile = request.mobile_number
    entered_otp = request.otp

    cursor.execute(
        """
        SELECT id, otp, otp_expires_at
        FROM users
        WHERE mobile_number = ?
        """,
        (mobile,)
    )

    user = cursor.fetchone()

    if user is None:
        return {
            "success": False,
            "message": "User not found. Please request OTP first."
        }

    user_id, saved_otp, otp_expires_at = user

    if saved_otp != entered_otp:
        return {
            "success": False,
            "message": "Invalid OTP."
        }

    cursor.execute(
        """
        UPDATE users
        SET mobile_verified = 1,
            otp = NULL,
            otp_expires_at = NULL
        WHERE id = ?
        """,
        (user_id,)
    )

    conn.commit()

    return {
        "success": True,
        "message": "Mobile number verified successfully.",
        "user_id": user_id
    }
class Complaint(BaseModel):
    category: str
    description: str
    location: str
    latitude: float
    longitude: float


@app.post("/complaints")
async def create_complaint(
    category: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    photo: UploadFile | None = File(None),
):
    photo_filename = None

    if photo:
        photo_filename = photo.filename
        photo_path = UPLOAD_DIR / photo.filename

        with open(photo_path, "wb") as buffer:
            buffer.write(await photo.read())
        # Check if this is a recurring issue
        cursor.execute(
        """
        SELECT id
        FROM complaints
        WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))
          AND latitude = ?
          AND longitude = ?
        ORDER BY id DESC
        LIMIT 1
        """,
        (category, latitude, longitude),
    )

    previous_complaint = cursor.fetchone()

    is_recurring = 1 if previous_complaint else 0
    recurring_of = previous_complaint[0] if previous_complaint else None

    cursor.execute(
        """
        INSERT INTO complaints
(category, description, location, latitude, longitude, status, complaint_photo, is_recurring, recurring_of)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
    category,
    description,
    location,
    latitude,
    longitude,
    "Reported",
    photo_filename,
    is_recurring,
    recurring_of,
),

    )
    conn.commit()

    complaint_id = cursor.lastrowid

    return {
        "message": "Complaint registered successfully",
        "complaint_id": f"CZ-2026-{complaint_id:04d}",
        "photo": photo_filename,
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
       complaint_photo, resolution_description, resolution_photo,
       challenge_photo, challenge_description
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
        "resolution_description": complaint[6],

"resolution_photo": complaint[7],

"challenge_photo": complaint[8],

"challenge_description": complaint[9],

"is_recurring": complaint[12],

"recurring_of": complaint[13],
    }

@app.get("/complaints")
def get_complaints():

    cursor.execute(
        """
        SELECT
            id,
            category,
            description,
            location,
            latitude,
            longitude,
            status,
            complaint_photo,
            resolution_description,
            resolution_photo,
            challenge_photo,
challenge_description,
is_recurring,
recurring_of
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
            "latitude": complaint[4],
            "longitude": complaint[5],
            "status": complaint[6],
            "complaint_photo": complaint[7],
            "resolution_description": complaint[8],
                        "challenge_photo": complaint[10],
            "challenge_description": complaint[11],
            "is_recurring": complaint[12],
            "recurring_of": complaint[13],
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

@app.put("/complaints/{complaint_id}/challenge")
async def submit_challenge(
    complaint_id: str,
    photo: UploadFile | None = File(None),
):
    complaint_number = int(complaint_id.split("-")[-1])

    photo_filename = None

    if photo:
        photo_filename = photo.filename
        photo_path = UPLOAD_DIR / photo.filename

        with open(photo_path, "wb") as buffer:
            buffer.write(await photo.read())

    cursor.execute(
        """
        UPDATE complaints
        SET challenge_photo = ?,
            status = ?
        WHERE id = ?
        """,
        (
            photo_filename,
            "Challenged",
            complaint_number,
        ),
    )

    conn.commit()

    if cursor.rowcount == 0:
        return {"error": "Complaint not found"}

    return {
        "complaint_id": complaint_id,
        "status": "Challenged",
        "message": "Challenge submitted successfully",
        "challenge_photo": photo_filename,
    }

@app.put("/complaints/{complaint_id}/resolution")
async def submit_resolution(
    complaint_id: str,
    description: str = Form(...),
    photo: UploadFile | None = File(None),
):
    complaint_number = int(complaint_id.split("-")[-1])

    photo_filename = None

    if photo:
        photo_filename = photo.filename
        photo_path = UPLOAD_DIR / photo.filename

        with open(photo_path, "wb") as buffer:
            buffer.write(await photo.read())

    cursor.execute(
        """
        UPDATE complaints
        SET resolution_description = ?,
            resolution_photo = ?,
            status = ?
        WHERE id = ?
        """,
        (
            description,
            photo_filename,
            "Resolution Submitted",
            complaint_number,
        ),
    )

    conn.commit()

    if cursor.rowcount == 0:
        return {"error": "Complaint not found"}

    return {
        "complaint_id": complaint_id,
        "status": "Resolution Submitted",
        "message": "Resolution evidence submitted successfully",
        "resolution_photo": photo_filename,
    }
@app.put("/complaints/{complaint_id}/challenge")
async def submit_challenge(
    complaint_id: str,
    reason: str = Form(...),
    photo: UploadFile | None = File(None),
):
    complaint_number = int(complaint_id.split("-")[-1])
    print("CHALLENGE REASON RECEIVED:", repr(reason))

    photo_filename = None

    if photo:
        photo_filename = photo.filename
        photo_path = UPLOAD_DIR / photo.filename

        with open(photo_path, "wb") as buffer:
            buffer.write(await photo.read())

    cursor.execute(
        """
        UPDATE complaints
        SET challenge_photo = ?,
            challenge_description = ?,
            status = ?
        WHERE id = ?
        """,
        (
            photo_filename,
            reason,
            "Challenged",
            complaint_number,
        ),
    )

    conn.commit()

    if cursor.rowcount == 0:
        return {"error": "Complaint not found"}

    return {
        "complaint_id": complaint_id,
        "status": "Challenged",
        "message": "Challenge submitted successfully",
        "challenge_photo": photo_filename,
        "challenge_description": reason,
    }