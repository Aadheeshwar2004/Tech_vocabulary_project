import sqlite3

DB_PATH = (r"C:\Users\304601\Desktop\Tech_vocabulary_project\Tech_vocabulary_project\backend\tech_vocab.db")

def view_users(cursor):
    print("\nUSERS TABLE")
    print("-" * 80)
    cursor.execute("SELECT id, username, email, is_admin, created_at FROM users")
    rows = cursor.fetchall()

    for row in rows:
        print(f"ID: {row[0]} | Username: {row[1]} | Email: {row[2]} | Admin: {row[3]} | Created: {row[4]}")


def view_terms(cursor):
    print("\nTERMS / QUIZ QUESTIONS TABLE")
    print("-" * 80)
    cursor.execute("""
        SELECT id, term, difficulty, created_at
        FROM terms
    """)
    rows = cursor.fetchall()

    for row in rows:
        print(f"ID: {row[0]} | Term: {row[1]} | Difficulty: {row[2]} | Created: {row[3]}")


def view_scores(cursor):
    print("\nUSER SCORES TABLE")
    print("-" * 80)
    cursor.execute("""
        SELECT user_id, correct, total, percentage, created_at
        FROM user_scores
    """)
    rows = cursor.fetchall()

    for row in rows:
        print(f"User ID: {row[0]} | Correct: {row[1]} | Total: {row[2]} | %: {row[3]} | Date: {row[4]}")


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nCONNECTED TO DATABASE:", DB_PATH)

    view_users(cursor)
    view_terms(cursor)
    view_scores(cursor)

    conn.close()
    print("\nDONE")


if __name__ == "__main__":
    main()
