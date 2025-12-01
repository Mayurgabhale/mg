import sqlite3

def get_db():
    conn = sqlite3.connect("devices.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    db = get_db()
    db.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT,
        ip_address TEXT UNIQUE,
        location TEXT,
        city TEXT,
        details TEXT,
        hyperlink TEXT,
        remark TEXT,
        person_name TEXT,
        doors TEXT
    )
    """)
    db.commit()

# Run once to ensure tables exist
create_tables()



....
