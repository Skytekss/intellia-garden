export const TRANSLATIONS: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    // Nav
    'nav.overview': 'Главная',
    'nav.map': 'Карта сада',
    'nav.data': 'Данные',
    'nav.forecasts': 'Прогнозы',
    'nav.notifications': 'Уведомления',
    'nav.settings': 'Настройки',
    'nav.support': 'Поддержка',
    'nav.more': 'Ещё',

    // Header
    'header.activeSeason': 'Активный сезон',
    'header.title.overview': 'Сводка по саду',
    'header.title.map': 'Интерактивная карта сада',
    'header.title.data': 'Спектральные и агро-данные',
    'header.title.forecasts': 'Прогнозы созревания',
    'header.title.notifications': 'Центр уведомлений',
    'header.title.settings': 'Настройки системы',
    'header.title.support': 'Служба агрономической поддержки',
    'header.user.name': 'Алексей С.',
    'header.user.role': 'Главный агроном',
    'header.farmAreaPrefix': 'Площадь:',

    // General Settings
    'settings.general.title': 'Основные настройки',
    'settings.general.subtitle': 'Общие параметры приложения',
    'settings.general.language': 'Язык интерфейса',
    'settings.general.units': 'Единицы измерения',
    'settings.general.timezone': 'Часовой пояс',
    'settings.general.dateFormat': 'Формат даты',

    // Farm Profile
    'settings.farm.title': 'Профиль хозяйства',
    'settings.farm.subtitle': 'Информация о вашей ферме',
    'settings.farm.area': 'Площадь:',
    'settings.farm.region': 'Регион:',
    'settings.farm.edit': 'Редактировать',

    // Edit Modal
    'settings.modal.title': 'Редактирование профиля хозяйства',
    'settings.modal.subtitle': 'Обновите основные параметры сада',
    'settings.modal.farmName': 'Название хозяйства',
    'settings.modal.farmArea': 'Площадь сада (в гектарах)',
    'settings.modal.region': 'Регион расположения',
    'settings.modal.cancel': 'Отмена',
    'settings.modal.save': 'Сохранить изменения',

    // Notifications Card
    'settings.notifications.title': 'Уведомления',
    'settings.notifications.subtitle': 'Настройте, о каких событиях вы хотите получать уведомления',
    'settings.notifications.harvest': 'Урожай и зрелость плодов',
    'settings.notifications.weather': 'Погодные условия',
    'settings.notifications.agrotechnical': 'Агротехнические работы',
    'settings.notifications.system': 'Обновления системы',

    // Sensors Card
    'settings.sensors.title': 'Датчики и оборудование',
    'settings.sensors.subtitle': 'Управление подключёнными устройствами',
    'settings.sensors.allOnline': 'Все датчики работают нормально',
    'settings.sensors.needCheck': 'Требуется проверка датчиков',
    'settings.sensors.configure': 'Настроить оборудование',
    'settings.sensors.online': 'Онлайн',
    'settings.sensors.offline': 'Офлайн',

    // Data Management Card
    'settings.data.title': 'Управление данными',
    'settings.data.subtitle': 'Хранение и синхронизация информации',
    'settings.data.autoSync': 'Автоматическая синхронизация',
    'settings.data.retention': 'Период сохранения данных',
    'settings.data.backup': 'Резервное копирование',
    'settings.data.lastBackup': 'Последняя:',
    'settings.data.createBackup': 'Создать резервную копию',
    'settings.data.creating': 'Создание копии...',
    'settings.data.success': 'Копия успешно создана',

    // Support Banner
    'settings.support.title': 'ИНТЕЛЛИЯ всегда рядом',
    'settings.support.description': 'Мы постоянно улучшаем алгоритмы, чтобы ваш сад приносил больше урожая. Если у вас есть вопросы или предложения — напишите нам в поддержку.',
    'settings.support.contact': 'Связаться с поддержкой',

    // Units
    'unit.metric': 'Метрическая (°C, мм, га)',
    'unit.imperial': 'Имперская (°F, дюймы, акры)',

    // Weather
    'weather.clear': 'Ясно, без осадков',
    'weather.humidity': 'Влажность',
    'weather.wind': 'м/с',
    'weather.rain': 'Осадки',

    // Dashboard
    'hero.title': 'ИНТЕЛЛИЯ',
    'hero.subtitle': 'Прогнозирование сроков сбора урожая яблок',
    'hero.description': 'Гиперспектральные данные, агротехника, метеоданные и ИИ — для точного прогнозирования зрелости и оптимальных сроков сбора плодов.',
    'hero.badge.ai': 'Агроклиматический AI-мониторинг',
    'hero.badge.season': 'Сезон 2025',
    'hero.accuracy': 'Точность: 94.6%',
    'hero.sectors': '5 секторов',
    'hero.interactiveMap': 'Интерактивная карта',
    'hero.droneInAir': 'Дрон в воздухе • Спектральная съемка',
  },
  en: {
    // Nav
    'nav.overview': 'Dashboard',
    'nav.map': 'Garden Map',
    'nav.data': 'Agro Data',
    'nav.forecasts': 'Forecasts',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'nav.support': 'Support',
    'nav.more': 'More',

    // Header
    'header.activeSeason': 'Active Season',
    'header.title.overview': 'Garden Overview',
    'header.title.map': 'Interactive Garden Map',
    'header.title.data': 'Spectral & Agro Data',
    'header.title.forecasts': 'Ripening Forecasts',
    'header.title.notifications': 'Notification Center',
    'header.title.settings': 'System Settings',
    'header.title.support': 'Agronomic Support Service',
    'header.user.name': 'Alexey S.',
    'header.user.role': 'Chief Agronomist',
    'header.farmAreaPrefix': 'Area:',

    // General Settings
    'settings.general.title': 'General Settings',
    'settings.general.subtitle': 'General application parameters',
    'settings.general.language': 'Interface Language',
    'settings.general.units': 'Measurement Units',
    'settings.general.timezone': 'Timezone',
    'settings.general.dateFormat': 'Date Format',

    // Farm Profile
    'settings.farm.title': 'Farm Profile',
    'settings.farm.subtitle': 'Information about your farm',
    'settings.farm.area': 'Area:',
    'settings.farm.region': 'Region:',
    'settings.farm.edit': 'Edit',

    // Edit Modal
    'settings.modal.title': 'Edit Farm Profile',
    'settings.modal.subtitle': 'Update core orchard parameters',
    'settings.modal.farmName': 'Farm Name',
    'settings.modal.farmArea': 'Orchard Area (hectares)',
    'settings.modal.region': 'Location Region',
    'settings.modal.cancel': 'Cancel',
    'settings.modal.save': 'Save Changes',

    // Notifications Card
    'settings.notifications.title': 'Notifications',
    'settings.notifications.subtitle': 'Configure events you want to be notified about',
    'settings.notifications.harvest': 'Harvest & fruit ripening',
    'settings.notifications.weather': 'Weather conditions',
    'settings.notifications.agrotechnical': 'Agrotechnical operations',
    'settings.notifications.system': 'System updates',

    // Sensors Card
    'settings.sensors.title': 'Sensors & Hardware',
    'settings.sensors.subtitle': 'Manage connected devices & telemetry',
    'settings.sensors.allOnline': 'All sensors operating normally',
    'settings.sensors.needCheck': 'Sensor check required',
    'settings.sensors.configure': 'Configure Hardware',
    'settings.sensors.online': 'Online',
    'settings.sensors.offline': 'Offline',

    // Data Management Card
    'settings.data.title': 'Data Management',
    'settings.data.subtitle': 'Storage and cloud synchronization',
    'settings.data.autoSync': 'Automatic synchronization',
    'settings.data.retention': 'Data retention period',
    'settings.data.backup': 'Data Backup',
    'settings.data.lastBackup': 'Last:',
    'settings.data.createBackup': 'Create backup copy',
    'settings.data.creating': 'Creating backup...',
    'settings.data.success': 'Backup created successfully',

    // Support Banner
    'settings.support.title': 'INTELLIA is always by your side',
    'settings.support.description': 'We continuously refine our algorithms so your orchard yields maximum fruit. Contact our agronomic team with any question.',
    'settings.support.contact': 'Contact Support',

    // Units
    'unit.metric': 'Метрическая (°C, мм, га)',
    'unit.imperial': 'Имперская (°F, дюймы, акры)',

    // Weather
    'weather.clear': 'Clear, no rain',
    'weather.humidity': 'Humidity',
    'weather.wind': 'mph',
    'weather.rain': 'Rain',

    // Dashboard
    'hero.title': 'INTELLIA',
    'hero.subtitle': 'Apple Harvest Maturity & Timing Forecasts',
    'hero.description': 'Hyperspectral drone telemetry, agrotechnics, meteo feeds, and AI for precise fruit maturity prediction and harvest scheduling.',
    'hero.badge.ai': 'Agro-climatic AI Monitoring',
    'hero.badge.season': 'Season 2025',
    'hero.accuracy': 'Accuracy: 94.6%',
    'hero.sectors': '5 sectors',
    'hero.interactiveMap': 'Interactive Map',
    'hero.droneInAir': 'Drone in flight • Spectral Survey',
  },
};
