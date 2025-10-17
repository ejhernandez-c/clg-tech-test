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
    sql = """
    SELECT 
      o.customer_id,
      c.name AS customer_name,
      COUNT(DISTINCT o.id) AS total_orders,
      ROUND(SUM(oi.quantity * oi.unit_price),2) AS total_spend,
      ROUND(SUM(oi.quantity * oi.unit_price)/COUNT(DISTINCT o.id),2) AS avg_order_value
    FROM 
    clgdb.orders o
      INNER JOIN clgdb.order_items oi 
        ON oi.order_id = o.id
      INNER JOIN clgdb.customers c 
        ON c.id = o.customer_id 
    WHERE  
      o.status ='PAID'
    AND o.created_at >= NOW() - INTERVAL 30 DAY
    GROUP BY o.customer_id,c.name 
    LIMIT 5;
    """
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(sql)
        rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/reports/top-products')
def top_products():
    sql = """
  SELECT
      oi.product_sku,
      SUM(oi.quantity) AS total_units_sold,
      ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue,
      COUNT(DISTINCT o.customer_id) AS unique_customers,
      ROUND(SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT oi.order_id), 2) AS avg_order_value_per_product
    FROM clgdb.orders o
      INNER JOIN clgdb.order_items oi 
    	ON o.id = oi.order_id
    WHERE o.status = 'PAID'
      AND o.created_at >= NOW() - INTERVAL 60 DAY
    GROUP BY oi.product_sku
    ORDER BY total_revenue DESC
    LIMIT 5;
    """
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(sql)
        rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
