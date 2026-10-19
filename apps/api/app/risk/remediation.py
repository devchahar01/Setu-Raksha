"""
Setu Raksha - Prescriptive Remediation Catalogue (Appendix D)
Trilingual engineering remediation actions (EN, HI, MR).
"""
from typing import Any, Dict, List

REMEDIATION_CATALOGUE: Dict[str, Dict[str, Any]] = {
    "RIPRAP-01": {
        "rule_id": "RIPRAP-01",
        "priority": "URGENT",
        "category": "HYDRAULIC",
        "title": {
            "en": "Riprap and Scour Apron Restoration",
            "hi": "रिपरैप और कटाव सुरक्षा एप्रन का पुनर्स्थापन",
            "mr": "रिपरॅप आणि गाद संरक्षण अ‍ॅप्रनची पुनर्स्थापना",
        },
        "description": {
            "en": "Place or restore riprap or apron around piers; re-survey bed after next flood.",
            "hi": "खंभों के चारों ओर बोल्डर पिचिंग/रिपरैप बिछाएं; अगली बाढ़ के बाद नदी तल का पुनः सर्वेक्षण करें।",
            "mr": "खांबांभोवती बोल्डर पिचिंग/रिपरॅप लावा; पुढच्या पुरानंतर नदी पात्राचे पुनर्सर्वेक्षण करा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "SCOUR-UW-01": {
        "rule_id": "SCOUR-UW-01",
        "priority": "URGENT",
        "category": "HYDRAULIC",
        "title": {
            "en": "Underwater Scour Diving Inspection",
            "hi": "पानी के नीचे कटाव की गोताखोरी जांच",
            "mr": "पाण्याखालील गाद आणि पायाची पाणबुडी तपासणी",
        },
        "description": {
            "en": "Schedule underwater inspection before next monsoon to assess well foundation depth.",
            "hi": "कुआं नींव की गहराई का आकलन करने के लिए अगले मानसून से पहले पानी के नीचे जांच निर्धारित करें।",
            "mr": "विहीर पायाच्या खोलीचे मूल्यांकन करण्यासाठी पुढील पावसाळ्यापूर्वी पाण्याखालील तपासणी निश्चित करा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "DEBRIS-01": {
        "rule_id": "DEBRIS-01",
        "priority": "IMMEDIATE",
        "category": "HYDRAULIC",
        "title": {
            "en": "Debris and Trash Rack Clearance",
            "hi": "मलबे और कचरा रैक की तत्काल सफाई",
            "mr": "कचरा आणि राडारोडा तातडीने काढणे",
        },
        "description": {
            "en": "Clear debris and trash racks from piers; assign continuous watch during high flow.",
            "hi": "खंभों से मलबा और पेड़ की शाखाएं हटाएं; उच्च जलप्रवाह के दौरान निरंतर निगरानी तैनात करें।",
            "mr": "खांबांवरील लाकूड आणि कचरा साफ करा; पाण्याच्या वाढत्या प्रवाहात सतत पाळत ठेवा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "BEARING-01": {
        "rule_id": "BEARING-01",
        "priority": "URGENT",
        "category": "STRUCTURAL",
        "title": {
            "en": "Bearing Rehabilitation and Traffic Weight Limit",
            "hi": "बेयरिंग पुनर्वास और भारी वाहन सीमा",
            "mr": "बेअरिंग दुरुस्ती आणि अवजड वाहतूक मर्यादा",
        },
        "description": {
            "en": "Inspect and replace displaced elastomeric/pot bearings; restrict heavy vehicles meanwhile.",
            "hi": "विस्थापित इलास्टोमेरिक/पॉट बेयरिंग की जांच और बदलाव करें; अंतरिम अवधि में भारी वाहनों को रोकें।",
            "mr": "हलवलेल्या इलॅस्टोमेरिक बेअरिंगची तपासणी आणि पुनर्बदल करा; तोपर्यंत अवजड वाहनांवर बंदी घाला.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "SEAT-01": {
        "rule_id": "SEAT-01",
        "priority": "PLANNED",
        "category": "SEISMIC",
        "title": {
            "en": "Seat Width Extension and Seismic Restrainers",
            "hi": "सीट की चौड़ाई का विस्तार और भूकंपीय लॉक",
            "mr": "सीट रुंदी वाढवणे आणि भूकंपीय लॉक बसवणे",
        },
        "description": {
            "en": "Increase seat width or install unseating restrainers and shear keys in high seismic zones.",
            "hi": "उच्च भूकंपीय क्षेत्रों में सीट की चौड़ाई बढ़ाएं या अनसीटिंग रिस्ट्रेनर्स और शीयर कीज़ लगाएं।",
            "mr": "उच्च भूकंप प्रवण भागात सीटची रुंदी वाढवा किंवा अनसीटिंग प्रतिबंधक आणि शिअर की बसवा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "JACKET-01": {
        "rule_id": "JACKET-01",
        "priority": "URGENT",
        "category": "STRUCTURAL",
        "title": {
            "en": "Column Concrete Jacketing & Retrofit",
            "hi": "कॉलम कंक्रीट जैकेटिंग और रेट्रोफिट",
            "mr": "खांब काँक्रीट जॅकेटिंग आणि मजबुतीकरण",
        },
        "description": {
            "en": "Detailed structural assessment and pier column reinforced concrete/FRP jacketing.",
            "hi": "खंभों का विस्तृत संरचनात्मक आकलन और प्रबलित कंक्रीट या एफआरपी जैकेटिंग कराएं।",
            "mr": "सविस्तर संरचनात्मक मूल्यांकन करून खांबांचे आरसीसी किंवा एफआरपी जॅकेटिंग करा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "CRACK-01": {
        "rule_id": "CRACK-01",
        "priority": "PLANNED",
        "category": "STRUCTURAL",
        "title": {
            "en": "Epoxy Crack Injection and Monitoring",
            "hi": "इपॉक्सी दरार इंजेक्शन और निगरानी",
            "mr": "इपॉक्सी क्रॅक इंजेक्शन आणि देखरेख",
        },
        "description": {
            "en": "Seal cracks > 1.5mm with pressure epoxy injection; re-inspect within 90 days.",
            "hi": "प्रेशर इपॉक्सी इंजेक्शन से 1.5 मिमी से बड़ी दरारें भरें; 90 दिनों में पुनः जांच करें।",
            "mr": "दाबाने इपॉक्सी इंजेक्शन देऊन १.५ मिमी पेक्षा मोठ्या भेगा बुजवा; ९० दिवसांत पुन्हा तपासणी करा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "CORR-01": {
        "rule_id": "CORR-01",
        "priority": "PLANNED",
        "category": "DURABILITY",
        "title": {
            "en": "Chloride Extraction and Anti-Corrosion Coating",
            "hi": "क्लोराइड निष्कर्षण और जंग रोधी कोटिंग",
            "mr": "क्लोराईड निष्कासन आणि गंज प्रतिबंधक लेप",
        },
        "description": {
            "en": "Apply protective silane coating or sacrificial zinc anodes; repair spalled concrete cover.",
            "hi": "सुरक्षात्मक सिलेन कोटिंग या सैक्रिफिशियल जिंक एनोड लगाएं; क्षतिग्रस्त कंक्रीट कवर की मरम्मत करें।",
            "mr": "संरक्षक सिलेन कोटिंग किंवा झिंक अ‍ॅनोड्स लावा; उखडलेल्या काँक्रीट कव्हरची दुरुस्ती करा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "LOAD-01": {
        "rule_id": "LOAD-01",
        "priority": "URGENT",
        "category": "TRAFFIC",
        "title": {
            "en": "Axle Weigh-In-Motion and Load Capacity Rating",
            "hi": "वे-इन-मोशन एक्सल वजन और भार क्षमता पुनर्निर्धारण",
            "mr": "एक्सल वजन मापन यंत्रणा आणि भार क्षमता पुनर्मूल्यांकन",
        },
        "description": {
            "en": "Enforce strict gross vehicle weight limits; commission updated IRC 6 load rating review.",
            "hi": "सख्त वाहन भार सीमा लागू करें; अद्यतन आईआरसी 6 भार रेटिंग समीक्षा का आदेश दें।",
            "mr": "कडक वाहन वजन मर्यादा लागू करा; अद्ययावत आयआरसी ६ लोड रेटिंग पुनरावलोकन करा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "RESTRICT-01": {
        "rule_id": "RESTRICT-01",
        "priority": "IMMEDIATE",
        "category": "OPERATIONAL",
        "title": {
            "en": "Heavy Vehicle Restriction and Route Diversion Alert",
            "hi": "भारी वाहन प्रतिबंध और मार्ग परिवर्तन चेतावनी",
            "mr": "अवजड वाहतूक निर्बंध आणि मार्ग वळवण्याची सूचना",
        },
        "description": {
            "en": "Restrict multi-axle commercial traffic and prepare alternate bypass route diversions.",
            "hi": "बहु-धुरीय भारी वाहनों का प्रवेश रोकें और वैकल्पिक बाईपास मार्ग डायवर्जन तैयार करें।",
            "mr": "मल्टी-एक्सल व्यावसायिक वाहतूक थांबवा आणि पर्यायी बाह्यवळण मार्ग तयार ठेवा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
    "CLOSE-01": {
        "rule_id": "CLOSE-01",
        "priority": "IMMEDIATE",
        "category": "EMERGENCY",
        "title": {
            "en": "Emergency Bridge Closure and Traffic Evacuation",
            "hi": "आपातकालीन पुल बंदी और यातायात निकासी",
            "mr": "तातडीने पूल बंद करणे आणि वाहतूक वळवणे",
        },
        "description": {
            "en": "Immediately close bridge to all traffic, sound sirens, inform district collector and disaster control room.",
            "hi": "पुल को सभी यातायात के लिए तुरंत बंद करें, सायरन बजाएं, जिला कलेक्टर और आपदा नियंत्रण कक्ष को सूचित करें।",
            "mr": "पूल तात्काळ सर्व वाहतुकीसाठी बंद करा, सायरन वाजवा, जिल्हाधिकारी आणि आपत्ती व्यवस्थापन कक्षाला कळवा.",
        },
        "reviewed_by": "SE_PWD_Approved",
    },
}


def evaluate_remediations(
    dri_score: float,
    critical_flags: List[str],
    factor_values: Dict[str, float],
) -> List[Dict[str, Any]]:
    """Evaluates triggering conditions and returns prioritized remediation actions."""
    triggered: List[Dict[str, Any]] = []

    # CLOSE-01: Critical tier or critical flag active
    if dri_score >= 75.0 or len(critical_flags) >= 2 or "PIER_TILT_EXCEEDED" in critical_flags:
        triggered.append(REMEDIATION_CATALOGUE["CLOSE-01"])

    # RESTRICT-01: Warning tier or single critical flag
    elif dri_score >= 55.0 or len(critical_flags) >= 1:
        triggered.append(REMEDIATION_CATALOGUE["RESTRICT-01"])

    # Hydraulic triggers
    if factor_values.get("H-01", 0) >= 0.85 or "SCOUR_CRITICAL" in critical_flags:
        triggered.append(REMEDIATION_CATALOGUE["RIPRAP-01"])
        triggered.append(REMEDIATION_CATALOGUE["SCOUR-UW-01"])

    if factor_values.get("H-04", 0) >= 3.0:  # High debris
        triggered.append(REMEDIATION_CATALOGUE["DEBRIS-01"])

    # Structural triggers
    if factor_values.get("S-04", 0) >= 4.0:  # Poor bearing
        triggered.append(REMEDIATION_CATALOGUE["BEARING-01"])

    if factor_values.get("S-05", 0) >= 1.5:  # Cracks > 1.5mm
        triggered.append(REMEDIATION_CATALOGUE["CRACK-01"])

    if factor_values.get("S-06", 0) >= 10.0 or factor_values.get("A-06", 0) >= 3.0:  # Corrosion
        triggered.append(REMEDIATION_CATALOGUE["CORR-01"])

    # Seismic triggers
    if factor_values.get("E-01", 1.5) < 1.0:  # Inadequate seat width
        triggered.append(REMEDIATION_CATALOGUE["SEAT-01"])

    if factor_values.get("E-02", 0) >= 0.8:  # Pier tilt
        triggered.append(REMEDIATION_CATALOGUE["JACKET-01"])

    # Load triggers
    if factor_values.get("L-03", 0) >= 5.0:  # Frequent overloads
        triggered.append(REMEDIATION_CATALOGUE["LOAD-01"])

    # Deduplicate while preserving order
    seen: set[str] = set()
    result: List[Dict[str, Any]] = []
    for item in triggered:
        if item["rule_id"] not in seen:
            seen.add(item["rule_id"])
            result.append(item)

    return result
