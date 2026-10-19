import asyncio
import logging
from datetime import UTC, datetime, timedelta

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.models import (
    Bridge,
    BridgeAssignment,
    Contractor,
    LoadTest,
    MaterialLog,
    Organization,
    User,
    UserRole,
)
from app.db.session import AsyncSessionLocal, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("setu.seed")

DEFAULT_PASSWORD = "Password@123"


async def init_tables() -> None:
    """Create tables if they don't exist yet."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def seed_database() -> None:
    await init_tables()
    async with AsyncSessionLocal() as session:
        logger.info("Seeding Maharashtra jurisdictions...")
        # 1. State
        mh_state = Organization(name="Maharashtra Public Works Department", type="STATE")
        session.add(mh_state)
        await session.flush()

        # 2. Divisions
        div_pune = Organization(
            name="Pune Division (Desh & Western Ghats)", type="DIVISION", parent_id=mh_state.id
        )
        div_konkan = Organization(
            name="Konkan Coastal Division", type="DIVISION", parent_id=mh_state.id
        )
        div_nashik = Organization(
            name="Nashik Godavari Basin Division", type="DIVISION", parent_id=mh_state.id
        )
        session.add_all([div_pune, div_konkan, div_nashik])
        await session.flush()

        logger.info("Seeding users (Admin, Division Engineers, Project Officers)...")
        password_hash = get_password_hash(DEFAULT_PASSWORD)

        # 1 Admin
        admin = User(
            email="admin@seturaksha.gov.in",
            full_name="Chief Engineer (State HQ)",
            password_hash=password_hash,
            role=UserRole.SYSTEM_ADMIN.value,
            jurisdiction_id=mh_state.id,
            locale="en",
        )
        session.add(admin)

        # 3 Division Engineers
        eng_pune = User(
            email="engineer.pune@seturaksha.gov.in",
            full_name="Er. Rajesh Deshmukh",
            password_hash=password_hash,
            role=UserRole.DIVISION_ENGINEER.value,
            jurisdiction_id=div_pune.id,
            locale="mr",
        )
        eng_konkan = User(
            email="engineer.konkan@seturaksha.gov.in",
            full_name="Er. Sunita Kadam",
            password_hash=password_hash,
            role=UserRole.DIVISION_ENGINEER.value,
            jurisdiction_id=div_konkan.id,
            locale="mr",
        )
        eng_nashik = User(
            email="engineer.nashik@seturaksha.gov.in",
            full_name="Er. Vikram Patil",
            password_hash=password_hash,
            role=UserRole.DIVISION_ENGINEER.value,
            jurisdiction_id=div_nashik.id,
            locale="hi",
        )
        session.add_all([eng_pune, eng_konkan, eng_nashik])

        # 8 Project Officers
        officers_data = [
            ("officer.pune1@seturaksha.gov.in", "Er. Amit Shinde", div_pune.id, "mr"),
            ("officer.pune2@seturaksha.gov.in", "Er. Sneha Joshi", div_pune.id, "mr"),
            ("officer.solapur@seturaksha.gov.in", "Er. Mahesh Gaikwad", div_pune.id, "mr"),
            ("officer.satara@seturaksha.gov.in", "Er. Pradeep Mane", div_pune.id, "mr"),
            ("officer.raigad@seturaksha.gov.in", "Er. Kavita Sawant", div_konkan.id, "mr"),
            ("officer.ratnagiri@seturaksha.gov.in", "Er. Sanjay Rane", div_konkan.id, "mr"),
            ("officer.nashik@seturaksha.gov.in", "Er. Deepak Ahire", div_nashik.id, "hi"),
            ("officer.nanded@seturaksha.gov.in", "Er. Priya Chavan", div_nashik.id, "hi"),
        ]
        created_officers = []
        for email, name, j_id, loc in officers_data:
            off = User(
                email=email,
                full_name=name,
                password_hash=password_hash,
                role=UserRole.PROJECT_OFFICER.value,
                jurisdiction_id=j_id,
                locale=loc,
            )
            session.add(off)
            created_officers.append(off)

        await session.flush()

        logger.info("Seeding L2 Contractors...")
        contractors = [
            Contractor(
                name="Maharashtra Infrastructure Corp Ltd",
                registration_no="MH-PWD-CL1-2015-081",
                quality_grade="A",
            ),
            Contractor(
                name="Sahyadri Bridge Builders Pvt Ltd",
                registration_no="MH-PWD-CL1-2018-112",
                quality_grade="A",
            ),
            Contractor(
                name="Deccan Structural Engineering Ltd",
                registration_no="MH-PWD-CL2-2020-045",
                quality_grade="B",
            ),
        ]
        session.add_all(contractors)
        await session.flush()

        logger.info("Seeding 60 synthetic bridges across 5 Maharashtra river basins...")
        # Template definitions for 5 basins
        basins = [
            {
                "river": "Mula-Mutha",
                "district": "Pune",
                "jurisdiction_id": div_pune.id,
                "prefix": "MH-PUN-MM",
                "lat_base": 18.5204,
                "lon_base": 73.8567,
                "count": 14,
                "names": [
                    "Bund Garden Flyover",
                    "Sangam Bridge",
                    "Yerawada Bridge",
                    "Kalyani Nagar Span",
                    "Mundhwa River Crossing",
                    "Khadakwasla Overflow Bridge",
                    "Dapodi Viaduct",
                    "Holkar Bridge",
                    "Aundh-Ravet Bridge",
                    "Harris Bridge",
                    "Koregaon Park Causeway",
                    "Warje Bypass Span",
                    "Sinhagad Foothill Bridge",
                    "Khadki Cantt Overpass",
                ],
            },
            {
                "river": "Bhima",
                "district": "Solapur",
                "jurisdiction_id": div_pune.id,
                "prefix": "MH-SOL-BHM",
                "lat_base": 17.6599,
                "lon_base": 75.9064,
                "count": 12,
                "names": [
                    "Pandharpur Sangam Bridge",
                    "Ujani Dam Tailrace Viaduct",
                    "Karmala Crossing",
                    "Daund Main Pier Bridge",
                    "Kurduvadi Bypass",
                    "Akkalkot Road Bridge",
                    "Mangalwedha River Span",
                    "Mohol Bypass Overpass",
                    "Barshi Link Viaduct",
                    "Indapur Feeder Bridge",
                    "Koregaon Bhima Bridge",
                    "Takli Barrage Bridge",
                ],
            },
            {
                "river": "Krishna",
                "district": "Satara",
                "jurisdiction_id": div_pune.id,
                "prefix": "MH-SAT-KRS",
                "lat_base": 17.6805,
                "lon_base": 74.0183,
                "count": 12,
                "names": [
                    "Wai Heritage Bridge",
                    "Karad Sangam Bridge",
                    "Mahabaleshwar Gorge Span",
                    "Patan River Viaduct",
                    "Koyna Confluence Bridge",
                    "Shirwal Industrial Span",
                    "Bhuinj Highway Bridge",
                    "Uran Islampur Crossing",
                    "Tasgaon Link Bridge",
                    "Miraj Krishna Bridge",
                    "Sangli Irwin Bridge Bypass",
                    "Kavathe Mahankal Span",
                ],
            },
            {
                "river": "Godavari",
                "district": "Nashik",
                "jurisdiction_id": div_nashik.id,
                "prefix": "MH-NSK-GDV",
                "lat_base": 19.9975,
                "lon_base": 73.7898,
                "count": 12,
                "names": [
                    "Ramkund Ghat Bridge",
                    "Gangapur Dam Causeway",
                    "Panchavati Crossing",
                    "Trimbakeshwar Link Bridge",
                    "Niphad Sugar Mill Bridge",
                    "Kopargaon River Span",
                    "Paithan Ancient Overpass",
                    "Nanded Gurudwara Bridge",
                    "Gangakhed Rail-Road Bridge",
                    "Sinnar Bypass Viaduct",
                    "Yeola Silk Route Bridge",
                    "Dharmabad Border Crossing",
                ],
            },
            {
                "river": "Konkan Coastal Rivers",
                "district": "Raigad",
                "jurisdiction_id": div_konkan.id,
                "prefix": "MH-KON-CST",
                "lat_base": 18.2351,
                "lon_base": 73.4443,
                "count": 10,
                "names": [
                    "Savitri River Mahad Span",
                    "Kundalika Roha Bridge",
                    "Amba River Nagothane Viaduct",
                    "Vashishti River Chiplun Bridge",
                    "Shastri River Sangameshwar Crossing",
                    "Kashadi Creek Bridge",
                    "Dharamtar Jetty Bridge",
                    "Revdanda Creek Span",
                    "Pen-Alibag Causeway",
                    "Mangaon Valley Overpass",
                ],
            },
        ]

        total_seeded = 0
        now = datetime.now(UTC)

        for basin in basins:
            for i in range(basin["count"]):
                total_seeded += 1
                b_code = f"{basin['prefix']}-{i + 1:03d}"
                b_name = basin["names"][i]
                lat = basin["lat_base"] + (i * 0.015)
                lon = basin["lon_base"] + (i * 0.012)
                year_built = 1970 + (i * 4)  # 1970 to 2022
                tier = "GOOD" if i % 4 != 3 else ("WATCH" if i % 8 == 3 else "WARNING")

                bridge = Bridge(
                    code=b_code,
                    name=b_name,
                    latitude=round(lat, 5),
                    longitude=round(lon, 5),
                    river=basin["river"],
                    district=basin["district"],
                    type="Prestressed Concrete Girder" if i % 2 == 0 else "Steel Truss Composite",
                    length_m=120.0 + (i * 20.0),
                    spans=4 + (i % 6),
                    year_built=year_built,
                    design_life_y=100,
                    irc_class="Class 70R" if i % 2 == 0 else "Class AA",
                    seismic_zone="Zone III" if "Konkan" not in basin["river"] else "Zone IV",
                    foundation_type="Well Foundation" if i % 3 != 0 else "Pile Foundation",
                    foundation_depth_m=14.0 + (i % 8),
                    design_hfl_m=500.0 + (i * 5.0),
                    design_scour_m=6.0 + (i % 4),
                    current_tier=tier,
                    last_audit_date=now - timedelta(days=(i * 5)),
                    public_visibility=True,
                    is_synthetic=True,
                    jurisdiction_id=basin["jurisdiction_id"],
                )
                session.add(bridge)
                await session.flush()

                # Assign officer
                assigned_officer = created_officers[total_seeded % len(created_officers)]
                assignment = BridgeAssignment(
                    bridge_id=bridge.id,
                    officer_id=assigned_officer.id,
                    from_date=now - timedelta(days=365),
                )
                session.add(assignment)

                # Seed L2 Material Logs
                mat_log = MaterialLog(
                    bridge_id=bridge.id,
                    material="CONCRETE",
                    grade="M45",
                    test_value=47.2 + (i % 5),
                    min_required=45.0,
                    is_passed=True,
                    test_date=now - timedelta(days=700),
                )
                session.add(mat_log)

                # Seed L2 Initial Load Test
                load_test = LoadTest(
                    bridge_id=bridge.id,
                    test_type="Static 70R Proof Load Test",
                    load_tonnes=140.0,
                    deflection_mm=6.5 + (i % 4),
                    max_allowable_deflection_mm=12.0,
                    result="PASS",
                    test_date=now - timedelta(days=680),
                )
                session.add(load_test)

        await session.commit()
        logger.info(
            f"Database successfully seeded with {total_seeded} synthetic bridges, 12 users, L2 quality logs, and assignments!"
        )


def main() -> None:
    asyncio.run(seed_database())


if __name__ == "__main__":
    main()
