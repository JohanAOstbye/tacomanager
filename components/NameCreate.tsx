const NameCreate = ({
  create,
  name,
  set,
}: {
  create: () => void;
  name: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className='w-full max-w-sm'>
      <div className='flex items-center border-b border-blue-500 py-2 mb-3'>
        <input
          className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none'
          type='text'
          placeholder='Jigg Jiggerson'
          aria-label='Full name'
          value={name}
          onChange={(e) => {
            set(e.target.value);
          }}
        />
        <button
          className='hidden sm:block flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded'
          type='button'
          onClick={create}
        >
          Create taco:)
        </button>
      </div>
      <button
        className='sm:hidden flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded'
        type='button'
        onClick={create}
      >
        Create taco:)
      </button>
    </div>
  );
};

export default NameCreate;
