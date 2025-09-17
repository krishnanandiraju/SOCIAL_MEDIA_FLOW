
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from app.core.db import db
from app.models.schemas import PostIn, PostOut
from fastapi import Body
from app.services.publisher import publish_to_platform

router = APIRouter()

def _to_out(doc) -> PostOut:
    return PostOut(
        id=str(doc["_id"]),
        content=doc["content"],
        platform=doc["platform"],
        hashtags=doc.get("hashtags",""),
        scheduledAt=doc.get("scheduledAt"),
        status=doc.get("status","draft"),
        createdAt=doc["createdAt"],
        updatedAt=doc["updatedAt"],
    )


@router.post("/recommend-platforms")
async def recommend_platforms(
    content: str = Body(..., embed=True),
    hashtags: str = Body("", embed=True)
):
    # Placeholder logic for platform recommendation
    # TODO: Replace with actual algorithm
    recommended = ["twitter", "facebook", "linkedin"]
    return {"recommended_platforms": recommended}

@router.post("", response_model=PostOut)
async def create_post(post: PostIn):
    now = datetime.now(timezone.utc)
    doc = {**post.model_dump(), "status": "draft", "createdAt": now, "updatedAt": now}
    result = await db.posts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_out(doc)

@router.get("", response_model=list[PostOut])
async def list_posts():
    items = []
    async for d in db.posts.find({}).sort("createdAt", -1):
        items.append(_to_out(d))
    return items

@router.post("/{post_id}/publish")
async def publish_post(post_id: str):
    d = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not d:
        raise HTTPException(status_code=404, detail="Post not found")

    # find a connector by name (simple mapping for now)
    connector = await db.connectors.find_one({"name": d["platform"]})
    if not connector:
        raise HTTPException(status_code=400, detail=f"No connector configured for platform '{d['platform']}'")

    res = await publish_to_platform(connector, d)

    status = "posted" if res.get("ok") else "failed"
    await db.posts.update_one({"_id": d["_id"]}, {"$set": {"status": status, "updatedAt": datetime.now(timezone.utc)}})

    return {"ok": True, "status": status, "result": res}
