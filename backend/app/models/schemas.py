
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Literal, List
from datetime import datetime

class PostIn(BaseModel):
    content: str = Field(..., min_length=1)
    platform: Literal['twitter','linkedin','instagram','wordpress','medium'] = 'twitter'
    hashtags: Optional[str] = ""
    scheduledAt: Optional[datetime] = None

class PostOut(PostIn):
    id: str
    status: Literal['draft','scheduled','posted','failed'] = 'draft'
    createdAt: datetime
    updatedAt: datetime

class ConnectorIn(BaseModel):
    name: str = Field(..., min_length=2)
    fetch_url: Optional[HttpUrl] = None
    post_url: Optional[HttpUrl] = None
    auth_type: Literal['oauth2','token','none'] = 'oauth2'
    scopes: Optional[List[str]] = None

class ConnectorOut(ConnectorIn):
    id: str
    createdAt: datetime
    updatedAt: datetime
