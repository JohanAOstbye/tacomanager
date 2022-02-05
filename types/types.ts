export type tacoday = {
  _id: string;
  tid: string;
  date_string: string | null;
  date?: Date | null;
  attendees: displayuser[];
  creator: string;
};

export type displayuser = {
  username: string;
  id: string;
  image: undefined | string;
  joined?: Date;
  joined_string: string;
};

export type sessionuser = {
  _id: string;
  name: string | undefined;
  email: string;
  image: string | undefined;
  emailVerified: string | null;
  displayname: string | undefined;
};

export type tacosession = {
  expires: string;
  user: sessionuser;
};
