export interface GameModule {
  event_number?: number;
  league_name?: string;
  event: {
    A: string;
    BKS: string;
    DT: string;
    I: string;
    ISH: string;
    MN: string;
    PR: string;
    T1: string;
    T1I: string;
    T2: string;
    T2I: string;
    sc: string;
    sce: string;
  };

  markets?: any[];
}
