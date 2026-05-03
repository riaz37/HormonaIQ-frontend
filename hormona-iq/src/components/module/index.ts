// Barrel export for the module component family.

export { ModuleSheet, Fallback } from './ModuleSheet';
export type { ModuleSheetProps, FallbackProps } from './ModuleSheet';

export {
  MHeader,
  Stat,
  Severity,
  NRS,
  ScaleRow,
  Spark,
  EvidenceBar,
  ToggleRow,
  MSection,
  Checklist,
  severityColorForNrs,
  severityColorForLevel,
} from './ModuleUI';
export type {
  MHeaderProps,
  StatProps,
  Trend,
  SeverityProps,
  NRSProps,
  ScaleRowProps,
  SparkProps,
  EvidenceBarProps,
  EvidenceLevel,
  ToggleRowProps,
  MSectionProps,
  ChecklistProps,
  ChecklistItem,
  Severity0to3,
} from './ModuleUI';

export { BodyMap, DEFAULT_BODY_MAP_ZONES } from './BodyMap';
export type { BodyMapProps, BodyMapZone } from './BodyMap';

export { TrackerLog } from './TrackerLog';
export type { TrackerLogProps, TrackerLogEntry } from './TrackerLog';
