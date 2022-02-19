export type tacoday = {
  _id: string
  tid: string
  date: Date
  attendees: displayuser[]
  creator: string
}

export type displayuser = {
  displayname: string
  id: string
  image: undefined | string
  joined?: Date
}

export type sessionuser = {
  _id: string
  name: string | undefined
  email: string
  image: string | undefined
  emailVerified: string | null
  displayname: string | undefined
}

export type tacosession = {
  expires: string
  user: sessionuser
}
