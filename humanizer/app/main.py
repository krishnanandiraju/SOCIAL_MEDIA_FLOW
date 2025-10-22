from fastapi import FastAPI
from .schemas import HumanizeRequest, HumanizeResponse
from .humanizer import Humanizer

app = FastAPI(title="Humanizer API", version="0.1.0")
humanizer = Humanizer()  # you can pass model_name="tuner007/pegasus_paraphrase"

@app.post("/humanize", response_model=HumanizeResponse)
def humanize(req: HumanizeRequest):
    output_text, changed, total, before, after = humanizer.humanize(
        text=req.text,
        preserve=req.preserve,
        tone=req.tone,
        creativity=req.creativity,
        change_ratio=req.change_ratio,
        max_tokens=req.max_tokens,
        lock_proper_nouns=req.lock_proper_nouns,
        seed=req.seed
    )
    return HumanizeResponse(
        output_text=output_text,
        changed_sentences=changed,
        total_sentences=total,
        readability_before=before,
        readability_after=after
    )
