import psycopg2

# Connect to the PostgreSQL server
def connect():
    try:
        conn = psycopg2.connect(user="avaneepk", 
                            password="Lahticity1", 
                            host="services-ds-project.postgres.database.azure.com", 
                            port=5432, 
                            database="postgres")
        print("Connected to PostgreSQL!")

    # Create a cursor and execute something simple
        cur = conn.cursor()
        cur.execute("SELECT version();")
        record = cur.fetchone()
        print("PostgreSQL version:", record)

    # Clean up
        cur.close()
        conn.close()

    except Exception as e:
        print("Failed to connect:", e)

connect()