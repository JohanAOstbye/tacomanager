export type tacoday = {
  _id: string;
  tid: string;
  date_string: string | null;
  date?: Date | null;
  attendees: displayuser[];
};

export type displayuser = {
  username: string;
  id: string;
  image: undefined | string;
  joined?: Date;
  joined_string: string;
};
