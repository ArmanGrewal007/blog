const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="max-w-xl mx-auto mb-12">
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border border-orange-200 bg-orange-50/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-slate-400 text-slate-700 shadow-sm transition-all"
      />
    </div>
  );
};

export default SearchBar;
