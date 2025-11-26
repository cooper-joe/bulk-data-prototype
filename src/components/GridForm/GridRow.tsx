import React from "react";
import {
  Radio,
  FlyoutMenu,
  MenuDivider,
  MenuItem,
  Popover,
  IconMore16,
  Tooltip,
} from "@dhis2/ui";
import styles from "./GridRow.module.css";
import type { Column, CellError, RowError } from "./types";

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
                label="View form..."
                onClick={() => handleAction(onViewForm)}
              />
              <MenuItem
                label="About this person"
                onClick={() => handleAction(onAboutPerson)}
              />
              <MenuDivider />
              <MenuItem
                label="Copy all data values"
                onClick={() => handleAction(onCopyValues)}
              />

              <MenuItem
                label="Paste values"
                disabled={!canPaste}
                onClick={() => handleAction(onPasteValues)}
              />
              <MenuDivider />
              <MenuItem
                label="Apply all data values to next row"
                disabled={isLastRow}
                onClick={() => handleAction(onCopyToNextRow)}
              />
              <MenuItem
                label="Apply all data values to all rows"
                onClick={() => handleAction(onCopyToAllRows)}
              />
              <MenuDivider />
              <MenuItem
                destructive
                label="Clear all row values"
                onClick={() => handleAction(onClearRow)}
              />
              <MenuItem
                destructive
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
