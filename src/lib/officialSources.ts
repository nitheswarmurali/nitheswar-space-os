// Official agency data source registry.
// Every URL here was verified via web search against the agency's own domain.
// No third-party mirrors or community APIs.

export interface OfficialSource {
  agency: 'ISRO' | 'CNSA' | 'JAXA';
  category: string;
  name: string;
  url: string;
  description: string;
  access: 'free' | 'registration' | 'restricted';
  dataType: string;
}

export const OFFICIAL_SOURCES: OfficialSource[] = [
  // ── ISRO ─────────────────────────────────────────────────
  {
    agency: 'ISRO',
    category: 'Satellite Data',
    name: 'Bhoonidhi',
    url: 'https://bhoonidhi.nrsc.gov.in',
    description: 'ISRO S-SAR & L-SAR data. Extensive IRS and non-IRS satellite catalogue (since 1988) with daily updates for India and surrounding regions.',
    access: 'registration',
    dataType: 'SAR imagery, IRS catalogue',
  },
  {
    agency: 'ISRO',
    category: 'API Centre',
    name: 'VEDAS API Centre',
    url: 'https://vedas.sac.gov.in',
    description: 'Visualization of Earth observation Data and Archival System. API access to recent and historical satellite imagery and products. Developed by ISRO Space Applications Centre (SAC).',
    access: 'registration',
    dataType: 'Remote sensing imagery, value-added products',
  },
  {
    agency: 'ISRO',
    category: 'Meteorology',
    name: 'MOSDAC',
    url: 'https://mosdac.gov.in',
    description: "India's Storehouse of Meteorological and Oceanographic Satellite Data. API services, WMS, interactive data analytics and visualization (LIVE).",
    access: 'registration',
    dataType: 'Weather, ocean, atmospheric data',
  },
  {
    agency: 'ISRO',
    category: 'Geoportal',
    name: 'Bhuvan',
    url: 'https://bhuvan.nrsc.gov.in',
    description: 'ISRO Geoportal with satellite tracker, thematic maps, near-real-time disaster services. NRT data dissemination via RSS feeds, HTTP, FTP, API services, WMS.',
    access: 'free',
    dataType: 'Multi-date, multi-platform satellite visualization',
  },
  {
    agency: 'ISRO',
    category: 'Planetary Science',
    name: 'ISRO Science Data Archive (ISDA)',
    url: 'https://www.issdc.gov.in',
    description: 'Repository of all science data from Indian missions starting with Chandrayaan-1. Data, calibration data, auxiliary data.',
    access: 'registration',
    dataType: 'Chandrayaan, Mangalyaan, planetary mission archives',
  },
  {
    agency: 'ISRO',
    category: 'Mission Data',
    name: 'PRADAN (Chandrayaan-3)',
    url: 'https://www.isro.gov.in',
    description: 'Policy based data Retrieval, Analytics, Dissemination And Notification system. Chandrayaan-3 datasets available.',
    access: 'registration',
    dataType: 'Lunar mission data',
  },
  {
    agency: 'ISRO',
    category: 'Official Portal',
    name: 'ISRO Official',
    url: 'https://www.isro.gov.in',
    description: 'Official ISRO website — missions, launch schedules, press releases, annual reports.',
    access: 'free',
    dataType: 'Mission updates, launch schedules',
  },

  // ── CNSA ─────────────────────────────────────────────────
  {
    agency: 'CNSA',
    category: 'Official Portal',
    name: 'CNSA Official',
    url: 'http://www.cnsa.gov.cn',
    description: 'China National Space Administration official portal. International cooperation, mission announcements.',
    access: 'free',
    dataType: 'Mission updates, policy announcements',
  },
  {
    agency: 'CNSA',
    category: 'Crewed Spaceflight',
    name: 'China Manned Space (CMSE)',
    url: 'http://en.cmse.gov.cn',
    description: 'Official China Manned Space Engineering office. Tiangong space station, Shenzhou crewed missions. English version available.',
    access: 'free',
    dataType: 'Crewed mission data, space station status',
  },
  {
    agency: 'CNSA',
    category: 'Lunar & Deep Space',
    name: 'China Lunar & Deep Space Exploration',
    url: 'http://www.cnsa.gov.cn',
    description: "Official portal for China's lunar program (Chang'e series) and deep space missions (Tianwen-1).",
    access: 'free',
    dataType: 'Lunar and Mars mission data',
  },
  {
    agency: 'CNSA',
    category: 'Earth Observation',
    name: 'EOSDC (Earth Observation System)',
    url: 'http://www.cpeos.com',
    description: "CNSA's Earth Observation System and Data Center. Overall project unit of China's high-resolution Earth observation system and civil space satellites.",
    access: 'restricted',
    dataType: 'High-resolution Earth observation',
  },
  {
    agency: 'CNSA',
    category: 'Navigation',
    name: 'BeiDou Navigation',
    url: 'https://www.beidou.gov.cn',
    description: 'BeiDou Navigation Satellite System official site. XPNAV-1 pulsar test data downloads.',
    access: 'free',
    dataType: 'Navigation satellite data, pulsar observations',
  },
  {
    agency: 'CNSA',
    category: 'News (English)',
    name: 'CNSA English News Scraper',
    url: 'https://apify.com/jungle_synthesizer/cnsa-english-news-china-space-agency-scraper',
    description: "Scrapes official English-language news from CNSA's English mirror — cited by Reuters, BBC, AP, and SpaceNews.",
    access: 'registration',
    dataType: 'News, announcements (English)',
  },

  // ── JAXA ─────────────────────────────────────────────────
  {
    agency: 'JAXA',
    category: 'Earth Observation API',
    name: 'JAXA Earth API',
    url: 'https://data.earth.jaxa.jp',
    description: 'Provides access to 100+ Earth observation satellite datasets from JAXA missions including ALOS, GCOM-C, and GCOM-W. Free, no registration, no API key required.',
    access: 'free',
    dataType: 'Satellite datasets (Python, JavaScript)',
  },
  {
    agency: 'JAXA',
    category: 'Earth Observation API',
    name: 'JAXA Earth API for JavaScript',
    url: 'https://data.earth.jaxa.jp',
    description: 'JavaScript library for displaying satellite imagery in browsers and building satellite-data web applications.',
    access: 'free',
    dataType: 'Browser-based satellite imagery',
  },
  {
    agency: 'JAXA',
    category: 'Precipitation',
    name: 'JPMAP (GSMaP)',
    url: 'https://www.eorc.jaxa.jp',
    description: 'Global Satellite Mapping of Precipitation. Near-real-time rainfall data updated every 30 minutes.',
    access: 'free',
    dataType: 'Global rainfall, every 30 minutes',
  },
  {
    agency: 'JAXA',
    category: 'Climate',
    name: 'GCOM-C (Shikisai) Portal',
    url: 'https://shikisai.jaxa.jp',
    description: 'Climate observation satellite portal. Data processing status, observation plans, on-orbit event information, near-real-time data access.',
    access: 'free',
    dataType: 'Climate, aerosol, ocean colour data',
  },
  {
    agency: 'JAXA',
    category: 'Open API',
    name: 'JAXA OPEN API',
    url: 'https://www.satnavi-sub-jaxa.jp/jaxa_open_api',
    description: "JAXA's official web API (B version). Registration required. Request URL: https://joa.epi.bz/api/",
    access: 'registration',
    dataType: 'Various satellite-derived physical quantities',
  },
  {
    agency: 'JAXA',
    category: 'Science Archive',
    name: 'ISAS DARTS Archive',
    url: 'https://data.darts.isas.jaxa.jp',
    description: 'Institute of Space and Astronautical Science Data Archives and Transmission System. Hayabusa, Kaguya (SELENE), Akatsuki, and other mission data.',
    access: 'free',
    dataType: 'Hayabusa, Kaguya, Akatsuki mission data',
  },
  {
    agency: 'JAXA',
    category: 'Data Search',
    name: 'JAXA G-Portal',
    url: 'https://www.gportal.jaxa.jp',
    description: 'OGC web services (CSW/WMS/WCS) for satellite data search and retrieval. FTP data service available.',
    access: 'free',
    dataType: 'Satellite data search and retrieval',
  },
];