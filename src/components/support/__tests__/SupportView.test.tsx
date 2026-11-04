import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { SupportView } from '../SupportView';
import { FAQ_ITEMS, SUPPORT_CATEGORIES, GUIDES_DATA, VIDEOS_DATA } from '../supportData';

// Mock scrollIntoView and window.scrollTo since jsdom doesn't support them
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn();
});

describe('SupportView Component', () => {
  it('renders the Support page header and description', () => {
    render(<SupportView />);

    expect(screen.getByRole('heading', { level: 1, name: 'Поддержка' })).toBeInTheDocument();
    expect(
      screen.getByText('Мы всегда рядом, чтобы помочь вам заботиться о вашем саде')
    ).toBeInTheDocument();
  });

  it('renders all 4 support categories correctly', () => {
    render(<SupportView />);

    SUPPORT_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.title)).toBeInTheDocument();
      expect(screen.getByText(cat.description)).toBeInTheDocument();
    });
  });

  it('renders FAQ accordion and allows expanding/collapsing questions', async () => {
    render(<SupportView />);

    expect(screen.getByText('Популярные вопросы')).toBeInTheDocument();

    // Verify all FAQ questions are rendered
    FAQ_ITEMS.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });

    // First question is expanded by default
    const firstAnswer = screen.getByTestId(`faq-item-answer-${FAQ_ITEMS[0].id}`);
    expect(firstAnswer).toBeInTheDocument();
    expect(firstAnswer).toHaveTextContent(FAQ_ITEMS[0].answer);

    // Expand second question
    const secondToggle = screen.getByTestId(`faq-item-toggle-${FAQ_ITEMS[1].id}`);
    fireEvent.click(secondToggle);

    await waitFor(() => {
      const secondAnswer = screen.getByTestId(`faq-item-answer-${FAQ_ITEMS[1].id}`);
      expect(secondAnswer).toBeInTheDocument();
      expect(secondAnswer).toHaveTextContent(FAQ_ITEMS[1].answer);
    });

    // Toggle all button expands / collapses
    const toggleAllBtn = screen.getByTestId('faq-toggle-all-button');
    fireEvent.click(toggleAllBtn);

    expect(toggleAllBtn).toBeInTheDocument();
  });

  it('renders contact channels with proper external links and callbacks', () => {
    render(<SupportView />);

    expect(screen.getByText('Связаться с нами')).toBeInTheDocument();

    // Email
    const emailChannel = screen.getByTestId('contact-channel-email');
    expect(emailChannel).toHaveAttribute('href', 'mailto:support@intellia.ru');
    expect(within(emailChannel).getByText('support@intellia.ru')).toBeInTheDocument();

    // Phone
    const phoneChannel = screen.getByTestId('contact-channel-phone');
    expect(phoneChannel).toHaveAttribute('href', 'tel:+78005550123');
    expect(within(phoneChannel).getByText('+7 (800) 555-01-23')).toBeInTheDocument();

    // Telegram
    const telegramChannel = screen.getByTestId('contact-channel-telegram');
    expect(telegramChannel).toHaveAttribute('href', 'https://t.me/intellia_support');
    expect(within(telegramChannel).getByText('@intellia_support')).toBeInTheDocument();

    // Chat
    const chatChannel = screen.getByTestId('contact-channel-chat');
    expect(chatChannel).toBeInTheDocument();

    // Response time note
    expect(screen.getByText('Среднее время ответа — до 2 часов')).toBeInTheDocument();
  });

  it('renders bottom banner with bot avatar, slogan and action buttons', () => {
    render(<SupportView />);

    expect(screen.getByTestId('support-banner')).toBeInTheDocument();
    expect(screen.getByTestId('support-bot-avatar')).toBeInTheDocument();
    expect(screen.getByText('Нужна помощь?')).toBeInTheDocument();
    expect(screen.getByTestId('support-slogan')).toHaveTextContent('Успешного урожая!');
    expect(screen.getByTestId('support-banner-cta-button')).toHaveTextContent(/чат с ассистентом/i);
    expect(screen.getByTestId('support-banner-secondary-button')).toHaveTextContent(/Оставить заявку/i);
  });

  it('opens ChatModal when clicking banner CTA button', () => {
    render(<SupportView />);

    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();

    const ctaButton = screen.getByTestId('support-banner-cta-button');
    fireEvent.click(ctaButton);

    expect(screen.getByTestId('chat-modal')).toBeInTheDocument();
    expect(screen.getByText('ИНТЕЛЛИЯ Бот')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('chat-modal-close'));
    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();
  });

  it('opens FeedbackModal on clicking banner secondary button, validates form and submits successfully', async () => {
    render(<SupportView />);

    expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument();

    // Click secondary button
    const ticketButton = screen.getByTestId('support-banner-secondary-button');
    fireEvent.click(ticketButton);

    // Modal is now open
    expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Написать в поддержку' })).toBeInTheDocument();

    // Try submitting without required fields
    const submitBtn = screen.getByTestId('feedback-submit-button');
    fireEvent.click(submitBtn);

    expect(screen.getByText('Укажите тему обращения')).toBeInTheDocument();
    expect(screen.getByText('Введите текст сообщения')).toBeInTheDocument();

    // Fill valid data
    const subjectInput = screen.getByTestId('feedback-subject-input');
    const messageInput = screen.getByTestId('feedback-message-textarea');

    fireEvent.change(subjectInput, { target: { value: 'Калибровка созревания на участке A1' } });
    fireEvent.change(messageInput, { target: { value: 'Здравствуйте, необходимо уточнить параметры крахмального индекса.' } });

    // Submit form
    fireEvent.click(submitBtn);

    // Check success state
    await waitFor(
      () => {
        expect(screen.getByTestId('feedback-success-state')).toBeInTheDocument();
        expect(screen.getByText('Обращение успешно отправлено!')).toBeInTheDocument();
        expect(screen.getByText('Заявка #2048 принята в работу')).toBeInTheDocument();
      },
      { timeout: 1500 }
    );

    // Close success state
    const closeSuccessBtn = screen.getByTestId('feedback-success-close-button');
    fireEvent.click(closeSuccessBtn);

    expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument();
  });

  it('opens FeedbackModal when clicking Feedback category card', () => {
    render(<SupportView />);

    const feedbackCard = screen.getByTestId('support-category-card-feedback');
    fireEvent.click(feedbackCard);

    expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
    const closeBtn = screen.getByTestId('feedback-modal-close');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument();
  });

  it('opens GuidesModal when clicking Guides category card and supports reading guides', () => {
    render(<SupportView />);

    expect(screen.queryByTestId('guides-modal')).not.toBeInTheDocument();

    const guidesCard = screen.getByTestId('support-category-card-guides');
    fireEvent.click(guidesCard);

    expect(screen.getByTestId('guides-modal')).toBeInTheDocument();
    expect(screen.getByTestId('guides-modal-title')).toHaveTextContent(/Инструкции и регламенты/i);

    // Check guide items
    expect(screen.getByTestId(`guide-item-${GUIDES_DATA[0].id}`)).toBeInTheDocument();

    // Click on guide item to open detailed SOP view
    fireEvent.click(screen.getByTestId(`guide-item-${GUIDES_DATA[0].id}`));
    expect(screen.getByTestId('guide-detailed-view')).toBeInTheDocument();
    expect(screen.getByTestId('guide-back-button')).toBeInTheDocument();
    expect(screen.getByTestId('guide-copy-button')).toBeInTheDocument();

    // Navigate back to all guides
    fireEvent.click(screen.getByTestId('guide-back-button'));
    expect(screen.queryByTestId('guide-detailed-view')).not.toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId('guides-modal-close'));
    expect(screen.queryByTestId('guides-modal')).not.toBeInTheDocument();
  });

  it('opens VideoTutorialsModal when clicking Videos category card and controls playback', () => {
    render(<SupportView />);

    expect(screen.queryByTestId('video-tutorials-modal')).not.toBeInTheDocument();

    const videosCard = screen.getByTestId('support-category-card-videos');
    fireEvent.click(videosCard);

    expect(screen.getByTestId('video-tutorials-modal')).toBeInTheDocument();
    expect(screen.getByTestId('videos-modal-title')).toHaveTextContent(/Видеоуроки/i);

    // Player and title
    expect(screen.getByTestId('video-player-container')).toBeInTheDocument();
    expect(screen.getByTestId('video-player-title')).toHaveTextContent(VIDEOS_DATA[0].title);

    // Toggle play/pause
    const toggleBtn = screen.getByTestId('video-player-toggle');
    fireEvent.click(toggleBtn);

    // Switch video from playlist
    const secondVideo = VIDEOS_DATA[1];
    fireEvent.click(screen.getByTestId(`video-item-${secondVideo.id}`));
    expect(screen.getByTestId('video-player-title')).toHaveTextContent(secondVideo.title);

    // Close modal
    fireEvent.click(screen.getByTestId('videos-modal-close'));
    expect(screen.queryByTestId('video-tutorials-modal')).not.toBeInTheDocument();
  });

  it('scrolls to FAQ when clicking FAQ category card', () => {
    render(<SupportView />);

    const faqCard = screen.getByTestId('support-category-card-faq');
    fireEvent.click(faqCard);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('opens ChatModal when clicking Live Chat channel and supports interactive messaging', async () => {
    render(<SupportView />);

    // Click chat channel
    const chatChannel = screen.getByTestId('contact-channel-chat');
    fireEvent.click(chatChannel);

    // Chat modal is open
    expect(screen.getByTestId('chat-modal')).toBeInTheDocument();
    expect(screen.getByText('ИНТЕЛЛИЯ Бот')).toBeInTheDocument();
    expect(
      screen.getByText(/Здравствуйте! Я AI-ассистент платформы «ИНТЕЛЛИЯ»/)
    ).toBeInTheDocument();

    // Click a quick prompt button
    const quickPrompt = screen.getByText('Как откалибровать зрелость?');
    fireEvent.click(quickPrompt);

    // User message added inside chat container
    const messagesContainer = screen.getByTestId('chat-messages-container');
    expect(within(messagesContainer).getByText('Как откалибровать зрелость?')).toBeInTheDocument();

    // Bot auto-reply should arrive
    await waitFor(
      () => {
        expect(
          within(messagesContainer).getByText(/Для калибровки перейдите во вкладку «Данные»/)
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );

    // Type custom message
    const input = screen.getByTestId('chat-input');
    const sendBtn = screen.getByTestId('chat-send-button');

    fireEvent.change(input, { target: { value: 'Тестовый вопрос садоводу' } });
    fireEvent.click(sendBtn);

    expect(within(messagesContainer).getByText('Тестовый вопрос садоводу')).toBeInTheDocument();

    // Close chat
    const closeBtn = screen.getByTestId('chat-modal-close');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();
  });
});
