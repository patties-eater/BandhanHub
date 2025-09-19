export default function DummyProfiles() {
  const dummyProfiles = [
    {
      id: 1,
      full_name: "Ram Shrestha",
      birthdate: "1995-01-12",
      address: "Kathmandu",
      avatar_url: "",
    },
    {
      id: 2,
      full_name: "Sita Koirala",
      birthdate: "1994-05-23",
      address: "Pokhara",
      avatar_url: "",
    },
    {
      id: 3,
      full_name: "Hari Lama",
      birthdate: "1996-08-30",
      address: "Lalitpur",
      avatar_url: "",
    },
  ];

  function getAge(birthdate) {
    const dob = new Date(birthdate);
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Suggested Profiles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyProfiles.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <img
              src={
                p.avatar_url ||
                `https://api.dicebear.com/8.x/avataaars/svg?seed=${p.full_name}`
              }
              alt={p.full_name}
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
            <h3 className="text-lg font-bold">{p.full_name}</h3>
            <p className="text-sm text-gray-500">Age: {getAge(p.birthdate)}</p>
            <p className="text-sm text-gray-500">{p.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
