import { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/trips/create", { name, destination });
      alert("Trip created successfully");
      navigate("/trips"); // redirect to trip list
    } catch (err) {
      alert("Error creating trip");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Create New Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Trip Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Trip
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
