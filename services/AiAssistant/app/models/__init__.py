from pydantic import BaseModel, Field
from typing import List, Optional


class TreatmentItem(BaseModel):
    """A single treatment recommendation with academic backing."""
    name: str = Field(..., description="Protocol or drug name")
    description: str = Field(..., description="Mechanism of action and clinical directions")
    dosage: Optional[str] = Field(None, description="Standard dosage guidelines")
    academicSources: List[str] = Field(
        ..., description="CNOM-approved clinical guidelines, journals, or reference articles"
    )


class RecommendationRequest(BaseModel):
    """Input payload for the AI recommendation endpoint."""
    patientId: str
    symptoms: str
    diagnoses: Optional[str] = ""
    history: Optional[str] = ""


class RecommendationResponse(BaseModel):
    """Structured AI recommendation output with CNDP compliance notice."""
    suggestedDiagnoses: List[str]
    suggestedTreatments: List[TreatmentItem]
    confidenceScore: float
    cndpComplianceNote: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    service: str
    version: str
