import {
  HelpCircle,
  BookOpen,
  Video,
  MessageSquareText,
  Mail,
  Phone,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  SupportCategoryItem,
  FaqItem,
  ContactChannelItem,
} from './types';

export const SUPPORT_CATEGORIES: SupportCategoryItem[] = [
  {
    id: 'faq',
    title: 'Частые вопросы',
    description: 'Найти ответ на популярные вопросы',
    icon: HelpCircle,
  },
  {
    id: 'guides',
    title: 'Инструкции',
    description: 'Подробные руководства и обучающие материалы',
    icon: BookOpen,
  },
  {
    id: 'videos',
    title: 'Видеоуроки',
    description: 'Посмотрите, как работает система',
    icon: Video,
  },
  {
    id: 'feedback',
    title: 'Обратная связь',
    description: 'Напишите нам о вашей проблеме',
    icon: MessageSquareText,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Как добавить новый участок сада?',
    answer:
      'Чтобы добавить новый участок, перейдите в раздел «Карта сада» или «Настройки». В правом верхнем углу нажмите кнопку «+ Добавить участок». Укажите наименование сектора (например, C1), выберите сорт яблони, введите общую площадь в гектарах и при необходимости загрузите KML/GeoJSON-контур участка или привяжите ортофотоплан со съемки дрона.',
    category: 'garden-map',
  },
  {
    id: 'faq-2',
    question: 'Как изменить настройки уведомлений?',
    answer:
      'Настройки каналов и типов оповещений находятся во вкладке «Настройки» -> «Уведомления». Вы можете включить или отключить получение SMS, email-рассылок и push-уведомлений о критической зрелости секторов, приближающихся заморозках, рисках осадков и необходимости полива.',
    category: 'system',
  },
  {
    id: 'faq-3',
    question: 'Почему данные о зрелости отличаются от реальных?',
    answer:
      'Индекс зрелости рассчитывается на основе спектрального анализа коэффициентов отражения (NDVI, NDRE), метеорологических данных и агротехнических записей. Небольшие расхождения могут возникать при неравномерной освещенности крон или сильной запыленности листьев. Рекомендуется регулярно вносить данные полевых замеров (Brix и крахмальный тест) в разделе «Данные» для калибровки нейросетевой модели.',
    category: 'maturity',
  },
  {
    id: 'faq-4',
    question: 'Как работает анализ заболеваний?',
    answer:
      'Анализ заболеваний использует гиперспектральные снимки высокого разрешения в диапазонах RedEdge и NIR. Компьютерное зрение выявляет ранние очаги хлороза, парши и мучнистой росы за 5–7 дней до появления видимых невооруженным глазом симптомов, отображая уровень стресса хлорофилла в тепловой шкале.',
    category: 'health',
  },
  {
    id: 'faq-5',
    question: 'Как получить консультацию агронома?',
    answer:
      'Вы можете связаться с дежурным экспертом-агрономом сервиса ИНТЕЛЛИЯ через онлайн-чат на этой странице или написав нам в Telegram @intellia_support. Агрономы готовы помочь с интерпретацией спектральных карт, корректировкой графиков полива и настройкой калибровочных параметров под ваш сорт.',
    category: 'expert',
  },
];

export const CONTACT_CHANNELS: ContactChannelItem[] = [
  {
    id: 'email',
    title: 'Email',
    subtitle: 'Напишите нам на почту',
    value: 'support@intellia.ru',
    href: 'mailto:support@intellia.ru',
    type: 'email',
    icon: Mail,
  },
  {
    id: 'phone',
    title: 'Телефон',
    subtitle: 'Бесплатно по всей России',
    value: '+7 (800) 555-01-23',
    href: 'tel:+78005550123',
    type: 'phone',
    icon: Phone,
  },
  {
    id: 'chat',
    title: 'Онлайн-чат',
    subtitle: 'Ответим в режиме реального времени',
    value: 'Круглосуточно',
    type: 'chat',
    icon: MessageCircle,
  },
  {
    id: 'telegram',
    title: 'Telegram',
    subtitle: 'Оперативная поддержка в мессенджере',
    value: '@intellia_support',
    href: 'https://t.me/intellia_support',
    type: 'telegram',
    icon: Send,
  },
];

export const RESPONSE_TIME_TEXT = 'Среднее время ответа — до 2 часов';
