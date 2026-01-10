from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./tech_vocab.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database with sample data"""
    from models import User, Term
    # UserScore
    from auth_utils import get_password_hash
    
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if admin exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        # Create admin user
        admin = User(
            username="admin",
            email="admin@techvocab.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin)
        
        # Create sample user
        user = User(
            username="user",
            email="user@techvocab.com",
            hashed_password=get_password_hash("user123"),
            is_admin=False
        )
        db.add(user)
        
        # Add sample terms
        sample_terms = [
            {
                "term": "API",
                "definition": "Application Programming Interface - A set of rules and protocols that allows different software applications to communicate with each other",
                "example": "fetch('https://api.example.com/users').then(res => res.json())",
                "real_world": "Twitter API allows developers to post tweets, read timelines, and access user data programmatically",
                "difficulty": "easy"
            },
            {
                "term": "JWT",
                "definition": "JSON Web Token - A compact, URL-safe token format used for securely transmitting information between parties as a JSON object",
                "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U",
                "real_world": "Used in authentication systems where after login, the server generates a JWT that the client stores and sends with each request",
                "difficulty": "medium"
            },
            {
                "term": "Docker",
                "definition": "A platform that uses containerization to package applications and their dependencies into standardized units for development and deployment",
                "example": "docker run -p 8080:80 nginx",
                "real_world": "Companies use Docker to ensure applications run consistently across development, testing, and production environments",
                "difficulty": "medium"
            },
            {
                "term": "REST",
                "definition": "Representational State Transfer - An architectural style for designing networked applications using stateless HTTP requests",
                "example": "GET /api/users/123\nPOST /api/users\nPUT /api/users/123\nDELETE /api/users/123",
                "real_world": "Most modern web APIs follow REST principles, using HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations",
                "difficulty": "easy"
            },
            {
                "term": "Git",
                "definition": "A distributed version control system that tracks changes in source code during software development",
                "example": "git add .\ngit commit -m 'Add new feature'\ngit push origin main",
                "real_world": "Teams use Git and platforms like GitHub to collaborate on code, manage versions, and review changes before merging",
                "difficulty": "easy"
            },
            {
                "term": "CI/CD",
                "definition": "Continuous Integration/Continuous Deployment - Practices that automate the integration of code changes and deployment to production",
                "example": "# .github/workflows/deploy.yml\non: push\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - run: npm test\n      - run: npm run deploy",
                "real_world": "When developers push code to GitHub, automated tests run, and if they pass, the code is automatically deployed to production",
                "difficulty": "hard"
            },
            {
                "term": "ORM",
                "definition": "Object-Relational Mapping - A technique that converts data between incompatible type systems using object-oriented programming languages",
                "example": "user = User.objects.get(id=1)\nuser.name = 'John'\nuser.save()",
                "real_world": "Instead of writing SQL queries, developers use ORM like SQLAlchemy or Django ORM to interact with databases using Python objects",
                "difficulty": "medium"
            },
            {
                "term": "Webhook",
                "definition": "A method of augmenting or altering web page behavior with custom callbacks triggered by events on another system",
                "example": "POST https://your-app.com/webhook\n{\n  \"event\": \"payment.success\",\n  \"amount\": 99.99\n}",
                "real_world": "Payment gateways like Stripe send webhooks to notify your application when a payment succeeds or fails",
                "difficulty": "medium"
            },
            {
                "term": "Microservices",
                "definition": "An architectural style that structures an application as a collection of loosely coupled, independently deployable services",
                "example": "User Service (port 3001)\nPayment Service (port 3002)\nInventory Service (port 3003)\nAPI Gateway (port 3000)",
                "real_world": "Netflix uses microservices where different teams manage services like recommendations, streaming, user profiles independently",
                "difficulty": "hard"
            },
            {
                "term": "GraphQL",
                "definition": "A query language for APIs that allows clients to request exactly the data they need in a single request",
                "example": "query {\n  user(id: \"123\") {\n    name\n    email\n    posts {\n      title\n    }\n  }\n}",
                "real_world": "Facebook developed GraphQL to efficiently fetch data for mobile apps, reducing the number of API calls needed",
                "difficulty": "hard"
            },
            {
                "term": "Kubernetes",
                "definition": "An open-source container orchestration platform for automating deployment, scaling, and management of containerized applications",
                "example": "kubectl apply -f deployment.yaml\nkubectl scale deployment myapp --replicas=5",
                "real_world": "Companies use Kubernetes to automatically manage thousands of Docker containers, handling scaling and recovery automatically",
                "difficulty": "hard"
            },
            {
                "term": "Redis",
                "definition": "An in-memory data structure store used as a database, cache, and message broker, known for high performance",
                "example": "redis.set('user:1000', 'John')\nvalue = redis.get('user:1000')\nredis.expire('user:1000', 3600)",
                "real_world": "E-commerce sites use Redis to cache product details and shopping cart data for faster page loads",
                "difficulty": "medium"
            }
        ]
        
        for term_data in sample_terms:
            term = Term(**term_data)
            db.add(term)
        
        db.commit()
        print("✅ Database initialized with admin, user, and sample terms")
        print("📝 Admin credentials - username: admin, password: admin123")
        print("📝 User credentials - username: user, password: user123")
    
    db.close()