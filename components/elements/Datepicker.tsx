import React, { InputHTMLAttributes, useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { dateformatter } from '../../lib/formatting'

const Datepicker = ({
  date,
  updateDate,
  ...props
}: {
  date: Date
  updateDate: (date: Date) => void
} & InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false)

  const weekdays = () => {
    const weekdays = []
    const d = new Date()

    while (d.getDay() > 0) {
      d.setDate(d.getDate() + 1)
    }

    while (weekdays.length < 7) {
      weekdays.push(
        d.toLocaleString('no', { weekday: 'short' }).replace('.', '')
      )
      d.setDate(d.getDate() + 1)
    }
    return weekdays
  }

  const days = () => {
    const days = Array(
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    )
      .fill(1)
      .map((_, i) => i + 1)

    const spaces = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1

    if (spaces < 1) return days

    return Array(new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1)
      .fill(1)
      .map(() => 0)
      .concat(days)
  }

  const sameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()

  return (
    <div className="antialiased sans-serif">
      <div className="container mx-auto px-4 py-2 md:py-10">
        <div className="mb-5 w-64">
          <label
            htmlFor="datepicker"
            className="font-bold mb-1 text-gray-700 block"
          >
            Velg dato
          </label>
          <div
            onClick={() => {
              setShow(true)
            }}
            className="relative"
          >
            <input
              {...props}
              type="text"
              className="w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium"
              placeholder="Select date"
              value={dateformatter.mediumday_wtime(date)}
            />
            <div className="absolute top-0 right-0 px-3 py-2">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            {show ? (
              <ClickAwayListener
                onClickAway={() => {
                  setShow(false)
                }}
              >
                <div className="bg-white mt-12 rounded-lg shadow p-4 absolute top-0 left-0 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <div className="truncate">
                      <span className="text-lg font-bold text-gray-800 truncate capitalize">
                        {date.toLocaleDateString('no', { month: 'long' })}
                      </span>
                      <span className="ml-1 text-lg text-gray-600 font-normal truncate">
                        {date.toLocaleDateString('no', {
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className=" min-h-fit flex">
                      <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                        onClick={() =>
                          updateDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth() - 1,
                              date.getDate(),
                              date.getHours(),
                              date.getMinutes()
                            )
                          )
                        }
                      >
                        <svg
                          className="h-6 w-6 text-gray-500 inline-flex"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                        onClick={() =>
                          updateDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth() - 1,
                              date.getDate(),
                              date.getHours(),
                              date.getMinutes()
                            )
                          )
                        }
                      >
                        <svg
                          className="h-6 w-6 text-gray-500 inline-flex"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-3 -mx-1">
                    {weekdays().map((day, index) => (
                      <div
                        key={index}
                        className="text-gray-800 font-medium text-center text-xs"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 -mx-1">
                    {days().map((day, index) => {
                      if (day == 0) {
                        return (
                          <div className="text-center border p-1 border-transparent text-sm"></div>
                        )
                      } else {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              updateDate(new Date(new Date(date).setDate(day)))
                            }}
                            className={`cursor-pointer text-center justify-center text-sm leading-loose rounded-full transition ease-in-out duration-100 inline-flex hover:bg-gray-200 ${
                              sameDay(
                                date,
                                new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  day,
                                  date.getHours(),
                                  date.getMinutes()
                                )
                              )
                                ? 'bg-blue-200'
                                : ''
                            }`}
                          >
                            {day}
                          </div>
                        )
                      }
                    })}
                  </div>
                  <div className="flex justify-around p-2">
                    <div className=" min-h-fit flex items-center">
                      <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                        onClick={() =>
                          updateDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              date.getHours() - 1,
                              date.getMinutes()
                            )
                          )
                        }
                      >
                        <svg
                          className="h-6 w-6 text-gray-500 inline-flex"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12 L18 12"
                          />
                        </svg>
                      </button>
                      {date.toLocaleTimeString('no', { hour: '2-digit' })}
                      <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                        onClick={() =>
                          updateDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              date.getHours() + 1,
                              date.getMinutes()
                            )
                          )
                        }
                      >
                        <svg
                          className="h-6 w-6 text-gray-500 inline-flex"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12 L18 12 M12 6 L12 18"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className=" min-h-fit flex items-center">
                      <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                        onClick={() =>
                          updateDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              date.getHours(),
                              date.getMinutes() - 15
                            )
                          )
                        }
                      >
                        <svg
                          className="h-6 w-6 text-gray-500 inline-flex"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12 L18 12"
                          />
                        </svg>
                      </button>
                      {date.toLocaleTimeString('no', {
                        minute: '2-digit',
                      })}
                      <button
                        type="button"
                        className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                        onClick={() =>
                          updateDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              date.getHours(),
                              date.getMinutes() + 15
                            )
                          )
                        }
                      >
                        <svg
                          className="h-6 w-6 text-gray-500 inline-flex"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12 L18 12 M12 6 L12 18"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Datepicker
9
