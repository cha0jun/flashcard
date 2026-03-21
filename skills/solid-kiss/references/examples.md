# SOLID + KISS Code Examples

## Table of Contents
- [SRP Examples](#srp)
- [OCP Examples](#ocp)
- [LSP Examples](#lsp)
- [ISP Examples](#isp)
- [DIP Examples](#dip)
- [KISS Examples](#kiss)
- [Refactoring Guidance](#refactoring)

---

## SRP

**BAD** — one class handles formatting AND saving:
```python
class ReportManager:
    def generate_html(self, data):
        html = "<html>..."
        return html

    def save_to_disk(self, html, path):
        with open(path, "w") as f:
            f.write(html)

    def generate_and_save(self, data, path):
        html = self.generate_html(data)
        self.save_to_disk(html, path)
```

**GOOD** — each class has one job:
```python
class HtmlReportFormatter:
    def format(self, data: ReportData) -> str:
        return "<html>..."

class ReportFileWriter:
    def write(self, content: str, path: str) -> None:
        with open(path, "w") as f:
            f.write(content)
```

---

## OCP

**BAD** — adding a format requires editing existing code:
```python
def export(data, fmt):
    if fmt == "json":
        return json.dumps(data)
    elif fmt == "csv":
        return to_csv(data)
    # every new format means editing this function
```

**GOOD** — adding a format requires only registering a new exporter:
```python
class Exporter(Protocol):
    def export(self, data: dict) -> str: ...

class JsonExporter:
    def export(self, data: dict) -> str:
        return json.dumps(data)

class CsvExporter:
    def export(self, data: dict) -> str:
        return to_csv(data)

EXPORTERS: dict[str, Exporter] = {
    "json": JsonExporter(),
    "csv": CsvExporter(),
}

def export(data: dict, fmt: str) -> str:
    return EXPORTERS[fmt].export(data)
```

---

## LSP

**BAD** — ReadOnlyFile breaks the writable contract of File:
```python
class File:
    def read(self) -> bytes: ...
    def write(self, data: bytes) -> None: ...

class ReadOnlyFile(File):
    def write(self, data: bytes) -> None:
        raise PermissionError("read-only")
```

**GOOD** — separate the contracts:
```python
class Readable(Protocol):
    def read(self) -> bytes: ...

class Writable(Protocol):
    def write(self, data: bytes) -> None: ...

class ReadOnlyFile:
    def read(self) -> bytes: ...

class ReadWriteFile:
    def read(self) -> bytes: ...
    def write(self, data: bytes) -> None: ...
```

---

## ISP

**BAD:**
```typescript
interface Worker {
  code(): void;
  test(): void;
  deployToProduction(): void;
  writeDocumentation(): void;
}
```

**GOOD:**
```typescript
interface Coder { code(): void; }
interface Tester { test(): void; }
interface Deployer { deployToProduction(): void; }
interface Documenter { writeDocumentation(): void; }

class Developer implements Coder, Tester, Documenter {
  code() { /* ... */ }
  test() { /* ... */ }
  writeDocumentation() { /* ... */ }
}
```

---

## DIP

**BAD** — high-level service directly creates low-level dependency:
```python
class OrderService:
    def __init__(self):
        self.db = PostgresDatabase()  # concrete, hard to test

    def place_order(self, order):
        self.db.insert("orders", order)
```

**GOOD** — depend on abstraction, inject the concrete:
```python
class Database(Protocol):
    def insert(self, table: str, record: dict) -> None: ...

class OrderService:
    def __init__(self, db: Database):
        self.db = db

    def place_order(self, order: dict) -> None:
        self.db.insert("orders", order)
```

---

## KISS

### Readability Over Cleverness

**BAD:**
```python
result = (lambda f: f(f))(lambda f: lambda n: 1 if n < 2 else n * f(f)(n - 1))(5)
```

**GOOD:**
```python
def factorial(n: int) -> int:
    if n < 2:
        return 1
    return n * factorial(n - 1)
```

### No Premature Abstraction

**BAD** — abstraction with only one implementor:
```python
class AbstractNotifier(ABC):
    @abstractmethod
    def notify(self, msg): ...

class EmailNotifier(AbstractNotifier):
    def notify(self, msg):
        send_email(msg)

# Only EmailNotifier exists. The ABC adds nothing.
```

**GOOD** — just use the concrete class until you need a second notifier:
```python
class EmailNotifier:
    def notify(self, msg: str) -> None:
        send_email(msg)
```

### Flat Over Nested

**BAD:**
```python
def process(items):
    results = []
    for item in items:
        if item.is_valid():
            if item.has_permission():
                if not item.is_duplicate():
                    results.append(transform(item))
    return results
```

**GOOD:**
```python
def process(items):
    return [transform(item) for item in items if _should_process(item)]

def _should_process(item) -> bool:
    return item.is_valid() and item.has_permission() and not item.is_duplicate()
```

---

## Refactoring

When refactoring existing code:

1. Identify the worst violation first (usually SRP or deep nesting).
2. Fix one principle at a time. Do not refactor everything at once.
3. Preserve external behavior — refactoring must not change what the code does.
4. Add or update tests before restructuring, so regressions are caught.
5. Explain each refactoring step: state the principle violated, show the before
   shape, and describe the after shape.
