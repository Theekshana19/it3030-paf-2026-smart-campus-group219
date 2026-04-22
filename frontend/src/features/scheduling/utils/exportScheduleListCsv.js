/**
 * Escape a single CSV cell (RFC-style).
 * @param {string|number|boolean|null|undefined} value
 */
function csvCell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build CSV text from overview table rows.
 * @param {Array<Record<string, unknown>>} rows
 * @returns {string}
 */
export function buildScheduleListCsv(rows) {
  const headers = [
    'Schedule ID',
    'Resource ID',
    'Resource Name',
    'Resource Code',
    'Building / Location',
    'Schedule Date',
    'Time Range',
    'Target Status',
    'Conflict',
    'Reason Note',
  ];
  const lines = [headers.map(csvCell).join(',')];
  (rows || []).forEach((row) => {
    lines.push(
      [
        row.scheduleId,
        row.resourceId,
        row.resourceName,
        row.resourceCode,
        row.locationLabel || row.building,
        row.scheduleDate || row.scheduleDateLabel,
        row.timeRangeLabel,
        row.targetStatus,
        row.hasConflict ? 'Yes' : 'No',
        row.reasonNote,
      ]
        .map(csvCell)
        .join(',')
    );
  });
  return lines.join('\r\n');
}

/**
 * Trigger browser download of CSV content.
 * @param {string} csvText
 * @param {string} filename
 */
export function downloadCsv(csvText, filename) {
  const blob = new Blob([`\uFEFF${csvText}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export schedule rows as a downloaded CSV file.
 * @param {Array<Record<string, unknown>>} rows
 * @param {{ prefix?: string }} [options]
 */
export function exportScheduleListAsCsv(rows, options = {}) {
  const prefix = options.prefix || 'status-schedules';
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const csv = buildScheduleListCsv(rows);
  downloadCsv(csv, `${prefix}-${stamp}.csv`);
}
