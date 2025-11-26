import React, { useState, useCallback } from "react";
import styles from "./PrototypeControls.module.css";

interface PrototypeControlsProps {
  rowErrorsEnabled: boolean;
  cellErrorsEnabled: boolean;
  onToggleRowErrors: () => void;
  onToggleCellErrors: () => void;
  onFillData: () => void;
  onClearData: () => void;
}

export const PrototypeControls: React.FC<PrototypeControlsProps> = ({
  rowErrorsEnabled,
  cellErrorsEnabled,
  onToggleRowErrors,
  onToggleCellErrors,
  onFillData,
  onClearData,
}) => {
  const [minimized, setMinimized] = useState(false);

  const toggleMinimize = useCallback(() => {
    setMinimized((m) => !m);
  }, []);

  return (
    <div className={`${styles.panel} ${minimized ? styles.panelMinimized : ""}`}>
      <div
        className={`${styles.header} ${minimized ? styles.headerMinimized : ""}`}
        onClick={toggleMinimize}
      >
        <div className={styles.titleGroup}>
          <span className={styles.title}>Prototype Controls</span>
        </div>
        <button className={styles.toggleBtn} onClick={toggleMinimize}>
          {minimized ? "▲" : "▼"}
        </button>
      </div>

      {!minimized && (
        <div className={styles.content}>
          <div className={styles.sectionLabel}>Error States</div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={rowErrorsEnabled}
              onChange={onToggleRowErrors}
            />
            <span className={styles.checkboxLabel}>Row Errors</span>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={cellErrorsEnabled}
              onChange={onToggleCellErrors}
            />
            <span className={styles.checkboxLabel}>Cell Errors</span>
          </label>

          <div className={styles.sectionLabel}>Data Actions</div>

          <button className={styles.actionBtn} onClick={onFillData}>
            Fill Sample Data
          </button>

          <button className={styles.dangerBtn} onClick={onClearData}>
            Clear All Data
          </button>
        </div>
      )}
    </div>
  );
};
