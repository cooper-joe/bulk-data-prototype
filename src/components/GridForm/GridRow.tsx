import React from "react";
import {
  Radio,
  FlyoutMenu,
  MenuDivider,
  MenuItem,
  Popover,
  IconMore16,
  Tooltip,
  IconInfo16,
  IconCopy16,
  IconDelete16,
  IconCross16,
  IconList16,
} from "@dhis2/ui";
import styles from "./GridRow.module.css";
import type { Column, CellError, RowError } from "./types";

// Custom 16px icons for menu items
const IconPaste16 = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10 1H6C5.45 1 5 1.45 5 2V3H3C2.45 3 2 3.45 2 4V14C2 14.55 2.45 15 3 15H13C13.55 15 14 14.55 14 14V4C14 3.45 13.55 3 13 3H11V2C11 1.45 10.55 1 10 1ZM6 2H10V4H6V2ZM13 14H3V4H5V5H11V4H13V14Z" />
    <path d="M5 8H11V9H5V8Z" />
    <path d="M5 10.5H9V11.5H5V10.5Z" />
  </svg>
);

const IconApplyNext16 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
  >
    <rect x="2.5" y="2.5" width="11" height="3" rx="0.5" strokeWidth="1" />
    <rect
      x="2.5"
      y="10.5"
      width="11"
      height="3"
      rx="0.5"
      strokeWidth="1"
      strokeOpacity="0.5"
    />
    <path
      d="M8 6.5V9.5M5.5 8L8 10.5L10.5 8"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconApplyAll16 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
  >
    <rect x="2.5" y="1.5" width="11" height="2" rx="0.5" strokeWidth="1" />
    <rect
      x="2.5"
      y="7"
      width="11"
      height="2"
      rx="0.5"
      strokeWidth="1"
      strokeOpacity="0.5"
    />
    <rect
      x="2.5"
      y="12.5"
      width="11"
      height="2"
      rx="0.5"
      strokeWidth="1"
      strokeOpacity="0.5"
    />
    <path
      d="M8 4V6M6 5L8 7L10 5"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 9.5V11.5M6 10.5L8 12.5L10 10.5"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.5"
    />
    <path
      d="M8 9.25L8 11.75M8 11.75L6 9.75M8 11.75L10 9.75"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

interface GridRowProps {
  index: number;
  columns: Column[];
  data: any;
  errors?: CellError[];
  rowError?: RowError;
  onChange: (data: any) => void;
  highlightedColumnId: string | null;
  onViewForm: () => void;
  onAboutPerson: () => void;
  onCopyValues: () => void;
  onCopyToNextRow: () => void;
  onCopyToAllRows: () => void;
  canPaste: boolean;
  onPasteValues: () => void;
  onClearRow: () => void;
  onRemoveRow: () => void;
  totalRows: number;
}

export const GridRow: React.FC<GridRowProps> = ({
  index,
  columns,
  data,
  errors = [],
  rowError,
  onChange,
  highlightedColumnId,
  onViewForm,
  onAboutPerson,
  onCopyValues,
  onCopyToNextRow,
  onCopyToAllRows,
  canPaste,
  onPasteValues,
  onClearRow,
  onRemoveRow,
  totalRows,
}) => {
  const getErrorForColumn = (columnId: string): CellError | undefined => {
    return errors.find((error) => error.columnId === columnId);
  };
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isActionHovered, setIsActionHovered] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null!); // non-null assertion for DHIS2 Popover
  const justClosedRef = React.useRef(false);

  const handleCellChange = (columnId: string, value: any) => {
    onChange({ ...data, [columnId]: value });
  };

  const handleMenuToggle = () => {
    if (justClosedRef.current) {
      justClosedRef.current = false;
      return;
    }
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    justClosedRef.current = true;
    setIsMenuOpen(false);
    setIsActionHovered(false);
    // Reset the flag after the current event completes
    setTimeout(() => {
      justClosedRef.current = false;
    }, 0);
  };

  const handleAction = (action: () => void) => {
    handleMenuClose();
    action();
  };

  const isLastRow = index === totalRows - 1;

  return (
    <div
      className={`${styles.row} ${index % 2 === 0 ? styles.even : styles.odd} ${
        isMenuOpen || isActionHovered ? styles.rowActive : ""
      }`}
    >
      {rowError && (
        <Tooltip content={rowError.message} placement="right" openDelay={200}>
          {({ onMouseOver, onMouseOut, ref }) => (
            <div
              ref={ref as React.Ref<HTMLDivElement>}
              className={styles.rowErrorBadge}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="5" y="1" width="2" height="6" fill="white" />
                <rect x="5" y="9" width="2" height="2" fill="white" />
              </svg>
            </div>
          )}
        </Tooltip>
      )}
      {columns.map((col) => {
        const cellError = getErrorForColumn(col.id);
        const hasError = !!cellError;

        const cellElement = (tooltipProps?: {
          onMouseOver: () => void;
          onMouseOut: () => void;
          onFocus: () => void;
          onBlur: () => void;
          ref: React.Ref<HTMLDivElement>;
        }) => (
          <div
            key={col.id}
            ref={tooltipProps?.ref}
            onMouseOver={tooltipProps?.onMouseOver}
            onMouseOut={tooltipProps?.onMouseOut}
            onFocus={tooltipProps?.onFocus}
            onBlur={tooltipProps?.onBlur}
            tabIndex={hasError ? 0 : undefined}
            className={`${styles.cell} ${
              highlightedColumnId === col.id ? styles.cellHighlighted : ""
            } ${col.type === "text" && !col.readOnly ? styles.cellText : ""} ${
              col.readOnly ? styles.cellReadOnly : ""
            } ${hasError ? styles.cellError : ""}`}
            style={{ width: col.width, minWidth: col.width }}
          >
            {col.readOnly ? (
              <span className={styles.readOnlyValue}>{data[col.id] || ""}</span>
            ) : col.type === "text" ? (
              <input
                type="text"
                className={`${styles.textInput} ${
                  hasError ? styles.textInputError : ""
                }`}
                value={data[col.id] || ""}
                onChange={(e) => handleCellChange(col.id, e.target.value)}
              />
            ) : col.type === "radio" ? (
              <div className={styles.radioGroup}>
                {col.options?.map((option) => (
                  <Radio
                    dense
                    key={option}
                    label={option}
                    value={option}
                    checked={data[col.id] === option}
                    onChange={({ value }: { value?: string }) =>
                      handleCellChange(col.id, value ?? "")
                    }
                    name={`${col.id}-${index}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );

        return hasError ? (
          <Tooltip
            key={col.id}
            content={cellError.message}
            placement="top"
            openDelay={500}
          >
            {(props) => cellElement(props as any)}
          </Tooltip>
        ) : (
          cellElement()
        );
      })}
      <div
        className={`${styles.actionCell} ${
          isMenuOpen ? styles.actionCellActive : ""
        }`}
        onMouseEnter={() => setIsActionHovered(true)}
        onMouseLeave={() => setIsActionHovered(false)}
        onClick={handleMenuToggle}
      >
        <button ref={buttonRef} className={styles.moreButton}>
          <IconMore16 />
        </button>
        {isMenuOpen && buttonRef.current && (
          <Popover
            reference={buttonRef}
            placement="bottom-end"
            onClickOutside={handleMenuClose}
            arrow={false}
          >
            <FlyoutMenu dense>
              <MenuItem
                icon={<IconList16 />}
                label="View form..."
                onClick={() => handleAction(onViewForm)}
              />
              <MenuItem
                label="About this person"
                icon={<IconInfo16 />}
                onClick={() => handleAction(onAboutPerson)}
              />
              <MenuDivider />
              <MenuItem
                label="Copy all data values"
                icon={<IconCopy16 />}
                onClick={() => handleAction(onCopyValues)}
              />

              <MenuItem
                label="Paste values"
                icon={<IconPaste16 />}
                disabled={!canPaste}
                onClick={() => handleAction(onPasteValues)}
              />
              <MenuDivider />
              <MenuItem
                label="Apply all data values to next row"
                icon={<IconApplyNext16 />}
                disabled={isLastRow}
                onClick={() => handleAction(onCopyToNextRow)}
              />
              <MenuItem
                label="Apply all data values to all rows"
                icon={<IconApplyAll16 />}
                onClick={() => handleAction(onCopyToAllRows)}
              />
              <MenuDivider />
              <MenuItem
                destructive
                icon={<IconCross16 />}
                label="Clear all row values"
                onClick={() => handleAction(onClearRow)}
              />
              <MenuItem
                destructive
                icon={<IconDelete16 />}
                label="Remove row"
                onClick={() => handleAction(onRemoveRow)}
              />
            </FlyoutMenu>
          </Popover>
        )}
      </div>
    </div>
  );
};
