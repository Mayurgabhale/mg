import sqlite3

def create_db():
    conn = sqlite3.connect("devices.db")
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        name TEXT,
        ip_address TEXT UNIQUE,
        location TEXT,
        city TEXT,
        details TEXT,
        hyperlink TEXT,
        remark TEXT,
        status TEXT,
        last_ping TEXT
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_db()