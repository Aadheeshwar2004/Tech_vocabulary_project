import sqlite3

conn = sqlite3.connect(r"C:\Users\304601\Desktop\Tech_vocabulary_project\Tech_vocabulary_project\backend\tests\test_results.db")
cursor = conn.cursor()

cursor.execute("""
    SELECT id, test_name, endpoint, method,
           expected_status, actual_status, result, timestamp
    FROM test_results
""")

rows = cursor.fetchall()

print("\nTEST RESULTS\n" + "-" * 90)
print(f"{'ID':<3} {'TEST NAME':<22} {'ENDPOINT':<22} {'METHOD':<6} {'EXP':<5} {'ACT':<5} {'RESULT':<6}")
print("-" * 90)

for r in rows:
    print(f"{r[0]:<3} {r[1]:<22} {r[2]:<22} {r[3]:<6} {r[4]:<5} {r[5]:<5} {r[6]:<6}")

conn.close()
