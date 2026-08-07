from app.auth.password import hash_password
from app.database.session import SessionLocal
from app.enums.user_roles import UserRoles
from app.users.models import User


def seed():
    db = SessionLocal()
    try:
        demo_email = "demo@sounddesk.dev"
        existing_user = db.query(User).filter(User.email == demo_email).first()

        if existing_user:
            print("Demo user already exists")
            return

        demo_user = User(
            username="Demo User",
            display_name="Demo User",
            email=demo_email,
            password_hash=hash_password("demo123"),
            email_verified=True,
            is_active=True,
            role=UserRoles.USER,
        )

        db.add(demo_user)
        db.commit()
        print("Demo user created")

    except Exception as e:
        db.rollback()
        print(e)
    finally:
        db.close()

    if __name__ == "__main__":
        seed()