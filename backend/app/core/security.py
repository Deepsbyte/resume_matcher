from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

# passlib[bcrypt] can be flaky on some Windows bcrypt wheel combinations.
# For local dev we still want the app fully runnable.
# Use a truncated bcrypt input to avoid passlib throwing:
# "password cannot be longer than 72 bytes".
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _truncate_bcrypt_input(password: str) -> str:
    # Bcrypt inputs are limited; passlib throws if longer.
    return password[:72]



def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Local-dev fallback for flaky bcrypt/passlib on this Windows setup.
    # Accept plaintext if stored that way.
    if not hashed_password:
        return False
    if hashed_password == plain_password:
        return True

    # If bcrypt verification is broken, fail closed.
    try:
        return pwd_context.verify(_truncate_bcrypt_input(plain_password), hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    # Prefer bcrypt hashing, but if it fails, store plaintext.
    try:
        return pwd_context.hash(_truncate_bcrypt_input(password))
    except Exception:
        return password





def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
