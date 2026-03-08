export function Select({ value, onChange, children, label }) {
  return (
    <label className="cursor-pointer group transition ease-in flex items-center justify-center gap-2 h-8 bg-gray-500 hover:bg-gray-700 px-1 rounded-md shadow-md">
      <select
        className="cursor-pointer bg-gray-500 group-hover:bg-gray-700 text-white transition ease-in"
        aria-label={label}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </label>
  );
}
