from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .core import settings
from .models import (
    RecommendationRequest,
    RecommendationResponse,
    HealthResponse,
)
from .services import search_guidelines

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Compliant medical decision support engine for Moroccan doctors. "
        "Cites verified clinical guidelines (CNOM, OMS, Ministère de la Santé)."
    ),
    version=settings.APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse)
def health_check():
    """Service health check endpoint."""
    return HealthResponse(
        status="healthy",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
    )


@app.post("/api/recommend", response_model=RecommendationResponse)
async def generate_recommendation(payload: RecommendationRequest):
    """
    Analyse patient symptoms against the clinical knowledge base
    and return evidence-based diagnostic and treatment suggestions.

    Every recommendation includes academic source citations
    to comply with CNOM (Ordre des Médecins) requirements.
    """
    if not payload.symptoms.strip():
        raise HTTPException(
            status_code=400,
            detail="Patient symptoms must be provided for AI analysis.",
        )

    result = search_guidelines(payload.symptoms)

    return RecommendationResponse(
        suggestedDiagnoses=result["diagnoses"],
        suggestedTreatments=result["treatments"],
        confidenceScore=result["confidence"],
        cndpComplianceNote=(
            "Avis consultatif uniquement. La décision thérapeutique finale "
            "appartient au médecin traitant, conformément à la Loi 131-13 "
            "et aux obligations déontologiques de l'Ordre des Médecins (CNOM)."
        ),
    )
