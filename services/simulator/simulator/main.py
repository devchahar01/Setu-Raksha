"""
Setu Raksha - Telemetry & Scenario Simulator Skeleton (Phase 0)
Ready for Phase 4 scenario engine and IoT ingestion pipeline.
"""
import asyncio
import logging
import os
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("setu.simulator")


async def run_simulator() -> None:
    api_url = os.getenv("API_URL", "http://localhost:8000/api/v1")
    logger.info(f"Simulator initialized. Target API: {api_url}")
    logger.info("Simulator ready for Phase 4 IoT scenarios (Monsoon Night, Schoharie Creek scour, etc.)")


def main() -> None:
    try:
        asyncio.run(run_simulator())
    except KeyboardInterrupt:
        logger.info("Simulator stopped by user.")
        sys.exit(0)


if __name__ == "__main__":
    main()
