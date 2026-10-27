import {
  GardenSector,
  NotificationItem,
  ForecastSectorRow,
  AgroRecord,
  FarmProfile,
  HardwareSensor,
} from '../types';
import {
  mockSectors,
  initialAgroRecords,
  mockForecastRows,
  mockRecommendations,
  ForecastRecommendationItem,
} from '../data/mockData';
import { initialSensors } from '../data/mockSettings';
import { mockNotifications } from '../data/mockNotifications';
import { SUPPORT_CATEGORIES, FAQ_ITEMS, CONTACT_CHANNELS } from '../components/support/supportData';
import { SupportCategoryItem, FaqItem, ContactChannelItem } from '../components/support/types';

// Variety dictionary
export const VARIETY_TRANSLATIONS: Record<string, string> = {
  'Гала': 'Gala',
  'Фуджи': 'Fuji',
  'Голден': 'Golden Delicious',
  'Ред Делишес': 'Red Delicious',
  'Хани Крисп': 'Honeycrisp',
};

// Sector Names dictionary
export const SECTOR_NAMES: Record<string, { ru: string; en: string }> = {
  'sector-1': { ru: 'Участок 1', en: 'Sector 1' },
  'sector-2': { ru: 'Участок 2', en: 'Sector 2' },
  'sector-3': { ru: 'Участок 3', en: 'Sector 3' },
  'sector-4': { ru: 'Участок 4', en: 'Sector 4' },
  'sector-5': { ru: 'Участок 5', en: 'Sector 5' },
};

// Date range dictionary
export const DATE_RANGES: Record<string, string> = {
  '25 сентября – 5 октября': 'Sep 25 – Oct 5',
  '25 сентября - 5 октября': 'Sep 25 - Oct 5',
  '20 – 28 сентября': 'Sep 20 – 28',
  '20 - 28 сентября': 'Sep 20 - 28',
  '18 – 25 сентября': 'Sep 18 – 25',
  '18 - 25 сентября': 'Sep 18 - 25',
  '1 – 10 октября': 'Oct 1 – 10',
  '1 - 10 октября': 'Oct 1 - 10',
  '10 – 15 сентября': 'Sep 10 – 15',
  '10 - 15 сентября': 'Sep 10 - 15',
  '15 – 22 сентября': 'Sep 15 – 22',
  '15 - 22 сентября': 'Sep 15 - 22',
};

export const localizeDateRange = (dateStr: string): string => {
  if (!dateStr) return dateStr;
  if (DATE_RANGES[dateStr]) return DATE_RANGES[dateStr];
  return dateStr
    .replace(/сентября/gi, 'Sep')
    .replace(/октября/gi, 'Oct')
    .replace(/ноября/gi, 'Nov')
    .replace(/августа/gi, 'Aug');
};

export const getLocalizedFarmProfile = (farm: FarmProfile, isEnglish: boolean): FarmProfile => {
  if (!isEnglish) return farm;
  const FARM_NAMES_EN: Record<string, string> = {
    'Ферма «Золотой Сад»': 'Farm "Golden Orchard"',
    'Участок «Яблоневый Яр»': 'Apple Ravine Plot',
    'Сады Придонья — Сектор Север': 'Don Orchards — North Sector',
  };
  const REGION_NAMES_EN: Record<string, string> = {
    'Тульская область': 'Tula Region',
    'Липецкая область': 'Lipetsk Region',
    'Краснодарский край': 'Krasnodar Krai',
  };
  return {
    ...farm,
    name: FARM_NAMES_EN[farm.name] || farm.name,
    region: REGION_NAMES_EN[farm.region] || farm.region,
  };
};

export const getLocalizedSectors = (isEnglish: boolean): GardenSector[] => {
  if (!isEnglish) return mockSectors;

  return mockSectors.map((sector) => ({
    ...sector,
    name: SECTOR_NAMES[sector.id]?.en || sector.name.replace('Участок', 'Sector'),
    variety: VARIETY_TRANSLATIONS[sector.variety] || sector.variety,
    recommendedDate: localizeDateRange(sector.recommendedDate),
  }));
};

export const getLocalizedForecastRows = (isEnglish: boolean): ForecastSectorRow[] => {
  if (!isEnglish) return mockForecastRows;

  return mockForecastRows.map((row) => ({
    ...row,
    name: SECTOR_NAMES[row.id]?.en || row.name.replace('Участок', 'Sector'),
    variety: VARIETY_TRANSLATIONS[row.variety] || row.variety,
    recommendedDate: localizeDateRange(row.recommendedDate),
  }));
};

export const getLocalizedAgroRecords = (isEnglish: boolean): AgroRecord[] => {
  if (!isEnglish) return initialAgroRecords;

  const OPERATION_TYPES_EN: Record<string, string> = {
    'Полив': 'Irrigation',
    'Удобрения': 'Fertilization',
    'Обработка': 'Treatment',
    'Обрезка': 'Pruning',
    'Прореживание плодов': 'Fruit Thinning',
  };

  const RECORD_TITLES_EN: Record<string, string> = {
    'Полив': 'Irrigation',
    'Удобрения': 'Fertilization',
    'Обработка': 'Treatment',
    'Обрезка': 'Pruning',
    'Прореживание плодов': 'Fruit Thinning',
    'Капельный полив': 'Drip Irrigation',
    'Внесение кальциевой селитры': 'Calcium Nitrate Application',
    'Профилактика парши': 'Scab Prevention Treatment',
    'Летняя обрезка': 'Summer Pruning',
    'Прореживание завязей': 'Fruitlet Thinning',
  };

  const translateSectorString = (secStr?: string) => {
    if (!secStr) return secStr;
    return secStr
      .replace(/Все участки/g, 'All Sectors')
      .replace(/Участок/g, 'Sector');
  };

  const NOTES_EN: Record<string, string> = {
    'Капельное орошение 12 м³/га': 'Drip irrigation 12 m³/ha',
    'Внесение NPK комплексов': 'NPK fertilizer application',
    'Профилактическая защита фунгицидами': 'Preventive fungicide protection',
  };

  return initialAgroRecords.map((rec) => ({
    ...rec,
    type: OPERATION_TYPES_EN[rec.type] || rec.type,
    title: RECORD_TITLES_EN[rec.title] || OPERATION_TYPES_EN[rec.title] || rec.title,
    sector: translateSectorString(rec.sector),
    notes: rec.notes ? (NOTES_EN[rec.notes] || rec.notes) : rec.notes,
  }));
};

export const getLocalizedNotifications = (isEnglish: boolean): NotificationItem[] => {
  if (!isEnglish) return mockNotifications;

  const NOTIFICATIONS_EN: Record<
    string,
    {
      badgeText: string;
      title: string;
      description: string;
      actionText: string;
      fullText?: string;
      recommendation?: string;
      metadata?: Record<string, string>;
    }
  > = {
    'notif-1': {
      badgeText: 'Important',
      title: 'Sector 4 is ready for harvest',
      description: 'Maturity reached 85%. Recommended harvest window: September 10–15.',
      actionText: 'Go to Sector →',
      fullText:
        'Red Delicious consumer ripeness on Sector 4 has reached 85%. Sugar content is 14.5 °Bx, optimal firmness for long-term CA storage.',
      recommendation:
        'Harvest window: September 10–15. Delaying more than 5 days risks flesh softening.',
      metadata: {
        'Sector': 'Sector 4',
        'Variety': 'Red Delicious',
        'Maturity Degree': '85%',
        'Harvest Window': 'Sep 10–15',
      },
    },
    'notif-2': {
      badgeText: 'Harvest',
      title: 'Sector 5 approaching maturity',
      description: 'Maturity reached 78%. Harvest window: September 15–22.',
      actionText: 'View Forecast →',
      fullText:
        'On Sector 5 (Gala variety) fruit maturity reached 78%. Starch index is 5.1 with active anthocyanin peel synthesis.',
      recommendation:
        'Cease foliar feeding 7 days prior to harvest and reserve calibrated crates for Sep 15–22.',
      metadata: {
        'Sector': 'Sector 5',
        'Variety': 'Gala',
        'Maturity Degree': '78%',
        'Harvest Window': 'Sep 15–22',
      },
    },
    'notif-3': {
      badgeText: 'Weather',
      title: 'Weather forecast change',
      description: 'Moderate rain expected on August 15. Plan agro-operations accordingly.',
      actionText: 'Meteo Data →',
      fullText:
        'Meteorological stations indicate cyclonic front approaching on August 15. Precipitation estimate: 12-18 mm with gusts up to 14 m/s.',
      recommendation:
        'Complete calcium foliar treatment 24 hours prior to rain onset. Verify drainage in lower orchard sectors.',
      metadata: {
        'Event': 'Precipitation',
        'Date': 'August 15, 2025',
        'Expected Volume': '12–18 mm',
        'Risk Level': 'Moderate',
      },
    },
    'notif-4': {
      badgeText: 'Harvest',
      title: 'Telemetry update for Sector 2',
      description: 'Sugar content reached 13.8 °Bx. Ripening rate +2.1% per week.',
      actionText: 'Map Details →',
      fullText:
        'Spectrometry survey confirms accelerated starch-to-sugar inversion in Fuji apples on Sector 2. Average Brix 13.8.',
      recommendation:
        'Harvest timeline moved forward by 3 days. Estimated optimal window: Sep 20–28.',
      metadata: {
        'Sector': 'Sector 2',
        'Variety': 'Fuji',
        'Sugar Level': '13.8 °Bx',
        'Ripening Speed': '+2.1% / week',
      },
    },
    'notif-5': {
      badgeText: 'Important',
      title: 'Soil moisture low in Sector 1',
      description: 'Soil moisture dropped to 52%. Drip irrigation recommended.',
      actionText: 'Agro Operations →',
      fullText:
        'Sentek Drill & Drop sensor on Sector 1 registered moisture dip to 52% at 30 cm depth (threshold: 60%).',
      recommendation:
        'Activate drip irrigation for 3.5 hours (45 m³/ha) to prevent fruit sizing stall.',
      metadata: {
        'Sector': 'Sector 1',
        'Current Moisture': '52%',
        'Norm': '60–75%',
        'Irrigation Needed': '45 m³/ha',
      },
    },
    'notif-6': {
      badgeText: 'Harvest',
      title: 'Sector 3 entering ripening phase',
      description: 'Golden Delicious maturity reached 62%. Predicted harvest: October 1–10.',
      actionText: 'View Forecast →',
      fullText:
        'Chlorophyll degradation in Golden Delicious skins on Sector 3 initiated. Average maturity is 62%.',
      recommendation:
        'Perform second calcium spray to guard against bitter pit in CA storage.',
      metadata: {
        'Sector': 'Sector 3',
        'Variety': 'Golden Delicious',
        'Maturity Degree': '62%',
        'Harvest Window': 'Oct 1–10',
      },
    },
  };

  return mockNotifications.map((notif) => {
    const en = NOTIFICATIONS_EN[notif.id];
    if (!en) return notif;
    return {
      ...notif,
      badgeText: en.badgeText,
      title: en.title,
      description: en.description,
      actionText: en.actionText,
      details: notif.details
        ? {
            ...notif.details,
            fullText: en.fullText || notif.details.fullText,
            recommendation: en.recommendation || notif.details.recommendation,
            metadata: en.metadata || notif.details.metadata,
          }
        : undefined,
    };
  });
};

export const getLocalizedSupportCategories = (isEnglish: boolean): SupportCategoryItem[] => {
  if (!isEnglish) return SUPPORT_CATEGORIES;

  const CATEGORIES_EN: Record<string, { title: string; description: string }> = {
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Find quick answers to common orchard monitoring questions',
    },
    guides: {
      title: 'Guides & Manuals',
      description: 'Comprehensive tutorials, spectral manuals, and calibration steps',
    },
    videos: {
      title: 'Video Lessons',
      description: 'Watch step-by-step videos on how the platform operates',
    },
    feedback: {
      title: 'Feedback & Inquiries',
      description: 'Send a message directly to our agronomic support team',
    },
  };

  return SUPPORT_CATEGORIES.map((cat) => {
    const en = CATEGORIES_EN[cat.id];
    return en ? { ...cat, title: en.title, description: en.description } : cat;
  });
};

export const getLocalizedFaqItems = (isEnglish: boolean): FaqItem[] => {
  if (!isEnglish) return FAQ_ITEMS;

  const FAQ_EN: Record<string, { question: string; answer: string }> = {
    'faq-1': {
      question: 'How do I add a new orchard sector?',
      answer:
        'To add a new sector, navigate to "Garden Map" or "Settings". In the top right corner, click "+ Add Sector". Specify sector code (e.g. C1), select apple variety, input total acreage, and optionally upload KML/GeoJSON boundary files or link drone orthophotos.',
    },
    'faq-2': {
      question: 'How do I modify notification preferences?',
      answer:
        'Alert channels and event triggers are configured in "Settings" -> "Notifications". You can toggle push notifications, email summaries, and SMS for critical fruit ripening, imminent frost warnings, precipitation alerts, and irrigation thresholds.',
    },
    'faq-3': {
      question: 'Why might spectral maturity indices diverge from field tests?',
      answer:
        'The maturity index is computed from reflectance coefficients (NDVI, NDRE), weather history, and agrotechnical logs. Minor variations occur with uneven canopy sunlight or heavy leaf dust. Regularly recording field Brix and starch values in "Data" calibrates the neural network for orchard microclimates.',
    },
    'faq-4': {
      question: 'How does automated disease and stress detection work?',
      answer:
        'Disease analysis utilizes high-resolution hyperspectral imagery across RedEdge and NIR wavelengths. Computer vision identifies early chlorosis, scab, and powdery mildew 5–7 days prior to human visual signs, highlighting chlorophyll stress in spectral heatmaps.',
    },
    'faq-5': {
      question: 'How do I contact an agronomist directly?',
      answer:
        'Click the "Support" tab in the left navigation sidebar or select "Contact Support" from any dashboard card. You can start a live chat session with our agronomy specialists, call our 24/7 hotline at 8 (800) 555-35-35, or send an inquiry to support@intellia.ru.',
    },
  };

  return FAQ_ITEMS.map((item) => {
    const en = FAQ_EN[item.id];
    return en ? { ...item, question: en.question, answer: en.answer } : item;
  });
};

export const getLocalizedContactChannels = (isEnglish: boolean): ContactChannelItem[] => {
  if (!isEnglish) return CONTACT_CHANNELS;

  const CHANNELS_EN: Record<string, { title: string; subtitle: string; value?: string }> = {
    chat: {
      title: 'Live Chat with Agronomist',
      subtitle: 'Average response: under 3 minutes',
      value: '24/7 Online',
    },
    phone: {
      title: 'Telephone Support',
      subtitle: 'Agronomic emergency line',
      value: '+7 (800) 555-01-23',
    },
    email: {
      title: 'Email',
      subtitle: 'Technical & contract inquiries',
      value: 'support@intellia.ru',
    },
    telegram: {
      title: 'Telegram',
      subtitle: 'Mobile bot & notifications',
      value: '@intellia_support',
    },
  };

  return CONTACT_CHANNELS.map((ch) => {
    const en = CHANNELS_EN[ch.id];
    return en
      ? {
          ...ch,
          title: en.title,
          subtitle: en.subtitle,
          value: en.value || ch.value,
        }
      : ch;
  });
};

export const getLocalizedRecommendations = (isEnglish: boolean): ForecastRecommendationItem[] => {
  if (!isEnglish) return mockRecommendations;

  const RECS_EN: Record<
    string,
    {
      priority: string;
      title: string;
      description: string;
      actionText: string;
    }
  > = {
    'rec-1': {
      priority: 'High Priority',
      title: 'Sector 4 (Red Delicious) — start harvest September 10–15',
      description:
        'Fruit maturity reached 85%, sugar content 14.5 °Bx, firmness 6.8 kg/cm² optimal for long-term storage. Delaying more than 5 days risks softening and lower storage shelf-life.',
      actionText: 'Go to Sector Map',
    },
    'rec-2': {
      priority: 'Medium Priority',
      title: 'Sector 5 (Gala) — prepare crates and crews for September 15–22',
      description:
        'Maturity at 78%. Cease foliar feeding 7 days prior to harvest start and reserve calibrated wooden crates.',
      actionText: 'View Agro-Data',
    },
    'rec-3': {
      priority: 'Scheduled Control',
      title: 'Sectors 1, 2, and 3 (Gala, Fuji, Golden) — irrigation control',
      description:
        'Maturity degree from 45% to 60%. Optimal soil moisture range is 65–70%. Repeated drone survey recommended on September 5 to monitor ripening rate.',
      actionText: 'Open Orchard Map',
    },
  };

  return mockRecommendations.map((rec) => {
    const en = RECS_EN[rec.id];
    return en
      ? {
          ...rec,
          priority: en.priority,
          title: en.title,
          description: en.description,
          actionText: en.actionText,
        }
      : rec;
  });
};

export const getLocalizedSensors = (
  sensors: HardwareSensor[] = initialSensors,
  isEnglish: boolean
): HardwareSensor[] => {
  if (!isEnglish) return sensors;

  const SENSORS_EN: Record<
    string,
    {
      name: string;
      statusText: string;
      lastPing: string;
      details?: string;
    }
  > = {
    'sensor-meteo': {
      name: 'Weather Station',
      statusText: 'Online',
      lastPing: '2 min ago',
      details: 'Temperature, humidity, pressure, wind speed, UV radiation',
    },
    'sensor-soil': {
      name: 'Soil Moisture Sensors',
      statusText: 'Online',
      lastPing: '5 min ago',
      details: 'Soil moisture, salinity, and temperature at 10–60 cm depth',
    },
    'sensor-camera': {
      name: 'Cameras',
      statusText: 'Online',
      lastPing: '1 min ago',
      details: 'Real-time optical canopy and tree row surveillance',
    },
    'sensor-spectral': {
      name: 'Hyperspectral Module',
      statusText: 'Online',
      lastPing: '10 min ago',
      details: 'Surveying across 450–950 nm (164 spectral channels)',
    },
  };

  return sensors.map((sensor) => {
    const en = SENSORS_EN[sensor.id];
    return en
      ? {
          ...sensor,
          name: en.name,
          statusText: en.statusText,
          lastPing: sensor.lastPing === 'только что' || sensor.lastPing === 'just now'
            ? 'just now'
            : en.lastPing,
          details: en.details || sensor.details,
        }
      : sensor;
  });
};
