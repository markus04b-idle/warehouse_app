CREATE TABLE IF NOT EXISTS inventory (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sku         TEXT    NOT NULL UNIQUE,
    name        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    quantity    INTEGER NOT NULL DEFAULT 0,
    unit_price  REAL    NOT NULL
);
