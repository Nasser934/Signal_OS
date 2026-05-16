"""Signal OS Stage-1 Scoring Service (FastAPI).
Rules-only engine for explainable draft scoring.
"""
from __future__ import annotations

import re
from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Signal OS Scoring Service", version="0.1.0")


class ScoreRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    topic: Optional[str] = None
    audience: Optional[str] = None
    tone: Optional[str] = None


class ScoreComponent(BaseModel):
    name: str
    score: float
    rationale: str


class ScoreResponse(BaseModel):
    total_score: float
    explanation: str
    top_strength: str
    biggest_weakness: str
    components: List[ScoreComponent]
    rewrite_recommendations: List[str]
    rules_version: str = "ruleset-2026-05"


def _hook_strength(text: str) -> ScoreComponent:
    has_number = bool(re.search(r"\b\d+\b", text))
    has_question = "?" in text
    score = 40 + (25 if has_number else 0) + (20 if has_question else 0)
    score = min(score, 100)
    rationale = "Uses concrete pattern interrupt (numbers/questions)." if score >= 70 else "Opening is generic; add a sharper hook."
    return ScoreComponent(name="Hook strength", score=score, rationale=rationale)


def _clarity(text: str) -> ScoreComponent:
    sentence_count = max(1, len([s for s in re.split(r"[.!?]", text) if s.strip()]))
    avg_len = len(text.split()) / sentence_count
    score = 100 - min(max((avg_len - 14) * 4, 0), 60)
    rationale = "Readable sentence density." if score >= 70 else "Too dense; shorten sentences and remove filler."
    return ScoreComponent(name="Clarity", score=round(score, 2), rationale=rationale)


def _reply_trigger(text: str) -> ScoreComponent:
    cta_terms = ["agree", "disagree", "what do you think", "your take", "reply"]
    has_cta = any(term in text.lower() for term in cta_terms)
    score = 78 if has_cta else 42
    rationale = "Contains reply trigger." if has_cta else "No direct response prompt; add one question."
    return ScoreComponent(name="Reply trigger", score=score, rationale=rationale)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/v1/score", response_model=ScoreResponse)
def score_draft(payload: ScoreRequest) -> ScoreResponse:
    components = [_hook_strength(payload.text), _clarity(payload.text), _reply_trigger(payload.text)]
    total = round(sum(c.score for c in components) / len(components), 2)

    top_strength = max(components, key=lambda c: c.score).name
    biggest_weakness = min(components, key=lambda c: c.score).name

    recommendations = [
        "Start with a concrete outcome or tension in the first line.",
        "Compress wording by 15-25% to improve scan speed.",
        "End with one explicit question to trigger replies.",
    ]

    explanation = (
        f"Score {total}/100. Strongest signal: {top_strength}. "
        f"Primary weakness: {biggest_weakness}. "
        "Improve the weak signal first to increase first-hour engagement probability."
    )

    return ScoreResponse(
        total_score=total,
        explanation=explanation,
        top_strength=top_strength,
        biggest_weakness=biggest_weakness,
        components=components,
        rewrite_recommendations=recommendations,
    )
