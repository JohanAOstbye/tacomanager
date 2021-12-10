const pad = (d) => {
  return d < 10 ? '0' + d.toString() : d.toString();
};

const TimePicker = ({
  tacotime,
  set,
}: {
  tacotime: {
    hours: string;
    minutes: string;
  };
  set: React.Dispatch<
    React.SetStateAction<{
      hours: string;
      minutes: string;
    }>
  >;
}) => {
  return (
    <div className='flex justify-center'>
      <div className='mt-2 p-5 w-40 bg-white border-b border-blue-500'>
        <div className='flex'>
          <select
            name='hours'
            className='bg-transparent text-xl appearance-none outline-none'
            onChange={(e) => {
              set({ ...tacotime, hours: e.target.value });
            }}
            value={tacotime.hours}
          >
            {[...Array(12)].map((_: number, index: number) => {
              let num = pad(23 - index);

              return (
                <option value={num} key={num}>
                  {num}
                </option>
              );
            })}
          </select>
          <span className='text-xl mr-3'>:</span>
          <select
            name='minutes'
            className='bg-transparent text-xl appearance-none outline-none mr-4'
            onChange={(e) => {
              set({ ...tacotime, minutes: e.target.value });
            }}
            value={tacotime.minutes}
          >
            <option value='00'>00</option>
            <option value='15'>15</option>
            <option value='30'>30</option>
            <option value='45'>45</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
