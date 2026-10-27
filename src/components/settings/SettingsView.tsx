import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import {
  NavigationTab,
  GeneralSettings,
  HardwareSensor,
  NotificationSettings,
  DataManagementSettings,
  FarmProfileSettings,
} from '../../types';
import {
  initialGeneralSettings,
  initialSensors,
  initialNotificationSettings,
  initialDataManagementSettings,
  initialFarmProfileSettings,
} from '../../data/mockSettings';
import { GeneralSettingsCard } from './GeneralSettingsCard';
import { SensorsCard } from './SensorsCard';
import { NotificationsCard } from './NotificationsCard';
import { DataManagementCard } from './DataManagementCard';
import { FarmProfileCard } from './FarmProfileCard';
import { SupportBanner } from './SupportBanner';
import { EditFarmModal } from './EditFarmModal';
import { HardwareModal } from './HardwareModal';

export interface SettingsViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  className?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onNavigate,
  className = '',
}) => {
  // State for settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(initialGeneralSettings);
  const [sensors, setSensors] = useState<HardwareSensor[]>(initialSensors);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    initialNotificationSettings
  );
  const [dataManagementSettings, setDataManagementSettings] = useState<DataManagementSettings>(
    initialDataManagementSettings
  );
  const [farmProfile, setFarmProfile] = useState<FarmProfileSettings>(initialFarmProfileSettings);

  // Modals state
  const [isEditFarmModalOpen, setIsEditFarmModalOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleSaveFarm = (updated: FarmProfileSettings) => {
    setFarmProfile(updated);
    showToast(`Данные хозяйства «${updated.name}» успешно обновлены!`);
  };

  const handleBackupSuccess = (timestamp: string) => {
    showToast(`Резервная копия от ${timestamp} успешно создана!`);
  };

  const handleRefreshSensors = () => {
    // Simulated ping updates
    setSensors((prev) =>
      prev.map((s) => ({
        ...s,
        lastPing: 'только что',
      }))
    );
  };

  return (
    <div
      data-testid="settings-view"
      className={`space-y-4 sm:space-y-5 w-full min-w-0 ${className}`}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            data-testid="settings-toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 bg-[#05382b] text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-600/40 text-xs font-semibold max-w-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="flex-1">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 text-emerald-200/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Title (Accessible H1 for screen readers and automated tests) */}
      <h1 className="sr-only">Настройки</h1>

      {/* Two-column layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* Left Column: General & Sensors */}
        <div className="space-y-4 sm:space-y-5 min-w-0">
          <GeneralSettingsCard
            settings={generalSettings}
            onChange={setGeneralSettings}
          />

          <SensorsCard
            sensors={sensors}
            onConfigureHardware={() => setIsHardwareModalOpen(true)}
          />
        </div>

        {/* Right Column: Notifications, Data Management, Farm Profile */}
        <div className="space-y-4 sm:space-y-5 min-w-0">
          <NotificationsCard
            settings={notificationSettings}
            onChange={setNotificationSettings}
          />

          <DataManagementCard
            settings={dataManagementSettings}
            onChange={setDataManagementSettings}
            onBackupSuccess={handleBackupSuccess}
          />

          <FarmProfileCard
            farm={farmProfile}
            onEdit={() => setIsEditFarmModalOpen(true)}
          />
        </div>
      </div>

      {/* Full width bottom banner */}
      <div className="w-full min-w-0 pt-2">
        <SupportBanner onNavigate={onNavigate} />
      </div>

      {/* Modals */}
      <EditFarmModal
        isOpen={isEditFarmModalOpen}
        onClose={() => setIsEditFarmModalOpen(false)}
        currentFarm={farmProfile}
        onSave={handleSaveFarm}
      />

      <HardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        sensors={sensors}
        onRefreshSensors={handleRefreshSensors}
      />
    </div>
  );
};
