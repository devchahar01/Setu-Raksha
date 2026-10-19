from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., examples=["officer.pune@seturaksha.gov.in"])
    password: str = Field(..., min_length=6, examples=["Pass1234#Secure"])


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=6)
    role: str = "PROJECT_OFFICER"
    jurisdiction_id: str | None = None
    locale: str = "en"


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    jurisdiction_id: str | None = None
    locale: str
    channels: str
    is_active: bool

    class Config:
        from_attributes = True
