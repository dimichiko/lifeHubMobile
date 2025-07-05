export type Carpeta = {
  id: string;
  nombre: string;
  color: string;
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  goal: number;
  type?: 'habit' | 'dream';
  carpetaIds?: string[];
};

export type HabitProgress = {
  [habitId: string]: number[]; // 7 días, valores 0-3
}; 