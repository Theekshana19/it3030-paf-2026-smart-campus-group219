import { useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';
import ToggleSwitch from './ToggleSwitch.jsx';

export default function ResourceAccessPermissionsCard() {
  const [autoRelease, setAutoRelease] = useState(false);
  const [publicDiscoverable, setPublicDiscoverable] = useState(true);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="vpn_key" className="text-xl" />
        </div>
        <h3 className="text-lg font-bold font-manrope">Access &amp; Permissions</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
          <div>
            <p className="text-sm font-bold">Auto-Release Bookings</p>
            <p className="text-xs text-on-surface-variant">
              Cancel booking if not occupied within 15 minutes
            </p>
          </div>
          <ToggleSwitch checked={autoRelease} onChange={setAutoRelease} label="Auto release bookings" />
        </div>

        <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-transparent">
          <div>
            <p className="text-sm font-bold">Public Discoverability</p>
            <p className="text-xs text-on-surface-variant">
              Allow students to find this room on the Campus App
            </p>
          </div>
          <ToggleSwitch
            checked={publicDiscoverable}
            onChange={setPublicDiscoverable}
            label="Public discoverability"
          />
        </div>
      </div>
    </div>
  );
}

