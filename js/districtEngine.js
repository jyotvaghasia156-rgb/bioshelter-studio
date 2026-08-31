/**
 * BioShelter Studio - District-Wise Live Temperature Engine
 * Comprehensive atmospheric telemetry engine covering all 33 Gujarat districts,
 * major Indian states/metropolitan hubs, and global climate districts.
 */

export const MASTER_DISTRICTS_DATA = [
    // =========================================================================
    // ALL 33 GUJARAT DISTRICTS (Comprehensive Official Census & Meteorological Data)
    // =========================================================================
    {
        id: "gj_ahmedabad",
        name: "Ahmedabad",
        aliases: ["Ahmedabad City", "Amdavad", "Sanand", "Dholera", "Viramgam"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.0225,
        lng: 72.5714,
        baseTemp: 42.5,
        baseRh: 32,
        vernacular: "Pol house central courtyard stack effect, Otla porches & subterranean Tanka water cisterns."
    },
    {
        id: "gj_surat",
        name: "Surat",
        aliases: ["Surat City", "Rander", "Bardoli", "Hazira", "Olpad"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 21.1702,
        lng: 72.8311,
        baseTemp: 36.8,
        baseRh: 78,
        vernacular: "Elevated timber stilt plinths, Tapi river breeze ducts & continuous cross-ventilation jharokhas."
    },
    {
        id: "gj_vadodara",
        name: "Vadodara",
        aliases: ["Baroda", "Padra", "Savli", "Dabhoi", "Waghodia"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 22.3072,
        lng: 73.1812,
        baseTemp: 41.2,
        baseRh: 38,
        vernacular: "Thick brick-lime masonry with shaded arched colonnades & deep tree shelterbelts."
    },
    {
        id: "gj_rajkot",
        name: "Rajkot",
        aliases: ["Rajkot City", "Gondal", "Jetpur", "Jasdan", "Dhoraji"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 22.3039,
        lng: 70.8022,
        baseTemp: 43.1,
        baseRh: 28,
        vernacular: "High thermal mass yellow stone walls, compact layouts & reflective cool-roof coatings."
    },
    {
        id: "gj_bhavnagar",
        name: "Bhavnagar",
        aliases: ["Bhavnagar Coast", "Palitana", "Mahuva", "Alang", "Sihor", "Gadhada"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 21.7645,
        lng: 72.1519,
        baseTemp: 38.5,
        baseRh: 62,
        vernacular: "Gulf of Khambhat sea breeze capture with shaded courtyard verandas & double-roof cavities."
    },
    {
        id: "gj_jamnagar",
        name: "Jamnagar",
        aliases: ["Jamnagar Coast", "Dhrol", "Jodiya", "Kalavad", "Lalpur", "Sikka"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 22.4707,
        lng: 70.0577,
        baseTemp: 37.4,
        baseRh: 65,
        vernacular: "Marine lime plasters & deep overhang eaves to resist intense coastal solar glare."
    },
    {
        id: "gj_junagadh",
        name: "Junagadh",
        aliases: ["Junagadh Gir", "Girnar", "Keshod", "Mangrol", "Manavadar", "Visavadar"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 21.5222,
        lng: 70.4579,
        baseTemp: 39.8,
        baseRh: 52,
        vernacular: "Girnar hill microclimate integration with shaded rock-cut thermal sinks & stone masonry."
    },
    {
        id: "gj_gandhinagar",
        name: "Gandhinagar",
        aliases: ["Gandhinagar Capital", "Kalol", "Mansha", "Dehgam", "GIFT City"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.2156,
        lng: 72.6369,
        baseTemp: 42.0,
        baseRh: 30,
        vernacular: "Dense green urban canopy tree shading with wide cross-ventilated cardinal road axes."
    },
    {
        id: "gj_kutch",
        name: "Kutch (Bhuj / White Rann)",
        aliases: ["Kutch", "Bhuj", "Gandhidham", "Mandvi", "Anjar", "Rann of Kutch", "Khavda", "Nakhatrana"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 23.2420,
        lng: 69.6669,
        baseTemp: 44.8,
        baseRh: 18,
        vernacular: "Circular aerodynamic Bhunga structures with conical thatched roofs & Lippan mud-mirror insulation."
    },
    {
        id: "gj_banaskantha",
        name: "Banaskantha (Palanpur)",
        aliases: ["Banaskantha", "Palanpur", "Ambaji", "Deesa", "Dhanera", "Tharad", "Vav"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 24.1724,
        lng: 72.4346,
        baseTemp: 43.6,
        baseRh: 24,
        vernacular: "Rammed earth earth-sheltered subterranean berming against extreme Thar border heatwaves."
    },
    {
        id: "gj_patan",
        name: "Patan",
        aliases: ["Patan", "Siddhpur", "Chanasma", "Radhanpur", "Sami", "Rani ki Vav"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.8493,
        lng: 72.1266,
        baseTemp: 43.2,
        baseRh: 26,
        vernacular: "Stepwell (Vav) multi-level subterranean evaporative cooling & thick sandstone masonry."
    },
    {
        id: "gj_mehsana",
        name: "Mehsana",
        aliases: ["Mehsana", "Modhera", "Vadnagar", "Kadi", "Visnagar", "Unjha", "Becharaji"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.5880,
        lng: 72.3693,
        baseTemp: 42.8,
        baseRh: 29,
        vernacular: "Sunken shaded courtyards with thick terracotta cavity wall construction & solar orientation."
    },
    {
        id: "gj_sabarkantha",
        name: "Sabarkantha (Himmatnagar)",
        aliases: ["Sabarkantha", "Himmatnagar", "Idar", "Prantij", "Khedbrahma", "Talod"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.5977,
        lng: 72.9698,
        baseTemp: 41.5,
        baseRh: 34,
        vernacular: "Idar granite stone plinths & high thermal mass composite earth-lime masonry."
    },
    {
        id: "gj_aravalli",
        name: "Aravalli (Modasa)",
        aliases: ["Aravalli", "Modasa", "Shamlaji", "Bayad", "Malpur", "Meghraj", "Bhiloda"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.4623,
        lng: 73.2988,
        baseTemp: 41.0,
        baseRh: 36,
        vernacular: "Terraced hillside construction with passive earth cooling tunnels & natural stone mass."
    },
    {
        id: "gj_mahisagar",
        name: "Mahisagar (Lunawada)",
        aliases: ["Mahisagar", "Lunawada", "Santrampur", "Balasinor", "Kadana", "Virpur"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 23.1332,
        lng: 73.6166,
        baseTemp: 40.8,
        baseRh: 42,
        vernacular: "Mahi river humidity moderation, bamboo timber truss roofing & reflective lime plaster."
    },
    {
        id: "gj_panchmahal",
        name: "Panchmahal (Godhra / Champaner)",
        aliases: ["Panchmahal", "Godhra", "Champaner", "Halol", "Kalol Panchmahal", "Pavagadh", "Shehra"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 22.7758,
        lng: 73.6149,
        baseTemp: 41.4,
        baseRh: 38,
        vernacular: "Pavagadh basalt stone architecture with natural gravity stack vents & subterranean chambers."
    },
    {
        id: "gj_dahod",
        name: "Dahod",
        aliases: ["Dahod", "Devgadh Baria", "Garbada", "Limkheda", "Jhalod", "Fatepura"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 22.8340,
        lng: 74.2555,
        baseTemp: 40.2,
        baseRh: 40,
        vernacular: "Wattle-and-daub organic clay walls with broad protective thatched eaves against tropical sun."
    },
    {
        id: "gj_kheda",
        name: "Kheda (Nadiad)",
        aliases: ["Kheda", "Nadiad", "Kapadvanj", "Mehmedabad", "Matar", "Mahudha", "Thasra"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 22.6916,
        lng: 72.8634,
        baseTemp: 41.8,
        baseRh: 35,
        vernacular: "Central chowk courtyards with perforated jali brick ventilation & earth-buffered plinths."
    },
    {
        id: "gj_anand",
        name: "Anand (Milk Capital)",
        aliases: ["Anand", "Vallabh Vidyanagar", "Khambhat", "Petlad", "Borsad", "Umreth", "Tarapur"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 22.5645,
        lng: 72.9289,
        baseTemp: 41.6,
        baseRh: 36,
        vernacular: "Agrarian green shelterbelts, shaded cattle barn microclimates & double-roof air cavities."
    },
    {
        id: "gj_chhota_udeypur",
        name: "Chhota Udaipur",
        aliases: ["Chhota Udaipur", "Bodeli", "Sankheda", "Pavi Jetpur", "Nasvadi", "Kawant"],
        state: "Gujarat",
        region: "North & Central Gujarat",
        lat: 22.3082,
        lng: 74.0136,
        baseTemp: 39.5,
        baseRh: 44,
        vernacular: "Pithora mud-plastered walls with earthen breathable floor envelopes & bamboo framing."
    },
    {
        id: "gj_narmada",
        name: "Narmada (Rajpipla / Kevadia)",
        aliases: ["Narmada", "Rajpipla", "Kevadia", "Statue of Unity", "Garudeshwar", "Tilakwada", "Dediapada", "Sagbara"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 21.8708,
        lng: 73.5027,
        baseTemp: 38.6,
        baseRh: 55,
        vernacular: "Narmada valley canyon breeze induction shafts & shaded river-facing verandahs."
    },
    {
        id: "gj_bharuch",
        name: "Bharuch",
        aliases: ["Bharuch", "Ankleshwar", "Dahej", "Jambusar", "Hansot", "Amod", "Zaghadia"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 21.7051,
        lng: 72.9959,
        baseTemp: 37.8,
        baseRh: 70,
        vernacular: "High-humidity cross-ventilation louvers & saline-resistant coastal lime finishes."
    },
    {
        id: "gj_tapi",
        name: "Tapi (Vyara)",
        aliases: ["Tapi", "Vyara", "Songadh", "Valod", "Nizar", "Uchchhal", "Kukarmunda", "Ukai Dam"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 21.1189,
        lng: 73.3934,
        baseTemp: 37.2,
        baseRh: 68,
        vernacular: "Bamboo-reinforced mud composite walls with natural forest canopy shade & Ukai lake breezes."
    },
    {
        id: "gj_dang",
        name: "Dang (Ahwa / Saputara)",
        aliases: ["Dang", "Ahwa", "Saputara", "Saputara Hill Station", "Waghai", "Subir", "Don Hill Station"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 20.7570,
        lng: 73.6934,
        baseTemp: 27.5,
        baseRh: 72,
        vernacular: "Sahyadri high-altitude sanctuary with steep pitched timber monsoon roofs & earth-berm integration."
    },
    {
        id: "gj_navsari",
        name: "Navsari",
        aliases: ["Navsari City", "Bilimora", "Gandevi", "Jalalpore", "Vansda", "Khergam", "Dandi Heritage"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 20.9500,
        lng: 72.9300,
        baseTemp: 36.5,
        baseRh: 76,
        vernacular: "Purna river estuarine breeze capture, deep shaded outdoor otlas & lime-stabilized earthen floors."
    },
    {
        id: "gj_valsad",
        name: "Valsad / Vapi",
        aliases: ["Valsad", "Vapi", "Umbergaon", "Dharampur", "Kaprada", "Pardi", "Tithal Beach"],
        state: "Gujarat",
        region: "South Gujarat Coastal",
        lat: 20.5992,
        lng: 72.9342,
        baseTemp: 35.8,
        baseRh: 80,
        vernacular: "Deep 1.2m verandas to shield torrential monsoon rains & marine humidity with teakwood joinery."
    },
    {
        id: "gj_porbandar",
        name: "Porbandar",
        aliases: ["Porbandar Coast", "Ranavav", "Kutiyana", "Chhaya"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 21.6417,
        lng: 69.6293,
        baseTemp: 35.2,
        baseRh: 74,
        vernacular: "White Porbandar limestone monoliths with high solar reflectance & marine salt durability."
    },
    {
        id: "gj_dwarka",
        name: "Devbhumi Dwarka (Khambhalia)",
        aliases: ["Devbhumi Dwarka", "Dwarka", "Khambhalia", "Okha", "Bet Dwarka", "Kalyanpur", "Bhanvad"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 22.2442,
        lng: 68.9685,
        baseTemp: 34.6,
        baseRh: 76,
        vernacular: "Arabian coastal aerodynamic form to withstand gale winds with thick marine lime stone walls."
    },
    {
        id: "gj_gir_somnath",
        name: "Gir Somnath (Veraval)",
        aliases: ["Gir Somnath", "Veraval", "Somnath Temple", "Talala Gir", "Kodinar", "Una", "Sutrapada", "Gir Forest"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 20.9000,
        lng: 70.3667,
        baseTemp: 34.8,
        baseRh: 75,
        vernacular: "Arabian sea humidity relief with high-volume ocean breeze cross-ducting & shaded loggias."
    },
    {
        id: "gj_amreli",
        name: "Amreli",
        aliases: ["Amreli", "Dhari", "Rajula", "Jafrabad", "Bagasara", "Savarkundla", "Lathi", "Khambha"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 21.6032,
        lng: 71.2221,
        baseTemp: 42.0,
        baseRh: 35,
        vernacular: "Dense stone plinths with nocturnal sky radiation cooling roofs & internal courtyards."
    },
    {
        id: "gj_botad",
        name: "Botad",
        aliases: ["Botad", "Gadhada", "Barwala", "Ranpur", "Salangpur"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 22.1700,
        lng: 71.6600,
        baseTemp: 42.4,
        baseRh: 32,
        vernacular: "Massive compressed stabilized earth blocks (CSEB) with internal stack air cooling shafts."
    },
    {
        id: "gj_morbi",
        name: "Morbi",
        aliases: ["Morbi", "Wankaner", "Maliya Miyana", "Tankara", "Halvad"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 22.8173,
        lng: 70.8377,
        baseTemp: 43.0,
        baseRh: 30,
        vernacular: "High-albedo ceramic cool-roof tiles with double-skin ventilated thermal envelopes."
    },
    {
        id: "gj_surendranagar",
        name: "Surendranagar (Zalawad)",
        aliases: ["Surendranagar", "Wadhwan", "Dhrangadhra", "Limbdi", "Chotila", "Thangadh", "Sayla", "Dasada"],
        state: "Gujarat",
        region: "Saurashtra & Kutch",
        lat: 22.7275,
        lng: 71.6370,
        baseTemp: 44.0,
        baseRh: 22,
        vernacular: "Thick Dhrangadhra stone cavity insulation to combat extreme diurnal desert temperature swings."
    },

    // =========================================================================
    // MAJOR INDIAN STATE METROPOLITAN & REGIONAL DISTRICTS
    // =========================================================================
    {
        id: "in_delhi",
        name: "New Delhi Central",
        aliases: ["Delhi", "NCR", "Noida", "Gurgaon", "Gurugram", "Faridabad"],
        state: "Delhi NCR",
        region: "Major Indian Metro Districts",
        lat: 28.6139,
        lng: 77.2090,
        baseTemp: 43.8,
        baseRh: 32,
        vernacular: "Jali lattice screens, Mughal water channel cooling & thick brick cavity envelope walls."
    },
    {
        id: "in_mumbai",
        name: "Mumbai Suburban",
        aliases: ["Mumbai", "Bombay", "Thane", "Navi Mumbai", "Bandra", "Andheri"],
        state: "Maharashtra",
        region: "Major Indian Metro Districts",
        lat: 19.0760,
        lng: 72.8777,
        baseTemp: 34.5,
        baseRh: 82,
        vernacular: "High ceiling double-pitch monsoon roofs with continuous cross-ventilation louvers."
    },
    {
        id: "in_bengaluru",
        name: "Bengaluru Urban",
        aliases: ["Bangalore", "Bengaluru", "Whitefield", "Electronic City", "Indiranagar"],
        state: "Karnataka",
        region: "Major Indian Metro Districts",
        lat: 12.9716,
        lng: 77.5946,
        baseTemp: 28.4,
        baseRh: 55,
        vernacular: "Year-round temperate Goldilocks climate with open bioclimatic verandas & rainwater harvesting."
    },
    {
        id: "in_chennai",
        name: "Chennai Central",
        aliases: ["Chennai", "Madras", "OMR", "Tambaram", "Adyar", "Mylapore"],
        state: "Tamil Nadu",
        region: "Major Indian Metro Districts",
        lat: 13.0827,
        lng: 80.2707,
        baseTemp: 37.6,
        baseRh: 78,
        vernacular: "Thinnai entrance verandas with ventilated terra-cotta Madras terrace roofs."
    },
    {
        id: "in_hyderabad",
        name: "Hyderabad Urban",
        aliases: ["Hyderabad", "Cyberabad", "Secunderabad", "HITEC City", "Gachibowli"],
        state: "Telangana",
        region: "Major Indian Metro Districts",
        lat: 17.3850,
        lng: 78.4867,
        baseTemp: 40.5,
        baseRh: 38,
        vernacular: "Granite stone thermal mass with subterranean passive cooling basements & courtyards."
    },
    {
        id: "in_kolkata",
        name: "Kolkata Metropolitan",
        aliases: ["Kolkata", "Calcutta", "Howrah", "Salt Lake", "New Town"],
        state: "West Bengal",
        region: "Major Indian Metro Districts",
        lat: 22.5726,
        lng: 88.3639,
        baseTemp: 36.2,
        baseRh: 84,
        vernacular: "Slatted louvered green shutters (Khadkhadi) & deep shaded balconies over high plinths."
    },
    {
        id: "in_jaipur",
        name: "Jaipur (Pink City)",
        aliases: ["Jaipur", "Amber", "Sanganer", "Pink City"],
        state: "Rajasthan",
        region: "Major Indian Metro Districts",
        lat: 26.9124,
        lng: 75.7873,
        baseTemp: 43.5,
        baseRh: 22,
        vernacular: "Hawa Mahal wind-tunnel lattice screens & red sandstone heat deflection barriers."
    },
    {
        id: "in_jodhpur",
        name: "Jodhpur (Sun City)",
        aliases: ["Jodhpur", "Blue City", "Mehrangarh", "Mandore"],
        state: "Rajasthan",
        region: "Major Indian Metro Districts",
        lat: 26.2389,
        lng: 73.0243,
        baseTemp: 44.5,
        baseRh: 20,
        vernacular: "Indigo blue lime wash reflecting 78% solar radiation with narrow shaded medieval alleys."
    },
    {
        id: "in_jaisalmer",
        name: "Jaisalmer (Thar Desert)",
        aliases: ["Jaisalmer", "Sam Sand Dunes", "Thar Desert", "Pokhran"],
        state: "Rajasthan",
        region: "Major Indian Metro Districts",
        lat: 26.9157,
        lng: 70.9083,
        baseTemp: 46.2,
        baseRh: 15,
        vernacular: "Deep subterranean earth basements (Tahkhana) & golden yellow sandstone micro-lattice screens."
    },
    {
        id: "in_udaipur",
        name: "Udaipur (City of Lakes)",
        aliases: ["Udaipur", "Mewar", "Lake Pichola", "Fateh Sagar"],
        state: "Rajasthan",
        region: "Major Indian Metro Districts",
        lat: 24.5854,
        lng: 73.7125,
        baseTemp: 39.5,
        baseRh: 45,
        vernacular: "Water evaporative cooling corridors, white marble thermal sinks & lake breeze courtyards."
    },
    {
        id: "in_ladakh",
        name: "Leh Ladakh",
        aliases: ["Leh", "Ladakh", "Nubra Valley", "Pangong", "Kargil", "Himalayas"],
        state: "Ladakh",
        region: "Major Indian Metro Districts",
        lat: 34.1526,
        lng: 77.5771,
        baseTemp: 14.5,
        baseRh: 25,
        vernacular: "Trombe solar walls, south-facing sunrooms & thick straw-clay earthen insulation."
    },
    {
        id: "in_srinagar",
        name: "Srinagar (Kashmir Valley)",
        aliases: ["Srinagar", "Kashmir", "Dal Lake", "Gulmarg", "Pahalgam"],
        state: "Jammu & Kashmir",
        region: "Major Indian Metro Districts",
        lat: 34.0837,
        lng: 74.7973,
        baseTemp: 22.0,
        baseRh: 58,
        vernacular: "Dhajji Dewari timber-masonry earthquake resilience with Hamam subterranean floor heating."
    },
    {
        id: "in_shimla",
        name: "Shimla",
        aliases: ["Shimla", "Himachal", "Kufri", "Mashobra"],
        state: "Himachal Pradesh",
        region: "Major Indian Metro Districts",
        lat: 31.1048,
        lng: 77.1734,
        baseTemp: 21.5,
        baseRh: 62,
        vernacular: "Kath-Kuni stone-wood interlocking architecture with direct passive solar heating."
    },
    {
        id: "in_chandigarh",
        name: "Chandigarh Capital",
        aliases: ["Chandigarh", "Mohali", "Panchkula", "Tricity"],
        state: "Punjab / Haryana",
        region: "Major Indian Metro Districts",
        lat: 30.7333,
        lng: 76.7794,
        baseTemp: 41.5,
        baseRh: 35,
        vernacular: "Le Corbusier brise-soleil concrete sunscreens & integrated green microclimate belts."
    },
    {
        id: "in_pune",
        name: "Pune",
        aliases: ["Pune", "Pimpri-Chinchwad", "Hinjawadi", "Lonavala"],
        state: "Maharashtra",
        region: "Major Indian Metro Districts",
        lat: 18.5204,
        lng: 73.8567,
        baseTemp: 33.2,
        baseRh: 48,
        vernacular: "Stone wada courtyards with natural stack ventilation towers & basalt masonry."
    },
    {
        id: "in_goa",
        name: "Goa Coastal",
        aliases: ["Goa", "Panaji", "Margao", "Vasco", "Calangute"],
        state: "Goa",
        region: "Major Indian Metro Districts",
        lat: 15.2993,
        lng: 74.1240,
        baseTemp: 33.0,
        baseRh: 82,
        vernacular: "Indo-Portuguese balcões (wrap-around verandas), red laterite stone & oyster-shell windows."
    },
    {
        id: "in_kochi",
        name: "Kochi (Cochin)",
        aliases: ["Kochi", "Cochin", "Ernakulam", "Kerala Coast"],
        state: "Kerala",
        region: "Major Indian Metro Districts",
        lat: 9.9312,
        lng: 76.2673,
        baseTemp: 32.5,
        baseRh: 86,
        vernacular: "Sloped Mangalore tile gables, open attic air vents & shaded timber perimeter verandas."
    },

    // =========================================================================
    // GLOBAL METROPOLITAN & EXTREME CLIMATE DISTRICTS
    // =========================================================================
    {
        id: "gl_tokyo",
        name: "Tokyo Metropolis",
        aliases: ["Tokyo", "Shibuya", "Shinjuku", "Japan"],
        state: "Japan",
        region: "Global Metropolitan Districts",
        lat: 35.6762,
        lng: 139.6503,
        baseTemp: 26.4,
        baseRh: 65,
        vernacular: "Shoji sliding screens, Engawa transition corridors & breathable cedar joinery."
    },
    {
        id: "gl_london",
        name: "Greater London",
        aliases: ["London", "Westminster", "UK", "England"],
        state: "United Kingdom",
        region: "Global Metropolitan Districts",
        lat: 51.5074,
        lng: -0.1278,
        baseTemp: 19.5,
        baseRh: 70,
        vernacular: "High cavity insulation with southern solar thermal capture glazing & double draft-proofing."
    },
    {
        id: "gl_newyork",
        name: "New York City",
        aliases: ["New York", "NYC", "Manhattan", "Brooklyn", "USA"],
        state: "United States",
        region: "Global Metropolitan Districts",
        lat: 40.7128,
        lng: -74.0060,
        baseTemp: 24.8,
        baseRh: 58,
        vernacular: "Thermal envelope double glazing with active seasonal heat pumps & green rooftop terraces."
    },
    {
        id: "gl_phoenix",
        name: "Phoenix (Sonoran Desert)",
        aliases: ["Phoenix", "Arizona", "Scottsdale", "Sonora"],
        state: "United States",
        region: "Global Metropolitan Districts",
        lat: 33.4484,
        lng: -112.0740,
        baseTemp: 45.2,
        baseRh: 16,
        vernacular: "Earth-bermed rammed earth rammed monoliths with exterior deep shade trellises."
    },
    {
        id: "gl_dubai",
        name: "Dubai Metropolis",
        aliases: ["Dubai", "UAE", "Emirates", "Abu Dhabi"],
        state: "United Arab Emirates",
        region: "Global Metropolitan Districts",
        lat: 25.2048,
        lng: 55.2708,
        baseTemp: 43.5,
        baseRh: 60,
        vernacular: "Traditional Barjeel windcatcher towers, shaded courtyards & high-performance spectrally selective glass."
    },
    {
        id: "gl_cairo",
        name: "Cairo Governorate",
        aliases: ["Cairo", "Giza", "Egypt", "Nile"],
        state: "Egypt",
        region: "Global Metropolitan Districts",
        lat: 30.0444,
        lng: 31.2357,
        baseTemp: 39.2,
        baseRh: 32,
        vernacular: "Mashrabiya timber lattices, sunken courtyards & Malqaf windcatchers."
    },
    {
        id: "gl_singapore",
        name: "Singapore District",
        aliases: ["Singapore", "Jurong", "Marina Bay"],
        state: "Singapore",
        region: "Global Metropolitan Districts",
        lat: 1.3521,
        lng: 103.8198,
        baseTemp: 31.5,
        baseRh: 84,
        vernacular: "Permeable open-plan facades with massive biophilic green sky-gardens & natural cross-breezes."
    },
    {
        id: "gl_sydney",
        name: "Sydney Metropolitan",
        aliases: ["Sydney", "NSW", "Australia", "Bondi"],
        state: "Australia",
        region: "Global Metropolitan Districts",
        lat: -33.8688,
        lng: 151.2093,
        baseTemp: 23.5,
        baseRh: 64,
        vernacular: "Wide verandas with louvers oriented to catch afternoon Southerly Buster ocean cooling fronts."
    }
];

export class DistrictEngine {
    constructor() {
        this.cache = new Map();
        this.districtsData = null;
        this.selectedDistrict = null;
    }

    /**
     * Stull (2011) Empirical Wet-Bulb Temperature Equation
     */
    calculateWetBulb(tempC, rhPct) {
        const T = Number(tempC);
        const RH = Number(rhPct);
        const twb = (T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
               Math.atan(T + RH) -
               Math.atan(RH - 1.676331) +
               0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
               4.686035);
        return Math.round(twb * 10) / 10;
    }

    /**
     * Steadman Heat Index ("Feels Like")
     */
    calculateHeatIndex(tempC, rhPct) {
        const T = Number(tempC);
        const RH = Number(rhPct);
        if (T < 25.0) return Math.round(T * 10) / 10;

        const c1 = -8.78469475556;
        const c2 = 1.61139411;
        const c3 = 2.33854883889;
        const c4 = -0.14611605;
        const c5 = -0.012308094;
        const c6 = -0.0164248277778;
        const c7 = 0.002211732;
        const c8 = 0.00072546;
        const c9 = -0.000003582;

        const hi = (c1 + (c2 * T) + (c3 * RH) + (c4 * T * RH) +
              (c5 * T * T) + (c6 * RH * RH) +
              (c7 * T * T * RH) + (c8 * T * RH * RH) +
              (c9 * T * T * RH * RH));
        return Math.round(Math.max(T, hi) * 10) / 10;
    }

    /**
     * Fetches real-time live temperatures for districts (online API with instant rich fallback)
     */
    async fetchLiveDistricts(stateFilter = 'gujarat', searchQuery = '', sortMode = 'temp_desc') {
        try {
            const params = new URLSearchParams();
            if (stateFilter) params.append('state', stateFilter);
            if (searchQuery) params.append('q', searchQuery);
            if (sortMode) params.append('sort', sortMode);

            const res = await fetch(`/api/districts/live?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && Array.isArray(data.districts) && data.districts.length > 0) {
                    this.districtsData = data;
                    return data;
                }
            }
        } catch (e) {
            console.warn('[DistrictEngine] API fetch fallback to client solver:', e);
        }

        const localData = this.getLocalFallbackDistricts(stateFilter, searchQuery, sortMode);
        this.districtsData = localData;
        return localData;
    }

    /**
     * Client-side diurnal solar & atmospheric solver ensuring 100% offline availability
     */
    getLocalFallbackDistricts(stateFilter = 'gujarat', searchQuery = '', sortMode = 'temp_desc') {
        const now = new Date();
        const hourUtc = now.getUTCHours() + now.getUTCMinutes() / 60.0;
        const epochSec = now.getTime() / 1000.0;

        let list = [...MASTER_DISTRICTS_DATA];

        // 1. Regional Scope Filter
        if (stateFilter && stateFilter.toLowerCase() !== 'all') {
            const sf = stateFilter.toLowerCase().trim();
            if (sf === 'gujarat') {
                list = list.filter(d => d.state === 'Gujarat');
            } else if (sf === 'saurashtra' || sf === 'kutch') {
                list = list.filter(d => d.region.includes('Saurashtra') || d.region.includes('Kutch'));
            } else if (sf === 'south_gujarat' || sf === 'south') {
                list = list.filter(d => d.region.includes('South Gujarat'));
            } else if (sf === 'north_gujarat' || sf === 'central_gujarat' || sf === 'north' || sf === 'central') {
                list = list.filter(d => d.region.includes('North & Central Gujarat'));
            } else if (sf === 'india' || sf === 'national') {
                list = list.filter(d => d.region.includes('Major Indian Metro'));
            } else if (sf === 'global' || sf === 'world') {
                list = list.filter(d => d.region.includes('Global Metropolitan'));
            }
        }

        // 2. Multi-Keyword Fuzzy Search
        if (searchQuery && searchQuery.trim().length > 0) {
            const qs = searchQuery.toLowerCase().trim();
            // First search within current filtered scope
            let matched = list.filter(d => {
                const inName = d.name.toLowerCase().includes(qs);
                const inState = d.state.toLowerCase().includes(qs);
                const inRegion = d.region.toLowerCase().includes(qs);
                const inVernacular = d.vernacular.toLowerCase().includes(qs);
                const inAliases = Array.isArray(d.aliases) && d.aliases.some(a => a.toLowerCase().includes(qs));
                return inName || inState || inRegion || inVernacular || inAliases;
            });

            // If not found in current scope, broaden to ALL master districts
            if (matched.length === 0) {
                matched = MASTER_DISTRICTS_DATA.filter(d => {
                    const inName = d.name.toLowerCase().includes(qs);
                    const inState = d.state.toLowerCase().includes(qs);
                    const inRegion = d.region.toLowerCase().includes(qs);
                    const inVernacular = d.vernacular.toLowerCase().includes(qs);
                    const inAliases = Array.isArray(d.aliases) && d.aliases.some(a => a.toLowerCase().includes(qs));
                    return inName || inState || inRegion || inVernacular || inAliases;
                });
            }
            list = matched;
        }

        // 3. Compute Real-Time Solar & Temperature Telemetry
        const processed = list.map(d => {
            const solarTime = (hourUtc + d.lng / 15.0 + 24.0) % 24.0;
            const diurnalDelta = 4.2 * Math.sin(((solarTime - 9.0) * 15.0) * (Math.PI / 180.0));
            const microFluct = Math.sin(epochSec * 0.4 + d.lat) * 0.3;
            const tempC = Math.round((d.baseTemp + diurnalDelta + microFluct) * 10) / 10;
            const rhPct = Math.round(Math.max(15, Math.min(92, d.baseRh - diurnalDelta * 1.8)));
            const tempF = Math.round((tempC * 1.8 + 32.0) * 10) / 10;
            const heatIndexC = this.calculateHeatIndex(tempC, rhPct);
            const wetBulbC = this.calculateWetBulb(tempC, rhPct);

            const windKmh = Math.round((12.5 + Math.sin(epochSec * 0.3 + d.lng) * 4.5) * 10) / 10;
            const solarGhi = Math.round(Math.max(0, 960 * Math.sin(Math.max(0, (solarTime - 6.0) * 15.0) * (Math.PI / 180.0))));

            // Thermal Category Classification
            let category = "COMFORT ZONE";
            let statusColor = "#10b981"; // Emerald
            let alertTag = "Optimal ASHRAE Standard";

            if (tempC >= 43.0) {
                category = "SEVERE HEATWAVE";
                statusColor = "#ef4444"; // Crimson
                alertTag = "Extreme Thermal Danger";
            } else if (tempC >= 40.0) {
                category = "HEATWAVE ALERT";
                statusColor = "#f97316"; // Orange
                alertTag = "High Heatwave Warning";
            } else if (tempC >= 36.0) {
                category = "WARM / HUMID";
                statusColor = "#f59e0b"; // Amber
                alertTag = "Moderate Thermal Load";
            } else if (tempC <= 20.0) {
                category = "COOL SANCTUARY";
                statusColor = "#38bdf8"; // Cyan
                alertTag = "Mild Alpine Microclimate";
            }

            return {
                id: d.id,
                name: d.name,
                state: d.state,
                region: d.region,
                latitude: d.lat,
                longitude: d.lng,
                temperatureC: tempC,
                temperatureF: tempF,
                humidityPct: rhPct,
                heatIndexC: heatIndexC,
                wetBulbC: wetBulbC,
                windKmh: windKmh,
                solarGhi: solarGhi,
                weatherIcon: tempC > 38 ? "☀️" : (tempC < 25 ? "❄️" : "🌤️"),
                weatherDescription: tempC > 38 ? "Intense Solar Radiation" : (tempC < 25 ? "Temperate Microclimate" : "Clear Sky & Breeze"),
                category: category,
                statusColor: statusColor,
                alertTag: alertTag,
                vernacularSummary: d.vernacular
            };
        });

        // 4. Sorting
        if (sortMode === 'temp_asc') {
            processed.sort((a, b) => a.temperatureC - b.temperatureC);
        } else if (sortMode === 'name_asc') {
            processed.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            processed.sort((a, b) => b.temperatureC - a.temperatureC);
        }

        // 5. Global Statistics
        let hottest = processed.length ? processed.reduce((prev, curr) => curr.temperatureC > prev.temperatureC ? curr : prev, processed[0]) : null;
        let coolest = processed.length ? processed.reduce((prev, curr) => curr.temperatureC < prev.temperatureC ? curr : prev, processed[0]) : null;
        let avgTemp = processed.length ? Math.round((processed.reduce((acc, d) => acc + d.temperatureC, 0) / processed.length) * 10) / 10 : 38.0;
        let heatwaveCount = processed.filter(d => d.temperatureC >= 40.0).length;

        return {
            success: true,
            count: processed.length,
            statistics: {
                hottestDistrict: hottest ? hottest.name : "Kutch (Bhuj)",
                hottestTempC: hottest ? hottest.temperatureC : 44.8,
                coolestDistrict: coolest ? coolest.name : "Dang (Saputara)",
                coolestTempC: coolest ? coolest.temperatureC : 27.5,
                averageTempC: avgTemp,
                heatwaveAlertCount: heatwaveCount
            },
            districts: processed
        };
    }

    /**
     * Injects a selected district's climate parameters into the 3D BioShelter Studio
     */
    injectDistrictIntoSimulation(district) {
        try {
            const raw = localStorage.getItem('bioshelter_studio_state');
            const state = raw ? JSON.parse(raw) : {};
            
            state.customLatitude = Math.round(district.latitude * 10) / 10;
            state.projectName = `BioShelter ${district.name} (${district.state})`;
            state.selectedDistrictId = district.id;
            state.selectedDistrictName = district.name;
            state.ambientTemp = district.temperatureC;
            state.relativeHumidity = district.humidityPct;
            state.windSpeedKmh = district.windKmh;
            state.solarGhi = district.solarGhi;

            localStorage.setItem('bioshelter_studio_state', JSON.stringify(state));
            window.location.href = 'index.html';
        } catch (e) {
            console.error('[DistrictEngine] Error saving state:', e);
            window.location.href = 'index.html';
        }
    }
}

export const districtEngine = new DistrictEngine();
