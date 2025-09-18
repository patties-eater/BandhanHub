export default function ProfileCard({ name, age, bio, image }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 text-center w-64">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-cover"
      />
      <h2 className="text-xl font-semibold mt-2">{name}, {age}</h2>
      <p className="text-gray-600 text-sm mt-1">{bio}</p>
      <div className="flex justify-center gap-4 mt-3">
        <button className="px-4 py-2 bg-gray-200 rounded-lg">Skip</button>
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">Like</button>
      </div>
    </div>
  );
}
