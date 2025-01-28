export interface Quiz {
  id: number;
  title: string;
  questions: number;
  timeLimit: number;
  status: "Active" | "Draft";
  updatedDays: number;
}
