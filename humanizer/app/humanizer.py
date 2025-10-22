import random, re
from typing import List, Tuple
import spacy
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import textstat

# Default models known to paraphrase well; you can swap freely.
DEFAULT_MODELS = [
    "Vamsi/T5_Paraphrase_Paws",                # small, fast T5
    "ramsrigouthamg/t5_paraphraser",           # classic t5 paraphraser
    "tuner007/pegasus_paraphrase"              # pegasus paraphrase
]

DISCOURSE_MARKERS = {
    "neutral": ["Additionally", "In short", "Overall", "That said"],
    "friendly": ["Plus", "Here’s the thing", "All in all", "On that note"],
    "confident": ["Crucially", "In practice", "Net-net", "Bottom line"]
}

class Humanizer:
    def __init__(self, model_name: str | None = None, device: str | None = None):
        self.model_name = model_name or DEFAULT_MODELS[0]
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.nlp = spacy.load("en_core_web_sm")  # sentence split + NER

    def _split_sentences(self, text: str) -> List[str]:
        doc = self.nlp(text)
        return [s.text.strip() for s in doc.sents if s.text.strip()]

    def _collect_proper_nouns(self, text: str) -> List[str]:
        doc = self.nlp(text)
        ents = {ent.text for ent in doc.ents if ent.label_ in {"PERSON","ORG","PRODUCT","GPE"}}
        # Filter out trivial one-letter tokens
        return [e for e in ents if re.search(r"[A-Za-z]", e)]

    def _mask_tokens(self, s: str, phrases: List[str]) -> Tuple[str, List[Tuple[str,str]]]:
        """
        Mask preserve phrases so the generator doesn't rewrite them.
        Returns masked sentence + mapping for unmasking.
        """
        mapping = []
        masked = s
        for i, p in enumerate(sorted(phrases, key=len, reverse=True)):
            if p and p.lower() in s.lower():
                token = f"<<<KEEP_{i}>>>"
                # case-insensitive replace preserving original case
                masked = re.sub(re.escape(p), token, masked, flags=re.IGNORECASE)
                mapping.append((token, p))
        return masked, mapping

    def _unmask_tokens(self, s: str, mapping: List[Tuple[str,str]]) -> str:
        for token, phrase in mapping:
            s = s.replace(token, phrase)
        return s

    def _gen(self, prompt: str, max_tokens: int, temperature: float, top_p: float, seed: int | None):
        if seed is not None:
            torch.manual_seed(seed)
            random.seed(seed)
        inputs = self.tokenizer([prompt], return_tensors="pt", truncation=True).to(self.device)
        out = self.model.generate(
            **inputs,
            do_sample=True,
            max_new_tokens=max_tokens,
            temperature=max(0.3, temperature),  # keep in sane bounds
            top_p=min(0.95, max(0.5, top_p)),
            num_return_sequences=1,
            repetition_penalty=1.15
        )
        return self.tokenizer.decode(out[0], skip_special_tokens=True)

    def _rewrite_sentence(self, s: str, tone: str, creativity: float,
                          max_tokens: int, preserve: List[str], seed: int | None) -> str:
        masked, mapping = self._mask_tokens(s, preserve)
        # Lite prompt to steer tone without hallucinating
        system = {
            "neutral": "Paraphrase in clear, natural English.",
            "friendly": "Paraphrase in warm, conversational English.",
            "confident": "Paraphrase in concise, assertive business English."
        }[tone]
        prompt = f"{system}\n\nSentence: {masked}\nRewritten:"
        out = self._gen(prompt, max_tokens=max_tokens, temperature=0.5+0.5*creativity,
                        top_p=0.8+0.15*creativity, seed=seed)
        return self._unmask_tokens(out, mapping)

    def _insert_discourse_markers(self, sentences: List[str], tone: str) -> List[str]:
        # Insert a marker before some mid/long sentences to add “human” flow
        marks = DISCOURSE_MARKERS[tone]
        result = []
        for i, s in enumerate(sentences):
            if i>0 and len(s.split())>=14 and random.random()<0.2:
                result.append(f"{random.choice(marks)} — {s}")
            else:
                result.append(s)
        return result

    def _readability(self, text: str) -> float:
        # Flesch Reading Ease (higher = easier)
        try:
            return float(textstat.flesch_reading_ease(text))
        except Exception:
            return 0.0

    def humanize(self, text: str, preserve: List[str], tone: str,
                 creativity: float, change_ratio: float,
                 max_tokens: int, lock_proper_nouns: bool, seed: int | None):
        preserve = [p for p in (preserve or []) if p.strip()]
        sentences = self._split_sentences(text)

        # Lock named entities if requested
        if lock_proper_nouns:
            preserve = sorted(set(preserve + self._collect_proper_nouns(text)), key=len, reverse=True)

        before = self._readability(text)

        changed = 0
        out_sentences = []
        for s in sentences:
            if random.random() < change_ratio and len(s.split()) > 4:
                try:
                    new_s = self._rewrite_sentence(s, tone, creativity, max_tokens, preserve, seed)
                    if new_s and new_s.strip() and new_s.strip() != s.strip():
                        changed += 1
                        out_sentences.append(new_s.strip())
                        continue
                except Exception:
                    pass
            out_sentences.append(s)

        out_sentences = self._insert_discourse_markers(out_sentences, tone)

        output_text = self._postprocess(" ".join(out_sentences))
        after = self._readability(output_text)
        return output_text, changed, len(sentences), before, after

    def _postprocess(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"\s+([,.;:?!])", r"\1", text)
        return text.strip()
