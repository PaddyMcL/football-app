export interface Footballer {
    _id?: string;
    name: string;
    age: number;
    position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
    team: string;
    nationality?: string;
    retired?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }