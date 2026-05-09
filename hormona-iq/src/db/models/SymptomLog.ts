// SymptomLog — plain type stub for mock-data mode.
// WatermelonDB removed; data lives in useLogStore (Zustand + AsyncStorage).

export default class SymptomLog {
  logDate: string = '';
  cycleDay: number | null = null;
  cyclePhase: string | null = null;
  drspScoresRaw: string = '{}';
  physicalSymptomsRaw: string = '[]';
  sleepQuality: number | null = null;
  energyLevel: number | null = null;
  functionalImpairment: string | null = null;
  spotting: boolean = false;
  fastLog: boolean = false;
  crisisFlag: boolean = false;
  badDayOnly: boolean = false;
  freeTextNote: string | null = null;
  serverId: string | null = null;
}
