export default function MatchList({ matches }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {matches.map((match, i) => (
        <div key={i} className="bg-white shadow rounded-lg p-3 flex items-center gap-3">
          <img
            src={match.image}
            alt={match.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{match.name}</h3>
            <p className="text-sm text-gray-500">{match.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
