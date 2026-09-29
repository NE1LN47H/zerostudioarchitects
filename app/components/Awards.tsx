export default function Awards() {
  const recognitions = [
    {
      project: "A Reminiscing Walk through Valiyangadi: history that is retained and revived, Malappuram, Kerala",
      awards: [
        "IIA-Royale State Awards for Excellence in Architecture 2013 - Golden Leaf Award",
        "IIA National Awards for Excellence in Architecture 2016-Shortlisted"
      ]
    },
    {
      project: "The Temple of Knowledge_ A Tribute to the father of Malayalam, Tirur,Kerala",
      awards: [
        "IIA- Kerala State Awards for Excellence in Architecture 2014- Commendation",
        "IIA National Awards for Excellence in Architecture 2016-Shortlisted-Architecture unbuilt"
      ]
    },
    {
      project: "Green Lattice - The Tower of Remembrance; Seethi Haji Memorial Cultural center, Malappuram, Kerala",
      awards: [
        "IIA- Kerala State Awards_ for Excellence in Architecture 2014- Shortlisted",
        "Foundation for Architectural & Environmental awareness- Best Unbuilt Design 2014",
        "Archi Design awards for Excellence in Architecture 2015 -Winner",
        "Artist in Concrete Asia 2015-16 -Shortlisted",
        "IIA National Awards for Excellence in Architecture 2015- Commendation for 'Architecture Un built'"
      ]
    },
    {
      project: "Residence for Mr.Biju Mathew, Perinthalmanna, Kerala",
      awards: [
        "Vanitha Veedu architecture awards 2017: Award for Best Renovated House: winner"
      ]
    },
    {
      project: "Mausam- The house of seasons",
      awards: [
        "Ace Architect-Ace Alpha Awards 2017: Winner - Residential-Affordable",
        "The Merit List 2018-19",
        "NDTV Design and Architecture Awards 2017 Nomination-Architecture Award-House"
      ]
    },
    {
      project: "Kadalas -The Sea view cafe, South Beach, Calicut, Kerala",
      awards: [
        "IIA National Awards For Excellence In Architecture 2018-Shortlisted-Interior(Non-Residential)",
        "Forbes India Design Awards 2019: 'Best Retail & Hospitality Interiors-Special Commendation",
        "The Merit List 2018-19",
        "IID Design Excellence Awards 2019(Winner Zone 1)- Leisure & Entertainment",
        "IID Design Excellence Awards 2019: Runner up(National) - Leisure & Entertainment",
        "IIA Kerala state Awards for Excellence In Architecture 2021- Commendation-Category Hospitality",
        "IIID Kerala regional chapter awards 2023 -runner up -category-leisure & entertainment"
      ]
    },
    {
      project: "Reviving the spirit of a place - Story of An Abandoned Laterite Quarry",
      awards: [
        "IIA National Awards for Excellence in Architecture 2020- shortlisted -Landscape design -Category B",
        "IIA Kerala state Awards for Excellence in Architecture 2021- Silver Leaf -Category: Responsible Architecture",
        "IIA Kerala state Awards for Excellence in Architecture 2021- Gold Leaf -Category: Landscape B",
        "Kohler Bold Design Awards 2022-Winner-Category: Landscape design"
      ]
    },
    {
      project: "Edavani : Redefining a Tribal Hamlet ,Attappady,Kerala",
      awards: [
        "IIA National Awards for Excellence In Architecture 2020- Winner -category:Architecture Unbuilt",
        "IIA Kerala state Awards for Excellence in Architecture 2021-shortlisted -Category: Architecture Unbuilt"
      ]
    },
    {
      project: "Screen: the LANTERN house,Tirur,Kerala",
      awards: [
        "IIID Kerala regional chapter awards 2023 -runner up -category-residential",
        "Vanitha Veedu Architectural Awards 2024-Silver- Category -residential",
        "IIA Kerala state Awards for Excellence in Architecture 2023-Commendation-Category: Residential interior"
      ]
    },
    {
      project: "HAVEN,Kannur,Kerala",
      awards: [
        "Vanitha Veedu Architectural Awards 2026-Silver- Category -residential interior"
      ]
    }
  ];

  const otherRecognitions = [
    "2016: i-GEN Design Forum-2016': Listing for the most promising top50 gen-next architects by 'Architect and Interiors India' magazine.",
    "2017: Vanitha Veedu Architecture Awards 2017: The award for the Best Young Architect",
    "2018: Selected among the '20 under 35' in the 8th edition of Design X Design Annual Exhibition 2018",
    "2018: The 'Startup of the year Award 2018 'by Saint-Gobain & Economic times -Smart Green Summit",
    "2023: ID Honours Award for 2023: category -Biophilic Design.",
    "2023: i-GEN Design Forum-2023: Listing for the most promising top50 gen-next architects by 'Architect and Interiors India' magazine.",
    "2024: IIA National award for the best Young architect from Kerala Chapter"
  ];

  return (
    <section className="section" id="awards" aria-labelledby="awards-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="awards-title">Awards & Recognitions</h2>
          <p>ZERO STUDIO (Estd 2013)</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', maxWidth: '800px', margin: '0 auto' }}>
          <div>
            {recognitions.map((rec, idx) => (
              <div key={idx} style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }}>{rec.project}</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '24px', color: 'var(--ink-2)' }}>
                  {rec.awards.map((award, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{award}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Other Recognitions</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', color: 'var(--ink-2)' }}>
              {otherRecognitions.map((rec, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}