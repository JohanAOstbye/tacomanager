export const dateformatter = {
  short: (date: Date) => {
    return date.toLocaleString('no', {
      month: 'numeric',
      day: 'numeric',
    })
  },
  medium: (date: Date) => {
    return date.toLocaleString('no', {
      month: 'long',
      day: 'numeric',
    })
  },
  long: (date: Date) => {
    return date.toLocaleString('no', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  },
  short_wtime: (date: Date) => {
    return date
      .toLocaleString('no', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', '')
  },
  medium_wtime: (date: Date) => {
    return date
      .toLocaleString('no', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', '')
  },
  long_wtime: (date: Date) => {
    return date
      .toLocaleString('no', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', '')
  },
  time: (date: Date) => {
    return date.toLocaleString('no', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
  },
  day: (date: Date) => {
    return date.toLocaleString('no', {
      weekday: 'long',
    })
  },
}
