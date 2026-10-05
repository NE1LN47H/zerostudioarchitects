export interface ArticleContent {
  intro: string;
  paragraphs: string[];
  secondaryImage?: string;
  secondaryImageCaption?: string;
}

export interface JournalArticle {
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  content: ArticleContent;
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    title: "The Architecture of Quiet Spaces",
    slug: "the-architecture-of-quiet-spaces",
    category: "Architecture & Context",
    date: "05 OCTOBER 2026",
    excerpt: "Exploring how light, proportion and material restraint create spaces that feel calm, contemplative and deeply connected to their surroundings.",
    image: "/projects/HAVEN/1-opt.jpg",
    content: {
      intro: "In an era of relentless sensory stimuli, architecture has an imperative to offer refuge. Quietness in built form is not the mere absence of sound or ornament; it is a deliberate spatial calibration of daylight, thermal comfort, and raw material truth.",
      paragraphs: [
        "When designing residential and cultural enclosures, our inquiry invariably begins with threshold conditions. How does one transition from the public realm into the private realm? Through elongated arrival paths, perforated masonry screens, and calibrated apertures, the eye is invited to slow down and attune to natural rhythms.",
        "The interplay between textured laterite stone and smooth lime plaster introduces a tangible weight to walls. Shadows become tactile. As daylight shifts across the textured surfaces, room geometries feel alive yet anchored, never demanding attention but silently cradling daily human existence.",
        "True architectural silence is achieved when structure and landscape negotiate an unhurried dialogue. Courtyards wrapped in endemic greenery allow seasonal monsoon showers to filter scent, humidity, and reflection directly into the living core, dissolving boundaries between enclosure and earth."
      ],
      secondaryImage: "/projects/HAVEN/27-opt.jpg",
      secondaryImageCaption: "Filtered daylight washing over minimal masonry surfaces in the central court."
    }
  },
  {
    title: "Tactility of Laterite and Exposed Concrete",
    slug: "tactility-of-laterite-and-exposed-concrete",
    category: "Material & Craft",
    date: "18 SEPTEMBER 2026",
    excerpt: "Why indigenous stone and honest cast surfaces ground tropical architecture, imparting dignity that patinas gracefully over decades.",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
    content: {
      intro: "Materials possess memory and geographic origin. Laterite, quarried directly from the regional soil of Kerala, carries with it an earthy warmth that synthetic composites can never replicate.",
      paragraphs: [
        "In our practice, material selection is never purely aesthetic; it is structural, climatic, and ethical. By leaving laterite and board-formed concrete unfinished, we acknowledge the passage of time. Tropical rains, humid winds, and organic moss gradually age the envelope, embedding the building into its terrain rather than fighting environmental wear.",
        "Craftsmanship bridges the gap between raw stone and contemporary precision. Working alongside regional stonemasons, we explore non-standard bonds and perforated jali screens. These porous masonry compositions allow the wall to breathe while sculpting geometric shadows across cast concrete floors.",
        "The juxtaposition of cold exposed concrete with warm porous laterite establishes a dialogue between tectonic permanence and vernacular familiarity, grounding contemporary living in geological heritage."
      ],
      secondaryImage: "/projects/RESIDENCE_AT_EDAVANNA/Q2-opt.jpg",
      secondaryImageCaption: "Grounded masonry and deep eaves sheltering living spaces from tropical glare."
    }
  },
  {
    title: "Breathing Walls and Tropical Microclimates",
    slug: "breathing-walls-and-tropical-microclimates",
    category: "Climate Responsive Design",
    date: "28 AUGUST 2026",
    excerpt: "Passive cooling strategies, perforated envelopes and cross-ventilation techniques engineered for high-humidity monsoon landscapes.",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg",
    content: {
      intro: "Designing in the tropics requires surrendering to climate rather than resisting it. Instead of hermetically sealing buildings behind mechanical air conditioning, architecture must act as a breathable membrane.",
      paragraphs: [
        "The traditional vernacular courtyard house understood stack effect centuries ago. By combining central open-to-sky courts with low-intake perimeter vents, rising heat naturally exhausts upwards, drawing cooler subterranean air across living levels.",
        "Our perforated brick and terracotta screen configurations act as thermal heat sinks. During sweltering afternoon hours, the mass absorbs radiant heat while inducing Venturi airflow through microscopic apertures, cooling ambient indoor air by several degrees without mechanical intervention.",
        "Deep roof overhangs and timber louvers deflect torrential monsoon downpours while keeping openings wide open, allowing occupants to savor the rain without water ingress."
      ],
      secondaryImage: "/projects/HAVEN/3-opt.jpg",
      secondaryImageCaption: "Shaded linear verandahs creating thermal buffer zones against intense equatorial sun."
    }
  },
  {
    title: "Inhabiting the Threshold: Verandahs and Courtyards",
    slug: "inhabiting-the-threshold-verandahs-and-courtyards",
    category: "Residential Architecture",
    date: "14 JULY 2026",
    excerpt: "The intermediate zone between interior shelter and outdoor nature as the true communal heart of the modern Indian home.",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q2-opt.jpg",
    content: {
      intro: "Domestic life in the sub-continent has never unfolded strictly within four enclosed walls. The verandah, or 'thinnai', has always been the primary setting for community, contemplation, and afternoon repose.",
      paragraphs: [
        "When reinterpreting residential typologies, we treat the perimeter not as a boundary wall, but as an inhabited spatial threshold. Deep cantilevered eaves protect built-in stone benches, where morning tea and quiet reading occur in direct contact with garden vegetation.",
        "Internal courtyards provide a complementary interior threshold. They introduce sky, rain, and nocturnal breezes into the heart of the dwelling, organizing private family quarters around an ever-changing natural stage.",
        "By prioritizing these intermediate zones, contemporary houses retain their familial intimacy while maintaining an expansive, unconfined relationship with the natural surroundings."
      ],
      secondaryImage: "/projects/HAVEN/1-opt.jpg",
      secondaryImageCaption: "The entrance threshold framed by vernacular rooflines and laterite landscape walls."
    }
  },
  {
    title: "Drawing From the Land: Our Intuitive Sketch to Form",
    slug: "drawing-from-the-land-our-intuitive-sketch-to-form",
    category: "Design Process",
    date: "02 JUNE 2026",
    excerpt: "How site contours, existing tree canopies, and sun paths dictate the initial strokes of our architectural concepts.",
    image: "/projects/HAVEN/27-opt.jpg",
    content: {
      intro: "Every architectural design begins on site, long before a computer model is rendered. We walk the contours, locate mature trees, trace prevailing breezes, and observe where the afternoon light pools.",
      paragraphs: [
        "Hand drafting remains vital in our studio because the friction of graphite against paper introduces a slower, more deliberate contemplation of proportion and human scale. An intuitive sketch captures spatial sentiment in ways a digital grid cannot.",
        "We treat existing natural topography not as an obstacle to be flattened, but as the primary author of spatial hierarchy. Staggered floor plates, sunken living pits, and bridges that veer around existing mahogany trees are direct responses to the original contours of the site.",
        "This iterative dialogue between ground truth and architectural intention ensures that each finished project feels inevitable—as if it emerged organically from the terrain."
      ],
      secondaryImage: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
      secondaryImageCaption: "Masonry screens detailed directly from full-scale mockups in the studio workshop."
    }
  },
  {
    title: "Integrating the Living Landscape as an Architectural Skin",
    slug: "integrating-the-living-landscape-as-an-architectural-skin",
    category: "Nature & Architecture",
    date: "19 APRIL 2026",
    excerpt: "Dissolving the division between garden and room through endemic flora, reflective water bodies, and climatic envelopes.",
    image: "/projects/HAVEN/3-opt.jpg",
    content: {
      intro: "Architecture should not sit upon the earth as a detached sculpture; it should root itself within the ecology of its place, allowing vegetation to become an integral structural and environmental material.",
      paragraphs: [
        "Tropical landscaping is not decorative dressing applied after construction. In our designs, planter beds, creeping vines, and rainwater retention basins are cast directly into the structural slabs during the earliest concrete pours.",
        "Living foliage provides superior solar insulation. Green curtains of hanging thunbergia and bougainvillea filter harsh glare into dappled light, reducing indoor ambient temperatures while generating gentle auditory rustle in the breeze.",
        "By designing houses that actively invite nature inside, architecture ceases to be an enclosure and becomes an ecosystem supporting human well-being and biodiversity."
      ],
      secondaryImage: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg",
      secondaryImageCaption: "Central water court reflecting natural daylight into surrounding living pavilions."
    }
  }
];

export function getAllArticles(): JournalArticle[] {
  return JOURNAL_ARTICLES;
}

export function getArticleBySlug(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): JournalArticle[] {
  return JOURNAL_ARTICLES.filter((article) => article.slug !== currentSlug).slice(0, limit);
}
