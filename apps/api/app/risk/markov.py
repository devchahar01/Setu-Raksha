"""
Setu Raksha - Markov-Chain Remaining Useful Life (RUL) Engine (Phase 5)
Computes probabilistic life expectancy across structural condition states:
State 1: Good (0-29 DRI)
State 2: Watch (30-54 DRI)
State 3: Warning (55-74 DRI)
State 4: Critical (75-100 DRI, absorbing state)
"""
from typing import Tuple


class MarkovRULEngine:
    """Predicts years remaining until structural criticality using stochastic transition matrices."""

    # Inland Basin Baseline (Mula-Mutha, Bhima, Krishna, Godavari)
    INLAND_MATRIX = [
        [0.92, 0.08, 0.00],  # State 1 -> State 1, 2, 3
        [0.00, 0.88, 0.12],  # State 2 -> State 2, 3
        [0.00, 0.00, 0.82],  # State 3 -> State 3
    ]

    # Coastal / Marine Basin (Konkan / High Chloride / Humidity)
    COASTAL_MATRIX = [
        [0.85, 0.15, 0.00],
        [0.00, 0.80, 0.20],
        [0.00, 0.00, 0.70],
    ]

    @classmethod
    def estimate_rul(cls, current_dri: float, district: str = "Pune", year_built: int = 1995) -> Tuple[float, str]:
        """
        Calculates expected RUL in years from current state until State 4 (Critical).
        Returns (rul_years, degradation_regime).
        """
        is_coastal = any(c in district.lower() for c in ["konkan", "ratnagiri", "raigad", "sindhudurg", "mumbai", "thane"])
        Q = cls.COASTAL_MATRIX if is_coastal else cls.INLAND_MATRIX
        regime = "Coastal-Accelerated" if is_coastal else "Inland-Standard"

        # Expected years in each transient state: E[time in state i] = 1 / (1 - P_ii)
        e_time_1 = 1.0 / (1.0 - Q[0][0])  # ~12.5 years inland, ~6.67 coastal
        e_time_2 = 1.0 / (1.0 - Q[1][1])  # ~8.33 years inland, ~5.00 coastal
        e_time_3 = 1.0 / (1.0 - Q[2][2])  # ~5.55 years inland, ~3.33 coastal

        if current_dri < 30.0:
            # Good tier: passes through State 1, 2, 3
            # Fraction within state 1
            ratio = current_dri / 30.0
            rul = (1.0 - ratio) * e_time_1 + e_time_2 + e_time_3
        elif current_dri < 55.0:
            # Watch tier: passes through State 2, 3
            ratio = (current_dri - 30.0) / 25.0
            rul = (1.0 - ratio) * e_time_2 + e_time_3
        elif current_dri < 75.0:
            # Warning tier: remaining in State 3
            ratio = (current_dri - 55.0) / 20.0
            rul = max(0.5, (1.0 - ratio) * e_time_3)
        else:
            # Critical tier: already reached failure threshold
            rul = 0.0

        return round(rul, 1), regime
