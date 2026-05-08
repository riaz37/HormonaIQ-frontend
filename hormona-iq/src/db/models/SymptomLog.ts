import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class SymptomLog extends Model {
  static table = 'symptom_logs';

  @field('log_date') logDate!: string;
  @field('cycle_day') cycleDay!: number | null;
  @field('cycle_phase') cyclePhase!: string | null;
  @field('drsp_scores') drspScoresRaw!: string;
  @field('physical_symptoms') physicalSymptomsRaw!: string;
  @field('sleep_quality') sleepQuality!: number | null;
  @field('energy_level') energyLevel!: number | null;
  @field('functional_impairment') functionalImpairment!: string | null;
  @field('spotting') spotting!: boolean;
  @field('fast_log') fastLog!: boolean;
  @field('crisis_flag') crisisFlag!: boolean;
  @field('bad_day_only') badDayOnly!: boolean;
  @field('free_text_note') freeTextNote!: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('server_id') serverId!: string | null;

  get drspScores(): Record<string, number> {
    try { return JSON.parse(this.drspScoresRaw); } catch { return {}; }
  }

  get physicalSymptoms(): string[] {
    try { return JSON.parse(this.physicalSymptomsRaw); } catch { return []; }
  }
}
