from pydantic import BaseModel


# ---------- PRODUCT ----------

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float


# ---------- WAREHOUSE ----------

class WarehouseCreate(BaseModel):
    name: str
    location: str
    capacity: int


# ---------- INVENTORY ----------

class InventoryCreate(BaseModel):
    product_id: int
    warehouse_id: int
    stock: int
    threshold: int
class InventoryUpdate(BaseModel):
    stock: int
    threshold: int
# ---------- SALES ----------

class SalesCreate(BaseModel):
    product_id: int
    date: str
    quantity_sold: int
# ---------- STOCK TRANSFER ----------

class StockTransfer(BaseModel):
    product_id: int
    source_warehouse_id: int
    destination_warehouse_id: int
    quantity: int

class TrendResponse(BaseModel):
    product: str
    recent_average_sales: float
    older_average_sales: float
    growth_rate: float
    trend: str
class AnalyticsSummary(BaseModel):
    total_products: int
    total_warehouses: int
    total_inventory_units: int
    low_stock_items: int
    out_of_stock_items: int
class AnomalyResponse(BaseModel):
    product: str
    average_sales: float
    latest_sales: int
    anomaly: str
class DemandClassificationResponse(BaseModel):
    product: str
    average_sales: float
    demand_classification: str
    