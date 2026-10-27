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
} from 'lucide-react';
import { SpectralChannel, HyperspectralUploadState } from '../../types';
import { droneModelsList } from '../../data/mockData';
import { SpectralSampleCard } from './SpectralSampleCard';
import { useApp } from '../../context/AppContext';

interface HyperspectralUploadCardProps {
  onSave?: (data: HyperspectralUploadState) => void;
  onNavigateNext?: () => void;
  className?: string;
}

const ALL_CHANNELS: SpectralChannel[] = ['RGB', 'NIR', 'Red Edge', 'SWIR'];

export const HyperspectralUploadCard: React.FC<HyperspectralUploadCardProps> = ({
  onSave,
  onNavigateNext,
  className = '',
}) => {
  const { isEnglish, t } = useApp();
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
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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

  return (
    <div
      data-testid="hyperspectral-upload-card"
      className={`bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 min-w-0 ${className}`}
    >
      {/* Card Header */}
      <div className="mb-5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          {isEnglish ? 'Hyperspectral Orchard Survey' : 'Гиперспектральная съемка сада'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {isEnglish
            ? 'Upload & calibration of multispectral orthomosaics from aerial cameras'
            : 'Загрузка и калибровка ортофотопланов с мультиспектральных камер'}
        </p>
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
            {t('data.upload.drop') || 'Перетащите файлы сюда или выберите с компьютера'}
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
                  {isEnglish ? 'Ready for upload' : 'Готовы к загрузке'}
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
            </div>
          )}
        </div>

        {/* Spectral Sample Preview Card */}
        <div className="md:col-span-5 flex justify-center md:justify-end min-w-0">
          <SpectralSampleCard className="w-full h-full flex justify-between" />
        </div>
      </div>

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
