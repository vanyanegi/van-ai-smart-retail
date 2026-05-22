from database import SessionLocal
from models import Product, Warehouse, Inventory, Sales
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

db = SessionLocal()

# -------------------------
# CLEAR OLD DATA
# -------------------------

db.query(Sales).delete()
db.query(Inventory).delete()
db.query(Product).delete()
db.query(Warehouse).delete()

db.commit()

# -------------------------
# CREATE WAREHOUSES
# -------------------------

warehouse_names = [
    "Kolkata Hub",
    "Delhi Hub",
    "Mumbai Hub",
    "Bangalore Hub",
    "Hyderabad Hub"
]

warehouses = []

for name in warehouse_names:

    warehouse = Warehouse(
        name=name,
        location=name.split()[0],
        capacity=random.randint(500, 2000)
    )

    db.add(warehouse)
    warehouses.append(warehouse)

db.commit()

# Refresh warehouse objects to get IDs
warehouses = db.query(Warehouse).all()

# -------------------------
# CREATE PRODUCTS
# -------------------------

product_names = [
    "Laptop",
    "Keyboard",
    "Mouse",
    "Monitor",
    "Tablet",
    "Smartphone",
    "Printer",
    "Speaker",
    "Headphones",
    "Smartwatch"
]

products = []

for name in product_names:

    product = Product(
        name=name,
        category="Electronics",
        price=random.randint(1000, 80000)
    )

    db.add(product)
    products.append(product)

db.commit()

# Refresh product objects to get IDs
products = db.query(Product).all()

# -------------------------
# CREATE INVENTORY
# -------------------------

# -------------------------
# CREATE INVENTORY
# -------------------------

for product in products:

    for warehouse in warehouses:

        threshold = random.randint(10, 40)

        # Generate mostly healthy inventory
        stock = random.randint(threshold + 5, 150)

        # Occasionally create low-stock cases
        if random.random() < 0.2:
            stock = random.randint(0, threshold - 1)

        inventory = Inventory(
            product_id=product.id,
            warehouse_id=warehouse.id,
            stock=stock,
            threshold=threshold
        )

        db.add(inventory)

db.commit()


# -------------------------
# CREATE SALES DATA
# -------------------------

for product in products:

    base_sales = random.randint(10, 40)

    for day in range(30):

        sales_date = (
            datetime.now() - timedelta(days=30 - day)
        ).strftime("%Y-%m-%d")

        # Create realistic sales variation
        quantity = base_sales + random.randint(-5, 15)

        # Occasionally create spikes
        if random.random() < 0.1:
            quantity += random.randint(20, 50)

        sales = Sales(
            product_id=product.id,
            date=sales_date,
            quantity_sold=max(1, quantity)
        )

        db.add(sales)

db.commit()

print("Demo retail dataset generated successfully!")