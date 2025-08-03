export interface DayTimeKeeping {
  date: string;         // ISO date string, e.g. "2025-08-11"
  shift_start: string;  // ISO time string, e.g. "08:00"
  shift_end: string;    // ISO time string, e.g. "17:00"
}

export interface DayTimeKeepingRegisForm {
  regis_list: DayTimeKeeping[];
}