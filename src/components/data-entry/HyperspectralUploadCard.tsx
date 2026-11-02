import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Upload,
  Calendar,
  Send,
  Eye,
  FileImage,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  RotateCcw,
  Check,
} from 'lucide-react';
import { SpectralChannel, HyperspectralUploadState, DroneAIDetectionResult } from '../../types';
import { droneModelsList } from '../../data/mockData';
import { SpectralSampleCard } from './SpectralSampleCard';
import { useApp } from '../../context/AppContext';

export interface HyperspectralUploadCardProps {
  onSave?: (data: HyperspectralUploadState) => void;
  onNavigateNext?: () => void;
  className?: string;
}

const ALL_CHANNELS: SpectralChannel[] = ['RGB', 'NIR', 'Red Edge', 'SWIR'];

const DEFAULT_DETECTION_RESULT: DroneAIDetectionResult = {
  fruitsDetectedCount: 42,
  avgDiameterMm: 73.5,
  calibreGrade: '1-й товарный сорт (70–80 мм)',
  calibreGradeEn: 'Grade 1 Commercial (70–80 mm)',
  avgNdvi: 0.82,
  chlorophyllIndex: 0.74,
  defectsSummary: 'Парша 0% • Сетка 2.1% (Норма)',
  defectsSummaryEn: 'Scab 0% • Russeting 2.1% (Normal)',
};

export const HyperspectralUploadCard: React.FC<HyperspectralUploadCardProps> = ({
  onSave,
  onNavigateNext,
  className = '',
}) => {
  const { isEnglish, t, addSurveyEntry, addNotification } = useApp();
  const [surveyDate, setSurveyDate] = useState('2025-08-12');
  const [droneModel, setDroneModel] = useState('DJI Mavic 3M');
  const [channels, setChannels] = useState<SpectralChannel[]>([
    'RGB',
    'NIR',
    'Red Edge',
    'SWIR',
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // AI Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [detectionResult, setDetectionResult] = useState<DroneAIDetectionResult | null>(null);
  const [isSavedToHistory, setIsSavedToHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleChannel = (channel: SpectralChannel) => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setDetectionResult(null);
      setIsSavedToHistory(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
      setDetectionResult(null);
      setIsSavedToHistory(false);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (files.length <= 1) {
      setDetectionResult(null);
      setIsSavedToHistory(false);
    }
  };

  // 1-Click Load Test UAV Sample
  const handleLoadDemoFlight = () => {
    // Create a mock File object
    const testFile = new File(
      ['mock raw multispectral orthomosaic binary data'],
      'DJI_20250814_multispectral_sector4.tif',
      { type: 'image/tiff', lastModified: Date.now() }
    );
    // Emulate a 48.2 MB size property
    Object.defineProperty(testFile, 'size', { value: 50541363, configurable: true });

    setFiles([testFile]);
    setSurveyDate('2025-08-14');
    setDroneModel('DJI Mavic 3M');
    setChannels(['RGB', 'NIR', 'Red Edge']);
    setDetectionResult(null);
    setIsSavedToHistory(false);
  };

  // Run AI Detection Simulation
  const handleRunAIAnalysis = () => {
    if (files.length === 0 || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStepIndex(0);
    setDetectionResult(null);
    setIsSavedToHistory(false);

    // Step 1: Calibration (350ms)
    setTimeout(() => {
      setAnalysisProgress(38);
      setAnalysisStepIndex(1);

      // Step 2: YOLO Detection (700ms)
      setTimeout(() => {
        setAnalysisProgress(78);
        setAnalysisStepIndex(2);

        // Step 3: NDVI & Calibre Computation (1050ms)
        setTimeout(() => {
          setAnalysisProgress(100);
          setAnalysisStepIndex(3);

          setTimeout(() => {
            setIsAnalyzing(false);
            setDetectionResult(DEFAULT_DETECTION_RESULT);
          }, 300);
        }, 350);
      }, 350);
    }, 350);
  };

  // Register into survey history & notification
  const handleRegisterToSurveyHistory = () => {
    if (!detectionResult) return;

    addSurveyEntry({
      date: surveyDate,
      label: `${droneModel} - ${isEnglish ? 'Sector 4 Survey' : 'Съемка Сектора 4'}`,
      droneModel: droneModel,
      resolutionCmPx: 1.8,
      ndviAvg: detectionResult.avgNdvi,
      weatherNote: isEnglish ? 'Clear sky, solar elevation 52°' : 'Ясно, зенитное солнце 52°',
    });

    addNotification({
      category: 'ai',
      badgeText: isEnglish ? 'UAV Survey Logged' : 'Съемка БПЛА сохранена',
      title: isEnglish
        ? `UAV Flight Processed: ${droneModel}`
        : `Облет БПЛА обработан: ${droneModel}`,
      description: isEnglish
        ? `Detected ${detectionResult.fruitsDetectedCount} apples, avg calibre ${detectionResult.avgDiameterMm}mm, NDVI ${detectionResult.avgNdvi}`
        : `Распознано ${detectionResult.fruitsDetectedCount} плодов, калибр ${detectionResult.avgDiameterMm} мм, NDVI ${detectionResult.avgNdvi}`,
      isRead: false,
      actionText: isEnglish ? 'View Map' : 'Смотреть карту',
      actionTarget: 'map',
      filterCategories: ['important'],
      dotColor: 'teal',
      iconType: 'ai',
    });

    setIsSavedToHistory(true);
  };

  const handleResetAnalysis = () => {
    setFiles([]);
    setDetectionResult(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setIsSavedToHistory(false);
  };

  const handleSubmit = () => {
    const uploadData: HyperspectralUploadState = {
      surveyDate,
      droneModel,
      channels,
      files,
    };
    if (onSave) {
      onSave(uploadData);
    }
    if (onNavigateNext) {
      onNavigateNext();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const analysisStepLabels = isEnglish
    ? [
        'Calibrating multispectral radiometric channels (RGB/NIR)...',
        'Neural detection of apples & canopy contours (YOLOv11-Agro)...',
        'Computing NDVI vegetation index & fruit calibre distribution...',
        'Analysis completed successfully!',
      ]
    : [
        'Калибровка радиометрических каналов RGB / Red Edge...',
        'Нейросетевая детекция плодов и контуров кроны (YOLOv11-Agro)...',
        'Генерация тепловой карты NDVI и гранулометрии калибра...',
        'Анализ снимка успешно завершен!',
      ];

  return (
    <div
      data-testid="hyperspectral-upload-card"
      className={`bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 min-w-0 ${className}`}
    >
      {/* Card Header & 1-Click Demo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isEnglish ? 'Hyperspectral Orchard Survey' : 'Гиперспектральная съемка сада'}
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              YOLOv11-Agro
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEnglish
              ? 'Multi-channel orthomosaic upload, AI fruit counting, and canopy NDVI calibration'
              : 'Загрузка ортофотопланов, ИИ-детекция плодов и расчет вегетационного индекса NDVI'}
          </p>
        </div>

        {/* 1-Click Test Button */}
        <button
          type="button"
          data-testid="btn-load-test-flight"
          onClick={handleLoadDemoFlight}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 self-start sm:self-auto"
          title={isEnglish ? 'Load sample UAV flight orthomosaic' : 'Загрузить тестовый снимок БПЛА'}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span>
            {isEnglish ? 'Load Test UAV Flight (48 MB)' : '⚡ Тестовый снимок БПЛА (48 МБ)'}
          </span>
        </button>
      </div>

      {/* Top Section: Drop Zone (Left) & Spectral Sample (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-w-0">
        {/* Drag & Drop Zone */}
        <div
          data-testid="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`md:col-span-7 flex flex-col items-center justify-center p-5 sm:p-6 rounded-xl border-2 border-dashed transition-all text-center min-w-0 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
              : 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
          }`}
        >
          {/* Upload Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mb-1">
            {t('data.upload.title') || 'Загрузите снимки'}
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mb-3.5">
            {t('data.upload.drop') || 'Перетащите файлы GeoTIFF, TIFF или JPG сюда'}
          </p>

          {/* Trigger button */}
          <button
            type="button"
            data-testid="select-files-button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('data.upload.select') || 'Выбрать файлы'}</span>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.tif,.tiff"
            data-testid="file-upload-input"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Uploaded Files Preview List */}
          {files.length > 0 && (
            <div
              data-testid="uploaded-files-list"
              className="mt-4 w-full space-y-2 text-left border-t border-emerald-200/60 pt-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">
                  {isEnglish ? `Selected files: ${files.length}` : `Выбрано файлов: ${files.length}`}
                </span>
                <span className="text-emerald-700 font-medium">
                  {isEnglish ? 'Ready for AI processing' : 'Готовы к ИИ-анализу'}
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    data-testid={`file-item-${idx}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <FileImage className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{file.name}</span>
                      <span className="text-slate-400 flex-shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        {isEnglish ? 'Ready' : 'Готов'}
                      </span>
                      <button
                        type="button"
                        data-testid={`remove-file-${idx}`}
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title={isEnglish ? 'Remove file' : 'Удалить файл'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action: Run AI Analysis Button */}
              {!detectionResult && !isAnalyzing && (
                <div className="pt-2">
                  <button
                    type="button"
                    data-testid="btn-run-ai-analysis"
                    onClick={handleRunAIAnalysis}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#05382b] to-[#047857] hover:from-[#07503b] hover:to-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>
                      {isEnglish
                        ? 'Run AI Detection & NDVI Processing'
                        : 'Запустить ИИ-детекцию и расчет NDVI'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Spectral Sample Preview Card */}
        <div className="md:col-span-5 flex justify-center md:justify-end min-w-0">
          <SpectralSampleCard className="w-full h-full flex justify-between" />
        </div>
      </div>

      {/* AI Analysis In-Progress Scanning Bar */}
      {isAnalyzing && (
        <div
          data-testid="ai-analysis-progress"
          className="mt-5 p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2.5 transition-all"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
              {analysisStepLabels[analysisStepIndex]}
            </span>
            <span className="font-bold text-emerald-700">{analysisProgress}%</span>
          </div>
          <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* AI Detection Results Card */}
      {detectionResult && (
        <div
          data-testid="ai-detection-results"
          className="mt-5 p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4 transition-all"
        >
          {/* Header of results */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                AI
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isEnglish
                    ? 'AI Orthomosaic Detection Results'
                    : 'Результаты нейросетевого анализа снимка'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isEnglish
                    ? 'YOLOv11-Agro Fruit Detection • High Confidence 96.4%'
                    : 'Модель YOLOv11-Agro • Распознавание плодов • Точность 96.4%'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="btn-reset-analysis"
                onClick={handleResetAnalysis}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title={isEnglish ? 'Clear and upload another image' : 'Очистить'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEnglish ? 'Reset' : 'Сбросить'}</span>
              </button>
            </div>
          </div>

          {/* Metrics Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Fruits detected */}
            <div
              data-testid="metric-fruit-count"
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
            >
              <div className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'Fruits Detected' : 'Плодов обнаружено'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {detectionResult.fruitsDetectedCount} <span className="text-xs font-medium text-slate-500">{isEnglish ? 'pcs' : 'шт.'}</span>
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                {isEnglish ? 'High canopy density' : 'Высокая плотность'}
              </div>
            </div>

            {/* Metric 2: Calibre */}
            <div
              data-testid="metric-avg-calibre"
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
            >
              <div className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'Avg Calibre' : 'Средний калибр'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {detectionResult.avgDiameterMm} <span className="text-xs font-medium text-slate-500">{isEnglish ? 'mm' : 'мм'}</span>
              </div>
              <div className="text-xs text-emerald-700 font-semibold truncate mt-1">
                {isEnglish ? detectionResult.calibreGradeEn : detectionResult.calibreGrade}
              </div>
            </div>

            {/* Metric 3: NDVI */}
            <div
              data-testid="metric-avg-ndvi"
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
            >
              <div className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'Mean NDVI' : 'Средний NDVI'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-emerald-800 mt-0.5">
                {detectionResult.avgNdvi}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                {isEnglish ? 'Active photosynthesis' : 'Активный фотосинтез'}
              </div>
            </div>

            {/* Metric 4: Chlorophyll / NDRE */}
            <div
              data-testid="metric-chlorophyll"
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
            >
              <div className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'NDRE Index' : 'Индекс хлорофилла'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {detectionResult.chlorophyllIndex}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                {isEnglish ? 'Optimal N level' : 'Оптимальный азот'}
              </div>
            </div>
          </div>

          {/* Phytosanitary state banner */}
          <div
            data-testid="metric-defects"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 text-xs"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-slate-700">
                {isEnglish ? 'Phytosanitary Assessment:' : 'Фитосанитарный мониторинг:'}
              </span>
              <span className="text-slate-800 font-medium">
                {isEnglish ? detectionResult.defectsSummaryEn : detectionResult.defectsSummary}
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
              <Check className="w-3 h-3" />
              {isEnglish ? 'Passed' : 'В норме'}
            </span>
          </div>

          {/* Action Row: Save to Survey History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              {isEnglish
                ? 'Register this scan to orchard flight telemetry and garden history'
                : 'Внести результаты детекции в телеметрию облетов сада'}
            </span>

            <button
              type="button"
              data-testid="btn-save-survey-history"
              onClick={handleRegisterToSurveyHistory}
              disabled={isSavedToHistory}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isSavedToHistory
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#07503b] hover:bg-[#096047] text-white active:scale-95'
              }`}
            >
              {isSavedToHistory ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>
                    {isEnglish ? 'Registered in UAV History!' : 'Внесено в историю облетов!'}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {isEnglish ? 'Register in Survey History' : 'Внести в историю облетов БПЛА'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Section: Survey Metadata & Spectral Channels */}
      <div className="mt-6 pt-5 border-t border-slate-100 space-y-5 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Survey Date */}
          <div>
            <label
              htmlFor="survey-date"
              className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('data.upload.date') || 'Дата съемки'}</span>
            </label>
            <input
              id="survey-date"
              type="date"
              data-testid="survey-date-input"
              value={surveyDate}
              onChange={(e) => setSurveyDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Drone Model */}
          <div>
            <label
              htmlFor="drone-model"
              className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('data.upload.drone') || 'Модель БПЛА'}</span>
            </label>
            <select
              id="drone-model"
              data-testid="drone-model-select"
              value={droneModel}
              onChange={(e) => setDroneModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
            >
              {droneModelsList.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Spectral Channels Checkboxes */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('data.upload.channels') || 'Спектральные каналы'}</span>
          </label>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {ALL_CHANNELS.map((ch) => {
              const isChecked = channels.includes(ch);
              return (
                <label
                  key={ch}
                  data-testid={`channel-label-${ch}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    data-testid={`channel-checkbox-${ch}`}
                    checked={isChecked}
                    onChange={() => handleToggleChannel(ch)}
                    className="w-4 h-4 rounded text-emerald-600 accent-[#07503b] cursor-pointer"
                  />
                  <span>{ch}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* CTA Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            data-testid="save-and-continue-button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isEnglish ? 'Save & Continue' : 'Сохранить и Продолжить'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HyperspectralUploadCard;
