
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from app.core.db import db
from app.models.schemas import ConnectorIn, ConnectorOut

router = APIRouter()

def _to_out(doc) -> ConnectorOut:
    return ConnectorOut(
        id=str(doc["_id"]),
        name=doc["name"],
        fetch_url=doc.get("fetch_url"),
        post_url=doc.get("post_url"),
        auth_type=doc.get("auth_type","oauth2"),
        scopes=doc.get("scopes"),
        createdAt=doc["createdAt"],
        updatedAt=doc["updatedAt"],
    )

@router.post("", response_model=ConnectorOut)
async def add_connector(connector: ConnectorIn):
    now = datetime.now(timezone.utc)
    doc = {**connector.model_dump(), "createdAt": now, "updatedAt": now}
    result = await db.connectors.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_out(doc)

@router.get("", response_model=list[ConnectorOut])
async def list_connectors():
    items = []
    async for d in db.connectors.find({}).sort("createdAt", -1):
        items.append(_to_out(d))
    return items

@router.delete("/{connector_id}")
async def delete_connector(connector_id: str):
    oid = ObjectId(connector_id)
    r = await db.connectors.delete_one({"_id": oid})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Connector not found")
    return {"ok": True}
