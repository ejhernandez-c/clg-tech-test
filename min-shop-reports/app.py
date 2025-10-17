from flask import Flask, jsonify, send_from_directory
import os
import pymysql
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder="static", static_url_path="")

def get_connection():
    return pymysql.connect(
        host=os.getenv('MYSQL_HOST','127.0.0.1'),
        port=int(os.getenv('MYSQL_PORT',3306)),
        user=os.getenv('MYSQL_USER','root'),
        password=os.getenv('MYSQL_PASSWORD',''),
        database=os.getenv('MYSQL_DATABASE','shopdb'),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/reports/top-customers')
def top_customers():
    """
    Call stored procedure clgdb.get_top_customers_orders()
    Returns the top 5 customers by total spend.
    """
    conn = get_connection()
    with conn.cursor() as cur:
        cur.callproc('clgdb.get_top_customers_orders')
        rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/reports/top-products')
def top_products():
  """
    Call stored procedure clgdb.get_top_products()
    Returns the top 5 products by total revenue.
  """
  conn = get_connection()
  with conn.cursor() as cur:
      cur.callproc('clgdb.get_top_products')
      rows = cur.fetchall()
  conn.close()
  return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
