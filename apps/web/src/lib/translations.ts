/**
 * Setu Rakshak - Master Trilingual Civil Engineering Translation Dictionary
 * Languages: English (en), Hindi (hi), Marathi (mr)
 * Strictly zero AI bluff: authentic civil engineering standards (IRC:SP:35, IRC:6, IS 1893, FHWA HEC-18).
 */

export interface TranslationDictionary {
  common: {
    appName: string;
    tagline: string;
    ministry: string;
    standardsTag: string;
    systemNominal: string;
    simulatedTag: string;
    disclaimerTitle: string;
    disclaimerText: string;
    copyright: string;
    nav: {
      registry: string;
      quality: string;
      telemetry: string;
      defectAr: string;
      triage: string;
      audits: string;
      risk: string;
      public: string;
    };
    tiers: {
      all: string;
      good: string;
      watch: string;
      warning: string;
      critical: string;
    };
  };
  bridges: {
    title: string;
    subtitle: string;
    filterBasin: string;
    filterTier: string;
    searchPlaceholder: string;
    totalRegistered: string;
    viewDetails: string;
    mapTitle: string;
    satellite: string;
    hybrid: string;
    terrain: string;
    roadmap: string;
    openMaps: string;
    directions: string;
    spans: string;
    builtYear: string;
    length: string;
    scourDepth: string;
    designHfl: string;
    allBasins: string;
    allTiers: string;
    cockpitTitle: string;
    specsTitle: string;
    simulateMonsoon: string;
    simulatingFlood: string;
    resetBaseline: string;
    backToRegistry: string;
    locateTitle: string;
    locateSubtitle: string;
    historyTimeline: string;
    operationalAge: string;
    designLife: string;
    remainingLife: string;
    structuralParams: string;
    superstructure: string;
    substructure: string;
    materials: string;
    hydraulicSeismic: string;
    locateOnMap: string;
    allCategories: string;
    filterState: string;
    filterAge: string;
    flyoversOnly: string;
    bridgesOnly: string;
    historicOnly: string;
    dossierTitle: string;
    trafficPcu: string;
    activeSensors: string;
    seismicZone: string;
    builderContractor: string;
  };
  audits: {
    title: string;
    subtitle: string;
    selectBridge: string;
    period: string;
    groupS: string;
    groupH: string;
    groupE: string;
    groupL: string;
    groupA: string;
    remarksLabel: string;
    remarksPlaceholder: string;
    saveDraft: string;
    submitAudit: string;
    draftSaved: string;
    submittedSuccess: string;
    estimatedSvi: string;
    factorsCount: string;
    factorHelp: string;
  };
  telemetry: {
    title: string;
    subtitle: string;
    liveNodes: string;
    streamActive: string;
    waterLevel: string;
    waterLevelUnit: string;
    pierTilt: string;
    pierTiltUnit: string;
    vibration: string;
    vibrationUnit: string;
    rainfall: string;
    rainfallUnit: string;
    safeThreshold: string;
    alertThreshold: string;
    lastPing: string;
    sensorHealth: string;
  };
  triage: {
    title: string;
    subtitle: string;
    incidentQueue: string;
    acknowledge: string;
    restrictTraffic: string;
    divertRoute: string;
    closeBridge: string;
    dispatchInspector: string;
    actionLogged: string;
    jurisdiction: string;
    escalationLevel: string;
  };
  risk: {
    title: string;
    subtitle: string;
    sviTitle: string;
    driTitle: string;
    rulTitle: string;
    remediationTitle: string;
    remediationSub: string;
    projectedDegradation: string;
    remediationPlan: string;
    estimatedCost: string;
    priorityUrgent: string;
    priorityRoutine: string;
    calculatorTitle: string;
    calculatorSub: string;
    deckCondition: string;
    scourRatio: string;
    pierTilt: string;
    bridgeAge: string;
    coastalRegime: string;
    computedOutput: string;
    criticalTrigger: string;
    criticalOverride: string;
    safetyInvariant: string;
    mlInvariantDesc: string;
    advisoryNote: string;
  };
  publicPortal: {
    title: string;
    subtitle: string;
    badge: string;
    searchBridge: string;
    healthTier: string;
    ageYears: string;
    builtYear: string;
    designLifeConsumed: string;
    latestAudit: string;
    reportConcern: string;
    reportSubmitted: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    descPlaceholder: string;
    submitGrievance: string;
    tierGoodDesc: string;
    tierWatchDesc: string;
    tierWarningDesc: string;
    tierCriticalDesc: string;
    grievanceTitle: string;
    grievanceSub: string;
    closeModal: string;
  };
}

export const TRANSLATIONS: Record<"en" | "hi" | "mr", TranslationDictionary> = {
  en: {
    common: {
      appName: "SETU RAKSHAK",
      tagline: "National Bridge Infrastructure Safety & Intelligence Grid",
      ministry: "GOVERNMENT OF MAHARASHTRA • PUBLIC WORKS DEPARTMENT & SDMA",
      standardsTag: "IRC:SP:35 • IS 1893:2016 COMPLIANT",
      systemNominal: "SYSTEM: NOMINAL (12ms)",
      simulatedTag: "source=simulated",
      disclaimerTitle: "STATUTORY CIVIL ENGINEERING ADVISORY",
      disclaimerText:
        "Setu Rakshak is an authorized decision-support intelligence grid designed to assist—never replace—certified civil engineering inspection, physical non-destructive testing (NDT), and professional human judgment. All test feeds are labeled source=simulated.",
      copyright: "© 2026 Setu Rakshak Platform. Public Works Department, Government of Maharashtra.",
      nav: {
        registry: "L1 Registry",
        quality: "L2 Quality",
        telemetry: "L3 Live IoT",
        defectAr: "AR 3D Defect Twin",
        triage: "L4 Triage",
        audits: "L5 Audits",
        risk: "L6 Risk (SVI)",
        public: "L7 Transparency",
      },
      tiers: {
        all: "All Tiers",
        good: "Good (Nominal)",
        watch: "Watch (Advisory)",
        warning: "Warning (Restricted)",
        critical: "Critical (Closure)",
      },
    },
    bridges: {
      title: "Bridge Infrastructure Asset Registry",
      subtitle:
        "Structural asset catalog, calibrated geospatial coordinates, design parameters, and live GIS surveillance across Maharashtra river basins.",
      filterBasin: "River Basin",
      filterTier: "Health Tier",
      searchPlaceholder: "Search by bridge code, structure name, or district...",
      totalRegistered: "Registered Bridges",
      viewDetails: "Open Live Structural Cockpit",
      mapTitle: "Geospatial Surveillance & Aerial Grid",
      satellite: "Satellite",
      hybrid: "Hybrid Aerial",
      terrain: "River Basin Terrain",
      roadmap: "Roadmap",
      openMaps: "Open in Maps",
      directions: "Navigation Route",
      spans: "Spans",
      builtYear: "Built Year",
      length: "Total Length",
      scourDepth: "Design Scour Depth",
      designHfl: "Design High Flood Level",
      allBasins: "All Basins",
      allTiers: "All Tiers",
      cockpitTitle: "Bridge Engineering Cockpit",
      specsTitle: "IRC Structural Specifications",
      simulateMonsoon: "Simulate Monsoon Surge",
      simulatingFlood: "Simulating Flood Surge...",
      resetBaseline: "Reset Baseline",
      backToRegistry: "Back to Bridge Registry",
      locateTitle: "Locate Bridge or Flyover",
      locateSubtitle:
        "National infrastructure intelligence: explore historical provenance, commissioning era, calculated operational age, engineering parameters, and calibrated GIS coordinates.",
      historyTimeline: "History & Construction Chronology",
      operationalAge: "Operational Age",
      designLife: "Design Service Life",
      remainingLife: "Remaining Service Life",
      structuralParams: "Civil Engineering Specifications",
      superstructure: "Superstructure Classification",
      substructure: "Substructure & Foundation",
      materials: "Material & Metallurgy Specifications",
      hydraulicSeismic: "Hydraulic, Marine & Seismic Profile",
      locateOnMap: "Locate on GIS Map",
      allCategories: "All Infrastructure Types",
      filterState: "State / UT",
      filterAge: "Era / Age",
      flyoversOnly: "Flyovers & Elevated Viaducts",
      bridgesOnly: "Bridges & Sea Links",
      historicOnly: "Historic Heritage (>50 Yrs)",
      dossierTitle: "Civil Infrastructure Intelligence Dossier",
      trafficPcu: "Daily Traffic Volume",
      activeSensors: "Active IoT Telemetry Nodes",
      seismicZone: "Seismic Zone (IS:1893)",
      builderContractor: "Builder / Executing Agency",
    },
    audits: {
      title: "26-Factor Field Structural Audit",
      subtitle:
        "Standardized monthly physical inspection protocol complying with IRC:SP:35 guidelines across structural, hydraulic, seismic, traffic, and material factors.",
      selectBridge: "Target Bridge Asset",
      period: "Audit Cycle Period",
      groupS: "S • Structural & Material Condition",
      groupH: "H • Hydraulic & Foundation Scour",
      groupE: "E • Seismic & Substructure Geometry",
      groupL: "L • Traffic Load & Axle Overloading",
      groupA: "A • Age, Degradation & Environment",
      remarksLabel: "Supervising Officer Technical Remarks",
      remarksPlaceholder: "Enter detailed geotechnical and structural observations (e.g. pier hairline cracking, bearing offset)...",
      saveDraft: "Save Audit Draft",
      submitAudit: "Submit Certified Audit",
      draftSaved: "Audit draft saved locally to offline storage.",
      submittedSuccess: "Field audit officially registered. SVI recalculated.",
      estimatedSvi: "Calculated Vulnerability Index (SVI)",
      factorsCount: "26 Standard Parameters Logged",
      factorHelp: "Scores calibrated per IRC:SP:35 Table 4.1 inspection standards.",
    },
    telemetry: {
      title: "Real-Time Structural Telemetry Grid",
      subtitle:
        "Continuous sensor surveillance capturing river stage, pier tilt, triaxial acceleration, and rainfall surge with millisecond edge processing.",
      liveNodes: "Active Telemetry Sensors",
      streamActive: "Sensor Ingestion Stream Active",
      waterLevel: "River Water Level",
      waterLevelUnit: "Meters above bed (HFL datum)",
      pierTilt: "Pier P2 Inclinometer",
      pierTiltUnit: "Milliradians inclination",
      vibration: "Triaxial Acceleration",
      vibrationUnit: "mm/s² peak particle velocity",
      rainfall: "Precipitation Surge",
      rainfallUnit: "mm / hour intensity",
      safeThreshold: "Operational Threshold",
      alertThreshold: "Emergency Action Trigger",
      lastPing: "Telemetry Heartbeat",
      sensorHealth: "Transducer Health Status",
    },
    triage: {
      title: "Division Engineer Incident Triage & Emergency Operations",
      subtitle:
        "Operational incident command for issuing bridge restrictions, traffic diversions, priority NDT dispatches, and emergency closures.",
      incidentQueue: "Pending Operational Action Items",
      acknowledge: "Acknowledge Hazard",
      restrictTraffic: "Enforce Axle Load Restriction",
      divertRoute: "Activate Arterial Traffic Diversion",
      closeBridge: "Issue Emergency Bridge Closure Order",
      dispatchInspector: "Dispatch Specialized NDT Crew",
      actionLogged: "Statutory engineering directive dispatched to district collector and police.",
      jurisdiction: "Division Jurisdiction",
      escalationLevel: "Response Escalation Protocol",
    },
    risk: {
      title: "Structural Vulnerability & Lifecycle RUL Engine",
      subtitle:
        "Deterministic SVI calculation, live dynamic hazard fusion, Markov deterioration forecasting, and ranked prescriptive civil engineering remediation.",
      sviTitle: "Structural Vulnerability Index (SVI)",
      driTitle: "Live Dynamic Risk Index (DRI)",
      rulTitle: "Remaining Useful Life (RUL)",
      remediationTitle: "Prescriptive Civil Engineering Catalogue",
      remediationSub: "Certified civil engineering interventions mapped to failure triggers per Appendix D.",
      projectedDegradation: "12-Month Structural Degradation Trajectory",
      remediationPlan: "Recommended Engineering Intervention",
      estimatedCost: "Estimated PWD Schedule of Rates",
      priorityUrgent: "Immediate Structural Intervention",
      priorityRoutine: "Scheduled Preventative Maintenance",
      calculatorTitle: "Interactive SVI Vulnerability Calculator",
      calculatorSub: "Calibrated to IRC:SP:35 Table 4.1 Formulation",
      deckCondition: "S-01 Deck Condition (0=Failed, 9=Pristine)",
      scourRatio: "H-01 Scour Ratio (Measured / Design Depth)",
      pierTilt: "E-02 Pier Inclinometer Tilt",
      bridgeAge: "A-01 Structure Age",
      coastalRegime: "Konkan Coastal Regime (High Chloride Air)",
      computedOutput: "Computed Vulnerability Output",
      criticalTrigger: "CRITICAL TRIGGER",
      criticalOverride: "CRITICAL OVERRIDE",
      safetyInvariant: "Safety Invariant Active",
      mlInvariantDesc: "Algorithms Cannot Downgrade Risk Below Physical Audits",
      advisoryNote: "Advisory: Certified decision support system only. Does not replace physical civil engineering inspection.",
    },
    publicPortal: {
      title: "Public Citizen Infrastructure Transparency Portal",
      subtitle:
        "Open public access to bridge construction age, design life consumed, current health tiers, and citizen grievance reporting.",
      badge: "PUBLIC CITIZEN TRANSPARENCY PORTAL (L7)",
      searchBridge: "Search bridge in your taluka or district...",
      healthTier: "Current Certified Safety Tier",
      ageYears: "Years in Public Service",
      builtYear: "Built Year",
      designLifeConsumed: "Design Life Consumed",
      latestAudit: "Latest Verified Audit",
      reportConcern: "Report Bridge Safety Concern",
      reportSubmitted: "Grievance registered. Assigned to Executive Engineer for verification.",
      namePlaceholder: "Citizen Full Name",
      phonePlaceholder: "Mobile Number for SMS Tracking",
      descPlaceholder: "Describe observed issue (e.g. pothole on deck, exposed rebar, railing damage)...",
      submitGrievance: "Submit Citizen Grievance",
      tierGoodDesc: "Normal operating condition. All structural metrics within safe design tolerances.",
      tierWatchDesc: "Minor non-structural wear detected. Elevated surveillance and scheduled maintenance.",
      tierWarningDesc: "Active structural warning. Heavy traffic restrictions may be imposed by PWD.",
      tierCriticalDesc: "Immediate intervention required. Emergency closure & traffic diversion activated.",
      grievanceTitle: "File Public Infrastructure Grievance",
      grievanceSub: "Directly lodged into PWD Division Engineer Triage Queue.",
      closeModal: "Close",
    },
  },
  hi: {
    common: {
      appName: "सेतु रक्षक",
      tagline: "राष्ट्रीय पुल अवसंरचना सुरक्षा एवं इंटेलिजेंस ग्रिड",
      ministry: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग एवं राज्य आपदा प्रबंधन",
      standardsTag: "IRC:SP:35 • IS 1893:2016 मानक अनुरूप",
      systemNominal: "प्रणाली: सामान्य (१२ मिलीसेकंड)",
      simulatedTag: "source=सिम्युलेटेड",
      disclaimerTitle: "वैधानिक सिविल इंजीनियरिंग सूचना",
      disclaimerText:
        "सेतु रक्षक एक अधिकृत निर्णय-सहायता इंटेलिजेंस ग्रिड है जो प्रमाणित सिविल इंजीनियरिंग निरीक्षण, भौतिक परीक्षण और मानवीय तकनीकी निर्णय की सहायता करता है, उनका स्थान नहीं लेता। सभी परीक्षण डेटा स्रोत=सिम्युलेटेड हैं।",
      copyright: "© २०२६ सेतु रक्षक प्लेटफॉर्म. सार्वजनिक बांधकाम विभाग, महाराष्ट्र शासन।",
      nav: {
        registry: "L1 रजिस्ट्री",
        quality: "L2 गुणवत्ता",
        telemetry: "L3 लाइव आईओटी",
        defectAr: "AR 3D डिजिटल ट्विन",
        triage: "L4 ट्राइएज",
        audits: "L5 ऑडिट",
        risk: "L6 जोखिम (SVI)",
        public: "L7 पारदर्शिता",
      },
      tiers: {
        all: "सभी श्रेणियां",
        good: "उत्तम (सामान्य)",
        watch: "निगरानी (सलाहकारी)",
        warning: "चेतावनी (प्रतिबंधित)",
        critical: "गंभीर (बंदी)",
      },
    },
    bridges: {
      title: "राष्ट्रीय पुल अवसंरचना रजिस्ट्री",
      subtitle:
        "महाराष्ट्र नदी घाटियों में वास्तविक समय संरचनात्मक स्वास्थ्य, लाइव गूगल मैप्स जीआईएस और गतिशील जोखिम सूचकांक।",
      filterBasin: "नदी बेसिन",
      filterTier: "जोखिम श्रेणी",
      searchPlaceholder: "पुल कोड, नदी या जिला खोजें...",
      totalRegistered: "पंजीकृत पुल",
      viewDetails: "लाइव कॉकपिट देखें",
      mapTitle: "लाइव गूगल मैप्स जीआईएस निगरानी ग्रिड",
      satellite: "सैटेलाइट विहंगम",
      hybrid: "सैटेलाइट हाइब्रिड",
      terrain: "नदी बेसिन भूभाग",
      roadmap: "सड़क मानचित्र",
      openMaps: "गूगल मैप्स में खोलें",
      directions: "दिशा निर्देश",
      spans: "स्पैन (खंभे)",
      builtYear: "निर्माण वर्ष",
      length: "कुल लंबाई",
      scourDepth: "डिजाइन कटाव गहराई",
      designHfl: "डिजाइन उच्च बाढ़ स्तर (HFL)",
      allBasins: "सभी बेसिन",
      allTiers: "सभी श्रेणियां",
      cockpitTitle: "पुल इंजीनियरिंग कॉकपिट",
      specsTitle: "आईआरसी संरचनात्मक विनिर्देश",
      simulateMonsoon: "मानसून बाढ़ प्रवाह सिमुलेट करें",
      simulatingFlood: "बाढ़ प्रवाह सिमुलेशन जारी...",
      resetBaseline: "आधार रेखा रीसेट करें",
      backToRegistry: "पुल रजिस्ट्री पर वापस जाएं",
      locateTitle: "पुल एवं फ्लाईओवर खोजें व पता लगाएं",
      locateSubtitle:
        "राष्ट्रीय अवसंरचना अन्वेषण: ऐतिहासिक पृष्ठभूमि, निर्माण वर्ष, सक्रिय परिचालन आयु, सिविल इंजीनियरिंग मापदंड और सटीक जीआईएस निर्देशांक।",
      historyTimeline: "इतिहास एवं निर्माण कालक्रम",
      operationalAge: "सक्रिय परिचालन आयु",
      designLife: "डिजाइन सेवा काल",
      remainingLife: "अवशिष्ट सेवा काल",
      structuralParams: "सिविल इंजीनियरिंग विनिर्देश",
      superstructure: "अधिरचना वर्गीकरण",
      substructure: "उपसंरचना एवं गहरी नींव",
      materials: "सामग्री एवं इस्पात विनिर्देश",
      hydraulicSeismic: "हाइड्रोलिक, सागरीय एवं भूकंपीय प्रोफाइल",
      locateOnMap: "जीआईएस मानचित्र पर खोजें",
      allCategories: "सभी अवसंरचना प्रकार",
      filterState: "राज्य / केंद्रशासित प्रदेश",
      filterAge: "आयु काल / युग",
      flyoversOnly: "फ्लाईओवर एवं उन्नत वायाडक्ट",
      bridgesOnly: "पुल एवं सागरीय सेतु",
      historicOnly: "ऐतिहासिक धरोहर (>५० वर्ष)",
      dossierTitle: "सिविल अवसंरचना तकनीकी डोजियर",
      trafficPcu: "दैनिक यातायात घनत्व",
      activeSensors: "सक्रिय आईओटी सेंसर नोड्स",
      seismicZone: "भूकंपीय क्षेत्र (IS:1893)",
      builderContractor: "निर्माण एवं निष्पादन एजेंसी",
    },
    audits: {
      title: "२६-घटक फील्ड संरचनात्मक ऑडिट",
      subtitle:
        "संरचनात्मक, हाइड्रोलिक, भूकंपीय, यातायात और सामग्री कारकों पर IRC:SP:35 दिशानिर्देशों के अनुरूप मानकीकृत मासिक भौतिक निरीक्षण।",
      selectBridge: "लक्ष्य पुल संरचना",
      period: "ऑडिट चक्र अवधि",
      groupS: "S • संरचनात्मक एवं सामग्री स्थिति",
      groupH: "H • हाइड्रोलिक एवं नींव कटाव",
      groupE: "E • भूकंपीय एवं सबस्ट्रक्चर ज्यामिति",
      groupL: "L • यातायात भार एवं धुरा अधिभार",
      groupA: "A • आयु, क्षरण एवं पर्यावरण",
      remarksLabel: "पर्यवेक्षण अधिकारी तकनीकी टिप्पणी",
      remarksPlaceholder: "विस्तृत भू-तकनीकी और संरचनात्मक टिप्पणियां दर्ज करें (उदा. खंभे में महीन दरार, बेयरिंग विस्थापन)...",
      saveDraft: "ऑडिट ड्राफ्ट सहेजें",
      submitAudit: "प्रमाणित ऑडिट जमा करें",
      draftSaved: "ऑडिट ड्राफ्ट स्थानीय ऑफ़लाइन स्टोरेज में सहेजा गया।",
      submittedSuccess: "फील्ड ऑडिट आधिकारिक तौर पर दर्ज। SVI की पुनर्गणना की गई।",
      estimatedSvi: "अनुमानित संवेदनशीलता सूचकांक (SVI)",
      factorsCount: "२६ मानक पैरामीटर दर्ज",
      factorHelp: "IRC:SP:35 तालिका ४.१ निरीक्षण मानकों अनुसार अंक।",
    },
    telemetry: {
      title: "वास्तविक समय संरचनात्मक टेलीमेट्री ग्रिड",
      subtitle:
        "मिलीसेकंड एज प्रोसेसिंग के साथ नदी स्तर, पियर झुकाव, त्रि-अक्षीय त्वरण और वर्षा वृद्धि की निरंतर सेंसर निगरानी।",
      liveNodes: "सक्रिय टेलीमेट्री नोड्स",
      streamActive: "सेंसर डेटा प्रवाह सक्रिय",
      waterLevel: "नदी जल स्तर",
      waterLevelUnit: "तल से ऊपर मीटर (HFL डेटम)",
      pierTilt: "पिलर P2 झुकाव मापक",
      pierTiltUnit: "मिलीरेडियन झुकाव",
      vibration: "त्रि-अक्षीय त्वरण",
      vibrationUnit: "मिमी/सेकंड² पीक पार्टिकल वेग",
      rainfall: "वर्षा तीव्रता",
      rainfallUnit: "मिमी / घंटा तीव्रता",
      safeThreshold: "परिचालन सीमा",
      alertThreshold: "आपातकालीन ट्रिगर",
      lastPing: "टेलीमेट्री पिंग",
      sensorHealth: "ट्रांसड्यूसर स्वास्थ्य स्थिति",
    },
    triage: {
      title: "डिवीजन इंजीनियर घटना नियंत्रण एवं आपातकालीन संचालन",
      subtitle:
        "पुल प्रतिबंध, यातायात डायवर्जन, प्राथमिकता एनडीटी प्रेषण और आपातकालीन बंदी आदेश जारी करने का परिचालन कमांड।",
      incidentQueue: "लंबित परिचालन कार्य",
      acknowledge: "जोखिम स्वीकार करें",
      restrictTraffic: "धुरा भार प्रतिबंध लागू करें",
      divertRoute: "यातायात डायवर्जन सक्रिय करें",
      closeBridge: "आपातकालीन पुल बंदी आदेश जारी करें",
      dispatchInspector: "विशेषज्ञ निरीक्षण टीम भेजें",
      actionLogged: "वैधानिक इंजीनियरिंग निर्देश जिला कलेक्टर और पुलिस को प्रेषित।",
      jurisdiction: "डिवीजन क्षेत्राधिकार",
      escalationLevel: "प्रतिक्रिया प्रोटोकॉल",
    },
    risk: {
      title: "संरचनात्मक संवेदनशीलता एवं शेष जीवन (RUL) इंजन",
      subtitle:
        "SVI गणना, लाइव खतरे का एकीकरण, मार्कोव क्षरण पूर्वानुमान और मानक सिविल इंजीनियरिंग उपचार सूची।",
      sviTitle: "संरचनात्मक संवेदनशीलता सूचकांक (SVI)",
      driTitle: "लाइव डायनामिक जोखिम सूचकांक (DRI)",
      rulTitle: "अनुमानित शेष सेवा जीवन (RUL)",
      remediationTitle: "निर्धारित सिविल इंजीनियरिंग उपचार सूची",
      remediationSub: "परिशिष्ट डी के अनुसार विफलता ट्रिगर्स पर आधारित प्रमाणित सिविल इंजीनियरिंग हस्तक्षेप।",
      projectedDegradation: "१२-महीने का संरचनात्मक क्षरण प्रक्षेपवक्र",
      remediationPlan: "अनुशंसित तकनीकी हस्तक्षेप",
      estimatedCost: "पीडब्ल्यूडी दर सूची अनुसार अनुमानित लागत",
      priorityUrgent: "तत्काल संरचनात्मक हस्तक्षेप",
      priorityRoutine: "नियमित निवारक रखरखाव",
      calculatorTitle: "इंटरैक्टिव SVI संवेदनशीलता कैलकुलेटर",
      calculatorSub: "IRC:SP:35 तालिका ४.१ के आधार पर अंशांकित",
      deckCondition: "S-01 डेक स्थिति (०=विफल, ९=उत्कृष्ट)",
      scourRatio: "H-01 कटाव अनुपात (मापा गया / डिजाइन गहराई)",
      pierTilt: "E-02 पिलर झुकाव",
      bridgeAge: "A-01 पुल निर्माण आयु",
      coastalRegime: "कोंकण तटीय क्षेत्र (उच्च क्लोराइड हवा)",
      computedOutput: "गणना किया गया परिणाम",
      criticalTrigger: "गंभीर ट्रिगर",
      criticalOverride: "गंभीर ओवरराइड",
      safetyInvariant: "सुरक्षा अपरिवर्तनीय सक्रिय",
      mlInvariantDesc: "एल्गोरिदम ऑडिट से कम जोखिम स्तर नहीं कर सकते",
      advisoryNote: "सलाह: केवल निर्णय सहायता प्रणाली। भौतिक सिविल इंजीनियरिंग निरीक्षण का स्थान नहीं लेती।",
    },
    publicPortal: {
      title: "नागरिक अवसंरचना पारदर्शिता पोर्टल",
      subtitle:
        "पुल निर्माण आयु, उपभोग किया गया डिजाइन जीवन, वर्तमान सुरक्षा श्रेणी और नागरिक शिकायत पंजीकरण की खुली सार्वजनिक पहुंच।",
      badge: "सार्वजनिक नागरिक पारदर्शिता पोर्टल (L7)",
      searchBridge: "अपने तालुका या जिले में पुल खोजें...",
      healthTier: "वर्तमान प्रमाणित सुरक्षा श्रेणी",
      ageYears: "सार्वजनिक सेवा में वर्ष",
      builtYear: "निर्माण वर्ष",
      designLifeConsumed: "उपभोग किया गया डिजाइन जीवन",
      latestAudit: "नवीनतम सत्यापित ऑडिट",
      reportConcern: "पुल सुरक्षा समस्या दर्ज करें",
      reportSubmitted: "शिकायत दर्ज हुई। सत्यापन हेतु कार्यकारी अभियंता को प्रेषित।",
      namePlaceholder: "नागरिक का पूरा नाम",
      phonePlaceholder: "एसएमएस ट्रैकिंग हेतु मोबाइल नंबर",
      descPlaceholder: "देखी गई समस्या का विवरण (उदा. डेक पर गड्ढा, सरिया दिखना, रेलिंग क्षति)...",
      submitGrievance: "नागरिक शिकायत जमा करें",
      tierGoodDesc: "सामान्य परिचालन स्थिति। सभी संरचनात्मक मेट्रिक्स सुरक्षित सीमा में हैं।",
      tierWatchDesc: "मामूली गैर-संरचनात्मक घिसाव। बढ़ी हुई निगरानी और निर्धारित रखरखाव।",
      tierWarningDesc: "सक्रिय संरचनात्मक चेतावनी। पीडब्ल्यूडी द्वारा भारी यातायात प्रतिबंधित हो सकता है।",
      tierCriticalDesc: "तत्काल हस्तक्षेप आवश्यक। आपातकालीन बंदी और यातायात डायवर्जन सक्रिय।",
      grievanceTitle: "सार्वजनिक बुनियादी ढांचा शिकायत दर्ज करें",
      grievanceSub: "सीधे पीडब्ल्यूडी डिवीजन इंजीनियर ट्राइएज कतार में दर्ज।",
      closeModal: "बंद करें",
    },
  },
  mr: {
    common: {
      appName: "सेतू रक्षक",
      tagline: "राष्ट्रीय पूल पायाभूत सुविधा सुरक्षा व गुप्तचर यंत्रणा",
      ministry: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग व राज्य आपत्ती व्यवस्थापन",
      standardsTag: "IRC:SP:35 • IS 1893:2016 मानकांनुसार",
      systemNominal: "प्रणाली: सुरळीत (१२ मिलीसेकंद)",
      simulatedTag: "source=सिम्युलेटेड",
      disclaimerTitle: "वैधानिक स्थापत्य अभियांत्रिकी सूचना",
      disclaimerText:
        "सेतू रक्षक ही निर्णय-साहाय्य यंत्रणा असून ती प्रत्यक्ष स्थापत्य अभियांत्रिकी तपासणी, प्रत्यक्ष चाचणी आणि मानवी अभियांत्रिकी निर्णयाची जागा घेत नाही. सर्व डेटा चाचणीसाठी source=सिम्युलेटेड म्हणून नोंदवला गेला आहे.",
      copyright: "© २०२६ सेतू रक्षक प्लॅटफॉर्म. सार्वजनिक बांधकाम विभाग, महाराष्ट्र शासन.",
      nav: {
        registry: "L1 नोंदवही",
        quality: "L2 गुणवत्ता",
        telemetry: "L3 थेट सेन्सर",
        defectAr: "AR 3D डिजिटल ट्विन",
        triage: "L4 ट्राइएज",
        audits: "L5 तपासणी",
        risk: "L6 जोखीम (SVI)",
        public: "L7 पारदर्शकता",
      },
      tiers: {
        all: "सर्व स्तर",
        good: "उत्तम (सुरक्षित)",
        watch: "दक्ष राहा (निरीक्षण)",
        warning: "इशारा (मर्यादित)",
        critical: "धोकादायक (बंद)",
      },
    },
    bridges: {
      title: "राष्ट्रीय पूल पायाभूत सुविधा नोंदवही",
      subtitle:
        "महाराष्ट्र नदी खोऱ्यांमधील रिअल-टाइम संरचनात्मक आरोग्य, थेट गुगल मॅप्स जीआयएस आणि गतिशील जोखीम निर्देशांक.",
      filterBasin: "नदी खोरे",
      filterTier: "जोखीम स्तर",
      searchPlaceholder: "पूल कोड, नदी किंवा जिल्हा शोधा...",
      totalRegistered: "नोंदणीकृत पूल",
      viewDetails: "थेट कॉकपिट पहा",
      mapTitle: "थेट गुगल मॅप्स जीआयएस देखरेख ग्रीड",
      satellite: "उपग्रह दृश्य",
      hybrid: "उपग्रह हायब्रिड",
      terrain: "नदी खोरे भूप्रदेश",
      roadmap: "रस्ता नकाशा",
      openMaps: "गुगल मॅप्समध्ये उघडा",
      directions: "मार्ग दिशा",
      spans: "खांब (स्पॅन)",
      builtYear: "बांधकाम वर्ष",
      length: "एकूण लांबी",
      scourDepth: "डिझाइन गाद खोली",
      designHfl: "डिझाइन पूर पातळी (HFL)",
      allBasins: "सर्व खोरे",
      allTiers: "सर्व स्तर",
      cockpitTitle: "पूल अभियांत्रिकी कॉकपिट",
      specsTitle: "आयआरसी संरचनात्मक तपशील",
      simulateMonsoon: "पावसाळी पूर प्रवाह सिम्युलेट करा",
      simulatingFlood: "पूर प्रवाह सिम्युलेशन सुरू...",
      resetBaseline: "मूळ स्थिती रीसेट करा",
      backToRegistry: "पूल नोंदवहीकडे परत जा",
      locateTitle: "पूल आणि उड्डाणपूल शोधा व स्थान निश्चित करा",
      locateSubtitle:
        "राष्ट्रीय पायाभूत सुविधा शोध: ऐतिहासिक पार्श्वभूमी, बांधकाम वर्ष, सक्रिय परिचालन वय, स्थापत्य अभियांत्रिकी मापदंड आणि अचूक जीआयएस समन्वय.",
      historyTimeline: "इतिहास आणि बांधकाम कालक्रम",
      operationalAge: "सक्रिय परिचालन वय",
      designLife: "डिझाइन सेवा काळ",
      remainingLife: "उर्वरित सेवा काळ",
      structuralParams: "स्थापत्य अभियांत्रिकी तपशील",
      superstructure: "अधिरचना वर्गीकरण",
      substructure: "उपसंरचना आणि खोल पाया",
      materials: "साहित्य आणि धातू तपशील",
      hydraulicSeismic: "हायड्रॉलिक, सागरी व भूकंपीय प्रोफाइल",
      locateOnMap: "जीआयएस नकाशावर शोधा",
      allCategories: "सर्व पायाभूत सुविधा प्रकार",
      filterState: "राज्य / केंद्रशासित प्रदेश",
      filterAge: "वय काळ / युग",
      flyoversOnly: "उड्डाणपूल आणि उन्नत मार्ग",
      bridgesOnly: "पूल आणि सागरी सेतू",
      historicOnly: "ऐतिहासिक वारसा (>५० वर्षे)",
      dossierTitle: "नागरी पायाभूत सुविधा तांत्रिक संचिका (डोजियर)",
      trafficPcu: "दैनिक वाहतूक घनता",
      activeSensors: "सक्रिय आयओटी सेन्सर नोड्स",
      seismicZone: "भूकंपीय क्षेत्र (IS:1893)",
      builderContractor: "बांधकाम व अंमलबजावणी संस्था",
    },
    audits: {
      title: "२६-घटक प्रत्यक्ष संरचनात्मक तपासणी (ऑडिट)",
      subtitle:
        "संरचनात्मक, जलवैज्ञानिक, भूकंपीय, वाहतूक भार आणि साहित्य घटकांवर IRC:SP:35 मार्गदर्शक तत्त्वांनुसार मासिक प्रत्यक्ष तपासणी.",
      selectBridge: "तपासणीसाठी पूल",
      period: "ऑडिट चक्र कालावधी",
      groupS: "S • संरचनात्मक व साहित्य स्थिती",
      groupH: "H • जलप्रवाह व पायाची झीज (गाद)",
      groupE: "E • भूकंपीय व पायाची भूमिती",
      groupL: "L • वाहतूक भार व ओव्हरलोडिंग",
      groupA: "A • वय, क्षय व पर्यावरणीय परिणाम",
      remarksLabel: "पर्यवेक्षक अधिकाऱ्याचे तांत्रिक शेरे",
      remarksPlaceholder: "सविस्तर भू-तांत्रिक व संरचनात्मक निरीक्षणे नोंदवा (उदा. खांबाला सूक्ष्म भेगा, बेअरिंग सरकणे)...",
      saveDraft: "मसुदा जतन करा",
      submitAudit: "प्रमाणित ऑडिट दाखल करा",
      draftSaved: "ऑडिट मसुदा ऑफलाइन जतन केला.",
      submittedSuccess: "तपासणी अधिकृतपणे नोंदवली. SVI ची पुनर्गणना झाली.",
      estimatedSvi: "अंदाजित संवेदनशीलता निर्देशांक (SVI)",
      factorsCount: "२६ निकष नोंदवले",
      factorHelp: "गुण IRC:SP:35 तक्ता ४.१ तपासणी मानकांनुसार निश्चित.",
    },
    telemetry: {
      title: "थेट संरचनात्मक टेलीमेट्री ग्रीड",
      subtitle:
        "नदीची पाण्याची पातळी, खांबाचा कल, त्रि-अक्षीय कंपन आणि पावसाच्या नोंदींची रिअल-टाइम सेन्सर देखरेख.",
      liveNodes: "सक्रिय सेन्सर नोड्स",
      streamActive: "सेन्सर डेटा प्रवाह सक्रिय",
      waterLevel: "नदीची पाण्याची पातळी",
      waterLevelUnit: "तळापासून मीटर (HFL निकष)",
      pierTilt: "खांब P2 टिल्ट सेन्सर",
      pierTiltUnit: "मिलीरेडियन कल",
      vibration: "त्रि-अक्षीय कंपन",
      vibrationUnit: "मिमी/सेकंड² वेग",
      rainfall: "पाऊस प्रमाण",
      rainfallUnit: "मिमी / तास तीव्रता",
      safeThreshold: "कार्यरत सुरक्षित मर्यादा",
      alertThreshold: "तातडीची धोक्याची मर्यादा",
      lastPing: "सेन्सर पिंग वेळ",
      sensorHealth: "ट्रान्सड्यूसर स्थिती",
    },
    triage: {
      title: "कार्यकारी अभियंता घटना नियंत्रण व आपत्कालीन कक्ष",
      subtitle:
        "वाहतूक निर्बंध, मार्ग वळवणे, तातडीची एनडीटी तपासणी आणि आपत्कालीन पूल बंदी आदेशांचे संचालन.",
      incidentQueue: "प्रलंबित कारवाई यादी",
      acknowledge: "धोका स्वीकारा",
      restrictTraffic: "वाहन भार मर्यादा लागू करा",
      divertRoute: "वाहतूक वळवण्याचा मार्ग सुरू करा",
      closeBridge: "पूल तत्काळ बंद करण्याचा आदेश काढा",
      dispatchInspector: "विशेष तपासणी पथक पाठवा",
      actionLogged: "वैधानिक अभियांत्रिकी आदेश जिल्हाधिकारी व पोलिसांना रवाना.",
      jurisdiction: "विभागीय कार्यक्षेत्र",
      escalationLevel: "प्रतिसाद प्रोटोकॉल",
    },
    risk: {
      title: "संरचनात्मक संवेदनशीलता व उर्वरित आयुष्य (RUL)",
      subtitle:
        "SVI गणना, थेट धोक्यांचे एकत्रीकरण, मार्कोव्ह क्षय अंदाज आणि अधिकृत स्थापत्य दुरुस्ती उपाययोजना.",
      sviTitle: "संरचनात्मक संवेदनशीलता निर्देशांक (SVI)",
      driTitle: "थेट डायनामिक जोखीम निर्देशांक (DRI)",
      rulTitle: "अंदाजित उर्वरित सेवा आयुष्य (RUL)",
      remediationTitle: "अधिकृत स्थापत्य अभियांत्रिकी उपाय",
      remediationSub: "परिशिष्ट डी नुसार प्रमाणित स्थापत्य अभियांत्रिकी दुरुस्ती उपाय.",
      projectedDegradation: "१२ महिन्यांचा संरचनात्मक क्षय आलेख",
      remediationPlan: "शिफारस केलेली स्थापत्य दुरुस्ती",
      estimatedCost: "पीडब्ल्यूडी दरपत्रकानुसार अंदाजित खर्च",
      priorityUrgent: "तातडीची संरचनात्मक दुरुस्ती",
      priorityRoutine: "नियमित प्रतिबंधात्मक देखभाल",
      calculatorTitle: "इंटरॅक्टिव्ह SVI संवेदनशीलता गणक",
      calculatorSub: "IRC:SP:35 तक्ता ४.१ सूत्रानुसार प्रमाणित",
      deckCondition: "S-01 डेक स्थिती (०=नादुरुस्त, ९=उत्कृष्ट)",
      scourRatio: "H-01 गाद/झीज गुणोत्तर (मोजलेली / डिझाइन खोली)",
      pierTilt: "E-02 खांबाचा कल (टिल्ट)",
      bridgeAge: "A-01 पुलाचे वय",
      coastalRegime: "कोकण किनारी क्षेत्र (खारट हवा/क्लोराईड)",
      computedOutput: "गणित केलेले निष्कर्ष",
      criticalTrigger: "धोकादायक ट्रिगर",
      criticalOverride: "धोकादायक ओव्हरराइड",
      safetyInvariant: "सुरक्षा नियम सक्रिय",
      mlInvariantDesc: "अल्गोरिदम प्रत्यक्ष ऑडिटपेक्षा जोखीम कमी करू शकत नाही",
      advisoryNote: "सूचना: केवळ निर्णय सहाय्य प्रणाली. प्रत्यक्ष स्थापत्य अभियांत्रिकी तपासणीची जागा घेत नाही.",
    },
    publicPortal: {
      title: "नागरिक पायाभूत सुविधा पारदर्शकता दालन",
      subtitle:
        "पुलाचे बांधकाम वर्ष, पूर्ण झालेले सेवा आयुष्य, सद्य सुरक्षा स्तर आणि नागरिक तक्रार नोंदणीची खुली सार्वजनिक सोय.",
      badge: "नागरिक पायाभूत सुविधा पारदर्शकता दालन (L7)",
      searchBridge: "तुमच्या तालुक्यातील किंवा जिल्ह्यातील पूल शोधा...",
      healthTier: "प्रमाणित सुरक्षितता स्तर",
      ageYears: "सेवेतील वर्षे",
      builtYear: "बांधकाम वर्ष",
      designLifeConsumed: "वापरलेले डिझाइन आयुष्य",
      latestAudit: "नवीनतम पडताळलेली तपासणी",
      reportConcern: "पूल सुरक्षेबाबत तक्रार नोंदवा",
      reportSubmitted: "तक्रार नोंदवली गेली. पडताळणीसाठी कार्यकारी अभियंत्याकडे वर्ग केली.",
      namePlaceholder: "नागरिकाचे पूर्ण नाव",
      phonePlaceholder: "एसएमएस माहितीसाठी भ्रमणध्वनी क्रमांक",
      descPlaceholder: "दिसलेली समस्या लिहा (उदा. रस्त्यावरील खड्डा, उघडी पडलेली लोखंडी सळई, कठडा तुटणे)...",
      submitGrievance: "तक्रार दाखल करा",
      tierGoodDesc: "सामान्य सुरक्षित स्थिती. सर्व संरचनात्मक निकष सुरक्षित मर्यादेत आहेत.",
      tierWatchDesc: "किरकोळ गैर-संरचनात्मक झीज. वाढीव देखरेख व नियोजित देखभाल.",
      tierWarningDesc: "सक्रिय संरचनात्मक इशारा. सार्वजनिक बांधकाम विभागाकडून अवजड वाहतूक निर्बंध लागू होऊ शकतात.",
      tierCriticalDesc: "तातडीची दुरुस्ती आवश्यक. आपत्कालीन पूल बंदी व वाहतूक वळवणे सुरू.",
      grievanceTitle: "पूल सुरक्षेबाबत सार्वजनिक तक्रार नोंदवा",
      grievanceSub: "थेट सार्वजनिक बांधकाम विभाग कार्यकारी अभियंत्यांच्या ट्राइएज कक्षेत दाखल.",
      closeModal: "बंद करा",
    },
  },
};
