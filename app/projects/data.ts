export interface ProjectGalleryImage {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'wide';
}

export interface ProjectDetail {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  location: string;
  area: string;
  client?: string;
  leadArchitects?: string;
  photography: string;
  awards?: string[];
  heroImage: string;
  summary: string;
  narrative: {
    heading: string;
    paragraphs: string[];
  }[];
  gallery: ProjectGalleryImage[];
}

export const PROJECTS_DATA: ProjectDetail[] = [
  {
    slug: "HAVEN",
    title: "HAVEN",
    subtitle: "A quiet residential refuge anchored by laterite and filtered daylight.",
    category: "Architecture & Interiors",
    year: "2025",
    location: "Kannur, Kerala, India",
    area: "3,263 sqft",
    leadArchitects: "Hafeez & Arjun",
    photography: "Abhimanyu KV",
    awards: ["Vanitha Veedu Architectural Awards 2026 - Silver: Category Residential Interior"],
    heroImage: "/projects/HAVEN/1-opt.jpg",
    summary:
      "HAVEN reflects the firm’s core design philosophy of simplicity and material restraint, expressed through a quiet palette of regional laterite, cement plaster, and honest minimal finishes.",
    narrative: [
      {
        heading: "Site Dialogue & Form",
        paragraphs: [
          "Conceived as a linear volume on an elevated site, the design deliberately resists dominating its natural context. Instead, it integrates an endemic laterite wall that serves simultaneously as compound boundary and building skin along the eastern edge, silently anchoring the communal living zones.",
          "Approached from the south, the house presents an earthy, grounded character with a sloping tiled roof that subtly references traditional vernacular typologies. A floating sit-out with tropical planting and a simple wooden bench offers a calm threshold, while layered floor planes extend into a porch terrace framing panoramic valley views."
        ]
      },
      {
        heading: "Spatial Choreography & Light",
        paragraphs: [
          "Inside, spaces unfold linearly—living and dining flow seamlessly into an expanded kitchen, while private bedrooms branch off to the west, buffered by a family lounge and sculptural staircase. The layout remains open yet selectively screened for privacy.",
          "Natural ventilation and filtered daylight animate the interiors through calibrated apertures and the perforated laterite envelope, allowing the home to engage its tropical setting with quiet sensitivity and climatic responsiveness."
        ]
      }
    ],
    gallery: [
      {
        src: "/projects/HAVEN/3-opt.jpg",
        alt: "HAVEN - Entrance threshold and tropical landscaping",
        caption: "Floating threshold with indigenous tropical flora framing the arrival sequence.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/HAVEN/8-opt.jpg",
        alt: "HAVEN - Vernacular sloping roofline and laterite masonry",
        caption: "Sloping clay-tiled roofline designed for torrential monsoon runoff.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/HAVEN/19-opt.jpg",
        alt: "HAVEN - Double height interior living court",
        caption: "Double-height central living court washing spaces in soft daylight.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/HAVEN/21-opt.jpg",
        alt: "HAVEN - Perforated laterite masonry screen",
        caption: "Perforated laterite jali modulating sunlight and ambient air breeze.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/HAVEN/27-opt.jpg",
        alt: "HAVEN - Minimal interior finishes and shadow play",
        caption: "Textural contrast between rough stone and hand-troweled lime plaster.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/HAVEN/35-opt.jpg",
        alt: "HAVEN - Evening perspective and illuminated volumes",
        caption: "Dusk perspective showing the glowing interior volumes against the landscape.",
        aspectRatio: "wide"
      }
    ]
  },
  {
    slug: "MAUSAM_THE_HOUSE_OF_SEASONS",
    title: "Mausam — The House of Seasons",
    subtitle: "A contour-hugging home evolving with the rhythms of Kerala’s seasons.",
    category: "Residential Architecture",
    year: "2024",
    location: "Mannarkkad, Kozhikode, Kerala, India",
    area: "4,100 sqft",
    leadArchitects: "Hafeez & Arjun",
    photography: "Hamid MM",
    awards: ["The Merit List 2018-19 Citation", "National Award Commendation"],
    heroImage: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg",
    summary:
      "Conceived as a response to the growing misconception that good architecture must appear expensive, the house reclaims simplicity, climatic responsiveness, and vernacular sensibilities within a sloping rubber plantation.",
    narrative: [
      {
        heading: "Contour-Responsive Architecture",
        paragraphs: [
          "Designed for a retired army officer and his family, the home effortlessly adapts between intimate living for two and larger multi-generational family gatherings. Spaces are arranged along the natural ground contour in three split levels, interconnected by a central stair with flexible common living areas.",
          "By nestling into the earth rather than clearing the terrain, the house preserves existing plantation slopes and allows natural subterranean cooling to temper interior microclimates throughout scorching summer months."
        ]
      },
      {
        heading: "Material Truth & Microclimates",
        paragraphs: [
          "Vernacular materials—laterite stone, terracotta tiles, and reclaimed timber—along with porous masonry jalis ensure thermal comfort, cross-ventilation, and dynamic dappled light.",
          "Blending into its lush topography, the house evolves with the seasons—refreshingly cool during hot pre-monsoon months, expressive and sheltering in heavy rains, and quietly alive through shifting light and mountain breeze."
        ]
      }
    ],
    gallery: [
      {
        src: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_1-opt.jpg",
        alt: "Mausam - Slope integration and exterior volume",
        caption: "Split-level volume nestled along the natural slope of the rubber plantation.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_11-opt.jpg",
        alt: "Mausam - Terracotta jali screen and light interplay",
        caption: "Perforated brickwork jali framing light and screening afternoon sun.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg",
        alt: "Mausam - Central staircase connecting split levels",
        caption: "Central stair linking intimate split levels across the interior core.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_26-opt.jpg",
        alt: "Mausam - Unfinished laterite blockwork detail",
        caption: "Raw regional laterite laid in honest masonry bond.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_38-opt.jpg",
        alt: "Mausam - Courtyard and rainwater catchment aperture",
        caption: "Internal court allowing seasonal rainfall to bring scent and sound inside.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_42-opt.jpg",
        alt: "Mausam - Deep verandah and exterior shelter",
        caption: "Generous roof overhangs shielding living spaces from tropical glare.",
        aspectRatio: "wide"
      }
    ]
  },
  {
    slug: "RESIDENCE_AT_EDAVANNA",
    title: "Residence at Edavanna",
    subtitle: "A humble family home designed for meaningful ecological life and community roots.",
    category: "Residential Architecture",
    year: "2024",
    location: "Edavanna, Malappuram, Kerala, India",
    area: "3,014 sqft",
    client: "Mr. Ashiq & Mrs. Sibla",
    leadArchitects: "Hafeez & Arjun",
    photography: "Edwin James",
    awards: ["IIA Kerala State Awards for Excellence in Architecture Citation"],
    heroImage: "/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg",
    summary:
      "Set within a landscape reminiscent of 1980s Kerala homes, the residence sits at the heart of a generous plot, prioritizing gardens, kitchen cultivation, and ecological grounding beyond ornamentation.",
    narrative: [
      {
        heading: "Ground-Oriented Living",
        paragraphs: [
          "Evoking the quiet charm of traditional Kerala domestic life, the house is designed for a young family choosing to live close to their ancestral roots. Positioned away from property boundaries, the plan is largely ground-oriented, with essential living spaces below and minimal private sanctuaries above.",
          "The layout organizes along an axial spine, with courtyards and transition passages dividing the home into zones of varying privacy while preserving seamless visual connections across garden patches."
        ]
      },
      {
        heading: "Courtyards & Material Honesty",
        paragraphs: [
          "Internal courtyards introduce gentle daylight, cooling airflow, and moments of contemplation. The restrained palette of unplastered brick, board-formed concrete, and native hardwood reinforces a humble character tailored to everyday life.",
          "Over time, tropical rains and organic patina will embed the home deeper into its verdant setting, creating a dwelling that ages with grace and dignity."
        ]
      }
    ],
    gallery: [
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q2-opt.jpg",
        alt: "Residence at Edavanna - Central courtyard and lush greenery",
        caption: "Garden interface creating a calm, sheltered microclimate.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q8-opt.jpg",
        alt: "Residence at Edavanna - Axial circulation corridor",
        caption: "Axial circulation connecting internal courts with family living spaces.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q12-opt.jpg",
        alt: "Residence at Edavanna - Board formed concrete and masonry",
        caption: "Board-formed concrete elements framing honest brick surfaces.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
        alt: "Residence at Edavanna - Overhanging eaves and roof profile",
        caption: "Deep overhanging eaves inspired by traditional Kerala tharavadu.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q21-opt.jpg",
        alt: "Residence at Edavanna - Cross-ventilated living area",
        caption: "Living room oriented to receive continuous cross-ventilation breezes.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q26-opt.jpg",
        alt: "Residence at Edavanna - Twilight perspective among trees",
        caption: "Evening silhouette quietly resting within the canopy of coconut palms.",
        aspectRatio: "wide"
      }
    ]
  },
  {
    slug: "SCREEN_THE_LANTERN_HOUSE",
    title: "Screen: The Lantern House",
    subtitle: "A glowing perforated residential screen that harmonizes privacy and openness.",
    category: "Residential Architecture",
    year: "2023 - 2024",
    location: "Tirur, Malappuram, Kerala, India",
    area: "3,500 sqft",
    leadArchitects: "Hafeez & Arjun",
    photography: "Abhimanyu KV",
    awards: [
      "Vanitha Veedu Architectural Awards 2024 - Silver: Category Residential",
      "IIID Kerala Regional Chapter Awards 2023 - Runner up: Category Residential",
      "IIA Kerala State Awards for Excellence in Architecture 2023 - Commendation"
    ],
    heroImage: "/projects/HAVEN/28-opt.jpg",
    summary:
      "A celebration of perforated masonry screens and internal courtyards, designed to offer sanctuary and microclimatic passive cooling in a tightly packed urban neighborhood.",
    narrative: [
      {
        heading: "The Perforated Screen",
        paragraphs: [
          "Located in an active neighborhood in Tirur, the Lantern House negotiates the tension between urban exposure and domestic intimacy. The primary facade is wrapped in a perforated tectonic screen that acts as an environmental filter.",
          "During the day, the screen breaks harsh tropical sunlight into delicate dappled shadows, while at night, internal lights transform the residence into a warm, glowing lantern on the street."
        ]
      },
      {
        heading: "Courtyard Core",
        paragraphs: [
          "Internally, all social spaces wrap around an open-to-sky courtyard. The stack effect created by this central void pulls fresh air continuously through the lower living areas, exhausting heat through upper clerestories.",
          "The restrained palette of polished concrete floors, lime-washed walls, and teak wood details imparts a quiet, contemplative atmosphere throughout."
        ]
      }
    ],
    gallery: [
      {
        src: "/projects/HAVEN/28-opt.jpg",
        alt: "The Lantern House - Perforated screen elevation at dusk",
        caption: "The perforated masonry envelope illuminating like a lantern at dusk.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/HAVEN/35-opt.jpg",
        alt: "The Lantern House - Dynamic shadow play across concrete",
        caption: "Geometric brick jali casting shifting shadow art across the floor.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/HAVEN/19-opt.jpg",
        alt: "The Lantern House - Central courtyard atrium",
        caption: "Open-to-sky central courtyard atrium promoting natural passive cooling.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/HAVEN/21-opt.jpg",
        alt: "The Lantern House - Transition corridor and screened openings",
        caption: "Circulation corridors buffered from external noise by textured screens.",
        aspectRatio: "landscape"
      }
    ]
  },
  {
    slug: "KADALAS_THE_SEA_VIEW_CAFE",
    title: "Kadalas - The Sea View Cafe",
    subtitle: "A beachfront hospitality space framed by panoramic sea vistas and maritime craft.",
    category: "Hospitality & Leisure Interiors",
    year: "2019 - 2023",
    location: "South Beach, Calicut, Kerala, India",
    area: "1,800 sqft",
    leadArchitects: "Hafeez & Arjun",
    photography: "Prasanth Mohan",
    awards: [
      "Forbes India Design Awards 2019 - 'Best Retail & Hospitality Interiors' Commendation",
      "IID Design Excellence Awards 2019 - Winner Zone 1 (Leisure & Entertainment)",
      "IIA Kerala State Awards for Excellence in Architecture 2021 - Commendation"
    ],
    heroImage: "/projects/HAVEN/6-opt.jpg",
    summary:
      "A sensory culinary destination perched along Calicut’s historic coastline, celebrating maritime materials, raw wood, and unobstructed horizons over the Arabian Sea.",
    narrative: [
      {
        heading: "Coastal Architecture & Memory",
        paragraphs: [
          "Calicut's South Beach has a centuries-old maritime history of trade, seafaring, and spice culture. Kadalas was envisioned as a light, non-intrusive coastal pavilion that pays homage to traditional boat-building craft.",
          "Constructed with reclaimed boat timber, exposed steel, and weathered stone, the cafe allows salty ocean breezes to filter freely through the open seating terraces."
        ]
      },
      {
        heading: "Immersive Seaward Vistas",
        paragraphs: [
          "The dining layout steps down toward the water, giving every table an uninterrupted frame of crashing waves and sunsets over the Arabian Sea.",
          "Minimalist ambient lighting and acoustic damping ensure the sound of the ocean remains the primary soundtrack of the dining experience."
        ]
      }
    ],
    gallery: [
      {
        src: "/projects/HAVEN/6-opt.jpg",
        alt: "Kadalas - Panoramic beachfront dining deck",
        caption: "Open beachfront dining deck framing dramatic sunsets over the Arabian Sea.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/HAVEN/1-opt.jpg",
        alt: "Kadalas - Reclaimed timber and coastal joinery",
        caption: "Reclaimed wooden joinery inspired by traditional Malabar boat craftsmanship.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/HAVEN/3-opt.jpg",
        alt: "Kadalas - Ocean breeze interface and sheltered seating",
        caption: "Sheltered seating pavilion designed for open cross-ventilation.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/HAVEN/8-opt.jpg",
        alt: "Kadalas - Evening ambient lighting and atmosphere",
        caption: "Warm evening glow harmonizing with the natural sound of breaking tides.",
        aspectRatio: "landscape"
      }
    ]
  },
  {
    slug: "REVIVING_THE_SPIRIT_OF_A_PLACE",
    title: "Reviving The Spirit of A Place",
    subtitle: "Story of an Abandoned Laterite Quarry restored into a thriving ecological sanctuary.",
    category: "Landscape & Ecological Design",
    year: "2020 - 2022",
    location: "Malappuram, Kerala, India",
    area: "12 Acres",
    leadArchitects: "Hafeez & Arjun",
    photography: "Edwin James",
    awards: [
      "Kohler Bold Design Awards 2022 - Winner: Category Landscape Design",
      "IIA Kerala State Awards for Excellence in Architecture 2021 - Gold Leaf: Category Landscape",
      "IIA National Awards for Excellence in Architecture 2020 - Shortlisted"
    ],
    heroImage: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
    summary:
      "A benchmark regenerative landscape project transforming a degraded, abandoned laterite stone quarry into a biodiverse ecological sanctuary with water catchment reservoirs.",
    narrative: [
      {
        heading: "Regenerating Scarred Landscapes",
        paragraphs: [
          "Decades of uncontrolled open-cast quarrying had left the 12-acre site barren, eroded, and stripped of topsoil. Zero Studio approached the intervention not as building on land, but as healing geological trauma.",
          "By surveying rainwater flow patterns and natural contours, the excavation pits were sculpted into cascading retention reservoirs that collect monsoon runoff and replenish regional groundwater tables."
        ]
      },
      {
        heading: "Ecological Succession & Honest Pavilions",
        paragraphs: [
          "Native endemic flora, drought-resistant grasses, and wetland reed-beds were introduced to stabilize slopes and invite indigenous birds, butterflies, and amphibians back to the terrain.",
          "Minimalist stone steps and unembellished laterite pavilions provide human visitors with quiet contemplative paths through the regenerated wilderness without disrupting the fragile new ecology."
        ]
      }
    ],
    gallery: [
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
        alt: "Reviving The Spirit of A Place - Restored laterite quarry terrain",
        caption: "Sculpted stone terraces retaining water and transforming barren rock into a living wetland.",
        aspectRatio: "landscape"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q2-opt.jpg",
        alt: "Reviving The Spirit of A Place - Native vegetation and water bodies",
        caption: "Regenerated endemic forest canopy cradling monsoon water catchment ponds.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q24-opt.jpg",
        alt: "Reviving The Spirit of A Place - Contemplative stone pathways",
        caption: "Minimalist stone walkways harmonizing with natural geological formations.",
        aspectRatio: "portrait"
      },
      {
        src: "/projects/RESIDENCE_AT_EDAVANNA/Q8-opt.jpg",
        alt: "Reviving The Spirit of A Place - Ecological restoration panoramic",
        caption: "Panoramic vista of the 12-acre restored sanctuary thriving with biodiversity.",
        aspectRatio: "wide"
      }
    ]
  }
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECTS_DATA.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllProjects(): ProjectDetail[] {
  return PROJECTS_DATA;
}
