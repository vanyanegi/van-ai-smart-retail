from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sklearn.ensemble import RandomForestClassifier
from database import SessionLocal, engine
from models import Base, Product, Warehouse, Inventory, Sales
from forecast import predict_demand
import schemas

app = FastAPI()

Base.metadata.create_all(bind=engine)


# ---------- DATABASE SESSION ----------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- ROOT ----------

@app.get("/")
def root():
    return {"message": "Retail Intelligence API Running"}


# ---------- ADD PRODUCT ----------

@app.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):

    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# ---------- ADD WAREHOUSE ----------

@app.post("/warehouses")
def create_warehouse(
    warehouse: schemas.WarehouseCreate,
    db: Session = Depends(get_db)
):

    new_warehouse = Warehouse(
        name=warehouse.name,
        location=warehouse.location,
        capacity=warehouse.capacity
    )

    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)

    return new_warehouse


# ---------- ADD INVENTORY ----------

@app.post("/inventory")
def create_inventory(
    inventory: schemas.InventoryCreate,
    db: Session = Depends(get_db)
):

    new_inventory = Inventory(
        product_id=inventory.product_id,
        warehouse_id=inventory.warehouse_id,
        stock=inventory.stock,
        threshold=inventory.threshold
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)

    return new_inventory


# ---------- UPDATE INVENTORY ----------

@app.put("/inventory/{inventory_id}")
def update_inventory(
    inventory_id: int,
    updated_inventory: schemas.InventoryUpdate,
    db: Session = Depends(get_db)
):

    inventory_item = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory_item:
        return {"error": "Inventory item not found"}

    inventory_item.stock = updated_inventory.stock
    inventory_item.threshold = updated_inventory.threshold

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


# ---------- GET INVENTORY ----------

@app.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):

    inventory_data = (
        db.query(
            Inventory.id,
            Product.name.label("product"),
            Warehouse.name.label("warehouse"),
            Inventory.stock,
            Inventory.threshold
        )
        .join(Product, Inventory.product_id == Product.id)
        .join(Warehouse, Inventory.warehouse_id == Warehouse.id)
        .all()
    )

    result = []

    for item in inventory_data:
        result.append({
            "inventory_id": item.id,
            "product": item.product,
            "warehouse": item.warehouse,
            "stock": item.stock,
            "threshold": item.threshold
        })

    return result


# ---------- LOW STOCK ALERTS ----------

# ---------- LOW STOCK ALERTS ----------

@app.get("/alerts")
def low_stock_alerts(db: Session = Depends(get_db)):

    alert_data = (
        db.query(
            Inventory.id,
            Product.name.label("product"),
            Warehouse.name.label("warehouse"),
            Inventory.stock,
            Inventory.threshold
        )
        .join(Product, Inventory.product_id == Product.id)
        .join(Warehouse, Inventory.warehouse_id == Warehouse.id)
        .filter(Inventory.stock < Inventory.threshold)
        .all()
    )

    alerts = []

    for item in alert_data:

        # Dynamic alert levels
        if item.stock == 0:
            alert_type = "OUT OF STOCK"

        elif item.stock < item.threshold * 0.5:
            alert_type = "CRITICAL LOW STOCK"

        else:
            alert_type = "RESTOCK REQUIRED"

        alerts.append({
            "inventory_id": item.id,
            "product": item.product,
            "warehouse": item.warehouse,
            "stock": item.stock,
            "threshold": item.threshold,
            "alert": alert_type
        })

    return alerts

# ---------- DEMAND FORECAST ----------

@app.get("/forecast/{product_id}")
def forecast(product_id: int, db: Session = Depends(get_db)):

    sales_records = (
        db.query(Sales)
        .filter(Sales.product_id == product_id)
        .all()
    )

    if not sales_records:
        return {"error": "No sales data found"}

    sales_data = [sale.quantity_sold for sale in sales_records]

    prediction = predict_demand(sales_data)

    return {
        "product_id": product_id,
        "historical_sales": sales_data,
        "predicted_next_day_demand": prediction
    }


# ---------- ADD SALES DATA ----------

@app.post("/sales")
def create_sales(
    sales: schemas.SalesCreate,
    db: Session = Depends(get_db)
):

    new_sale = Sales(
        product_id=sales.product_id,
        date=sales.date,
        quantity_sold=sales.quantity_sold
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return new_sale


# ---------- STOCK TRANSFER ----------

@app.post("/transfer-stock")
def transfer_stock(
    transfer: schemas.StockTransfer,
    db: Session = Depends(get_db)
):

    # Find source inventory
    source_inventory = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == transfer.product_id,
            Inventory.warehouse_id == transfer.source_warehouse_id
        )
        .first()
    )

    if not source_inventory:
        return {"error": "Source inventory not found"}

    # Check stock availability
    if source_inventory.stock < transfer.quantity:
        return {"error": "Insufficient stock in source warehouse"}

    # Find destination inventory
    destination_inventory = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == transfer.product_id,
            Inventory.warehouse_id == transfer.destination_warehouse_id
        )
        .first()
    )

    # Reduce source stock
    source_inventory.stock -= transfer.quantity

    # If destination inventory exists → increase stock
    if destination_inventory:
        destination_inventory.stock += transfer.quantity

    # Else create new inventory record
    else:
        destination_inventory = Inventory(
            product_id=transfer.product_id,
            warehouse_id=transfer.destination_warehouse_id,
            stock=transfer.quantity,
            threshold=20
        )

        db.add(destination_inventory)

    db.commit()

    return {
        "message": "Stock transferred successfully",
        "product_id": transfer.product_id,
        "transferred_quantity": transfer.quantity,
        "source_warehouse": transfer.source_warehouse_id,
        "destination_warehouse": transfer.destination_warehouse_id
    }


# ---------- SALES TRENDS ----------

@app.get("/trends/{product_id}", response_model=schemas.TrendResponse)
def get_trend(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    sales = db.query(Sales).filter(
        Sales.product_id == product_id
    ).all()

    if len(sales) < 6:
        raise HTTPException(
            status_code=400,
            detail="Not enough sales data"
        )

    quantities = [sale.quantity_sold for sale in sales]

    midpoint = len(quantities) // 2

    older_sales = quantities[:midpoint]
    recent_sales = quantities[midpoint:]

    older_avg = sum(older_sales) / len(older_sales)
    recent_avg = sum(recent_sales) / len(recent_sales)

    growth_rate = ((recent_avg - older_avg) / older_avg) * 100

    if growth_rate > 10:
        trend = "RISING DEMAND"
    elif growth_rate < -10:
        trend = "DECLINING"
    else:
        trend = "STABLE"

    return {
        "product": product.name,
        "recent_average_sales": round(recent_avg, 2),
        "older_average_sales": round(older_avg, 2),
        "growth_rate": round(growth_rate, 2),
        "trend": trend
    }
@app.get("/analytics/summary", response_model=schemas.AnalyticsSummary)
def analytics_summary(db: Session = Depends(get_db)):

    total_products = db.query(Product).count()

    total_warehouses = db.query(Warehouse).count()

    inventory_items = db.query(Inventory).all()

    total_inventory_units = sum(
        item.stock for item in inventory_items
    )

    low_stock_items = sum(
        1 for item in inventory_items
        if item.stock < item.threshold
    )

    out_of_stock_items = sum(
        1 for item in inventory_items
        if item.stock == 0
    )

    return {
        "total_products": total_products,
        "total_warehouses": total_warehouses,
        "total_inventory_units": total_inventory_units,
        "low_stock_items": low_stock_items,
        "out_of_stock_items": out_of_stock_items
    }
@app.get("/anomalies/{product_id}", response_model=schemas.AnomalyResponse)
def detect_anomaly(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    sales = db.query(Sales).filter(
        Sales.product_id == product_id
    ).all()

    if len(sales) < 2:
        raise HTTPException(
            status_code=400,
            detail="Not enough sales data"
        )

    quantities = [sale.quantity_sold for sale in sales]

    avg_sales = sum(quantities[:-1]) / len(quantities[:-1])

    latest_sales = quantities[-1]

    if latest_sales > avg_sales * 2:
        anomaly = "UNUSUAL DEMAND SPIKE"

    elif latest_sales < avg_sales * 0.5:
        anomaly = "UNUSUAL DEMAND DROP"

    else:
        anomaly = "NORMAL"

    return {
        "product": product.name,
        "average_sales": round(avg_sales, 2),
        "latest_sales": latest_sales,
        "anomaly": anomaly
    }
@app.get(
    "/demand-classification/{product_id}",
    response_model=schemas.DemandClassificationResponse
)
def classify_demand(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # -----------------------------
    # BUILD TRAINING DATA
    # -----------------------------

    all_products = db.query(Product).all()

    X = []
    y = []

    for p in all_products:

        sales = db.query(Sales).filter(
            Sales.product_id == p.id
        ).all()

        if len(sales) == 0:
            continue

        avg_sales = sum(
            sale.quantity_sold for sale in sales
        ) / len(sales)

        X.append([avg_sales])

        # Dynamic labeling
        if avg_sales < 20:
            y.append("LOW DEMAND")

        elif avg_sales < 35:
            y.append("MEDIUM DEMAND")

        else:
            y.append("HIGH DEMAND")

    # -----------------------------
    # TRAIN MODEL
    # -----------------------------

    model = RandomForestClassifier()

    model.fit(X, y)

    # -----------------------------
    # PREDICT TARGET PRODUCT
    # -----------------------------

    target_sales = db.query(Sales).filter(
        Sales.product_id == product_id
    ).all()

    avg_target_sales = sum(
        sale.quantity_sold for sale in target_sales
    ) / len(target_sales)

    prediction = model.predict(
        [[avg_target_sales]]
    )[0]

    return {
        "product": product.name,
        "average_sales": round(avg_target_sales, 2),
        "demand_classification": prediction
    }