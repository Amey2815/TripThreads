import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [newMember, setNewMember] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`/api/trips/${id}`);
        setTrip(res.data);
        setLoading(false);
      } catch (err) {
        alert("Failed to load trip");
      }
    };
    fetchTrip();
  }, [id]);

  const handleAddMember = async () => {
    try {
      await axios.post(`/api/trips/${id}/add-member`, { userIdOrEmail: newMember });
      alert("Member added");
      setNewMember("");
      // refresh trip details after adding member
      const res = await axios.get(`/api/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{trip.name}</h1>
      <p className="mb-4">Destination: {trip.destination}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <ul className="mb-4">
          {trip.members.map(member => (
            <li key={member._id}>{member.name} ({member.email})</li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="User ID or Email"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleAddMember}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add Member
        </button>
      </div>

      {/* TODO: Add itinerary, expenses, polls, notes sections here */}
    </div>
  );
};

export default TripDetail;
