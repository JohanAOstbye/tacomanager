export type tacoday = {
  code: string;
  date: string | null;
  attendees: displayuser[];
};

export type displayuser = {
  name: string;
  id: string;
};
