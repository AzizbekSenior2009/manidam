import React from 'react';
import './StatusBar.css';

export default function StatusBar() {
  return (
    <div className="status-bar-container" aria-hidden="true">
      <span className="status-time">9:41</span>
      <div className="status-notch-spacer"></div>
      <div className="status-icons">
        {/* Signal bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="8" width="3" height="3" rx="0.8" />
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.8" />
          <rect x="9" y="3" width="3" height="8" rx="0.8" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.8" />
        </svg>
        {/* Wifi */}
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.2-3.1a6 6 0 018.4 0 .9.9 0 001.3-1.3 7.8 7.8 0 00-11 0 .9.9 0 001.3 1.3zm-2.8-2.8a10 10 0 0114 0 .9.9 0 001.3-1.3 11.8 11.8 0 00-16.6 0 .9.9 0 001.3 1.3z" />
        </svg>
        {/* Battery */}
        <div className="battery-icon">
          <div className="battery-level"></div>
        </div>
      </div>
    </div>
  );
}
