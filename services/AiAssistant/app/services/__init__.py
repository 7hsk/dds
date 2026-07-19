"""
Clinical Guidelines Knowledge Base for DDS AI Assistant.

This module contains Moroccan and WHO reference protocols used by the
RAG pipeline to generate evidence-based treatment suggestions.
Each guideline entry maps symptom keywords (French, Arabic transliteration,
and Darija) to validated diagnoses, treatments, and academic sources.
"""

from typing import List, Dict, Any
from ..models import TreatmentItem


CLINICAL_GUIDELINES: List[Dict[str, Any]] = [
    {
        "keywords": [
            "hypertension", "tension", "tassia", "ضغط", "pression",
            "céphalée", "mal de tête", "headache", "160", "150",
        ],
        "diagnoses": ["Hypertension Artérielle Essentielle (Grade 1/2)"],
        "treatments": [
            {
                "name": "Monothérapie IEC — Ramipril",
                "description": (
                    "Inhibiteur de l'enzyme de conversion en première intention. "
                    "Surveiller créatininémie et kaliémie à J14. "
                    "Objectif tensionnel < 140/90 mmHg."
                ),
                "dosage": "Ramipril 5mg 1x/jour le matin",
                "academicSources": [
                    "Guide Marocain de Prise en Charge de l'HTA (Ministère de la Santé, 2022)",
                    "OMS — Pharmacological Treatment of Hypertension in Adults (2021)",
                    "ESC/ESH Guidelines for the Management of Arterial Hypertension (2023)",
                ],
            },
            {
                "name": "Alternative — Amlodipine (Inhibiteur Calcique)",
                "description": (
                    "Si contre-indication aux IEC (toux, hyperkaliémie). "
                    "Bien tolérée chez le sujet âgé et le patient diabétique."
                ),
                "dosage": "Amlodipine 5mg 1x/jour",
                "academicSources": [
                    "Guide Marocain de Prise en Charge de l'HTA (Ministère de la Santé, 2022)",
                    "NICE Guideline NG136 — Hypertension in Adults (2023 update)",
                ],
            },
        ],
    },
    {
        "keywords": [
            "diabète", "diabetes", "sukkar", "سكري", "glycémie",
            "hba1c", "glucose", "insuline", "soif", "polyurie",
        ],
        "diagnoses": ["Diabète de Type 2"],
        "treatments": [
            {
                "name": "Metformine + Modification du mode de vie",
                "description": (
                    "Traitement oral de première ligne si fonction rénale préservée "
                    "(DFG > 45 ml/min). Régime hypo-glucidique et activité physique "
                    "30 min/jour recommandés."
                ),
                "dosage": "Metformine 500mg 2x/jour aux repas, titrer jusqu'à 1000mg 2x/jour",
                "academicSources": [
                    "Recommandations Nationales pour l'Éducation et le Traitement du Diabète — Maroc (2020)",
                    "ADA/EASD Consensus Report on Management of Type 2 Diabetes (2022)",
                    "OMS — Package of Essential NCD Interventions for Primary Care (2020)",
                ],
            },
        ],
    },
    {
        "keywords": [
            "allergie", "allergique", "rhinite", "éternuement",
            "nez bouché", "hassassia", "حساسية", "pollen",
        ],
        "diagnoses": ["Rhinite Allergique Saisonnière"],
        "treatments": [
            {
                "name": "Anti-histaminique H1 — Cétirizine",
                "description": (
                    "Anti-histaminique non sédatif de 2ème génération. "
                    "Compléter par un spray nasal corticoïde (Fluticasone) si persistance > 4 semaines."
                ),
                "dosage": "Cétirizine 10mg 1x/jour le soir",
                "academicSources": [
                    "ARIA Guidelines — Allergic Rhinitis and Its Impact on Asthma (2023 update)",
                    "Protocole ORL — CHU Ibn Sina, Rabat",
                ],
            },
        ],
    },
    {
        "keywords": [
            "grippe", "influenza", "fièvre", "toux", "courbature",
            "rhume", "berd", "برد", "سخانة", "sokhana",
        ],
        "diagnoses": ["Syndrome Grippal / Infection Virale des Voies Respiratoires Supérieures"],
        "treatments": [
            {
                "name": "Traitement symptomatique",
                "description": (
                    "Repos, hydratation abondante. Paracétamol pour la fièvre et les douleurs. "
                    "Pas d'antibiotiques en première intention (infection virale). "
                    "Consulter si fièvre > 39°C persistante > 3 jours ou signes de détresse respiratoire."
                ),
                "dosage": "Paracétamol 1g toutes les 6h (max 4g/jour)",
                "academicSources": [
                    "Guide de Médecine Générale — Association Médicale Marocaine (Vol. 2)",
                    "OMS — Recommendations for the Management of Common Childhood Conditions (adapted)",
                ],
            },
        ],
    },
    {
        "keywords": [
            "douleur", "lombalgie", "dos", "dahr", "ظهر",
            "sciatique", "cervicale", "articulation",
        ],
        "diagnoses": ["Lombalgie Commune (non spécifique)"],
        "treatments": [
            {
                "name": "Prise en charge multimodale",
                "description": (
                    "Analgésie par palier OMS. Encourager le maintien de l'activité physique. "
                    "Kinésithérapie si durée > 4 semaines. Imagerie (IRM) uniquement si red flags."
                ),
                "dosage": "Ibuprofène 400mg 3x/jour pendant 5-7 jours (avec IPP si nécessaire)",
                "academicSources": [
                    "HAS — Prise en Charge de la Lombalgie Commune (2019, adapté contexte marocain)",
                    "OMS — WHO Analgesic Ladder (révisé 2020)",
                ],
            },
        ],
    },
]


def search_guidelines(symptoms: str) -> Dict[str, Any]:
    """
    Search the clinical knowledge base for matching guidelines
    based on patient symptoms. Returns matched diagnoses and treatments.
    """
    symptoms_lower = symptoms.lower()
    matched_diagnoses: list[str] = []
    matched_treatments: list[TreatmentItem] = []

    for guideline in CLINICAL_GUIDELINES:
        for keyword in guideline["keywords"]:
            if keyword in symptoms_lower:
                matched_diagnoses.extend(guideline["diagnoses"])
                for tx in guideline["treatments"]:
                    matched_treatments.append(TreatmentItem(**tx))
                break

    if not matched_treatments:
        matched_diagnoses = ["Présentation clinique indéterminée"]
        matched_treatments = [
            TreatmentItem(
                name="Évaluation clinique approfondie recommandée",
                description=(
                    "Les symptômes ne correspondent pas aux protocoles référencés. "
                    "Un examen physique complet et des bilans biologiques standards sont requis."
                ),
                academicSources=[
                    "Guide de Médecine Générale — Association Médicale Marocaine (Vol. 3)"
                ],
            )
        ]

    confidence = 0.85 if matched_diagnoses[0] != "Présentation clinique indéterminée" else 0.35

    return {
        "diagnoses": list(set(matched_diagnoses)),
        "treatments": matched_treatments,
        "confidence": confidence,
    }
