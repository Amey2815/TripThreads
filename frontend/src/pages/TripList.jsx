import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";

const TripList = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/api/trips/my-trips");
        setTrips(res.data.trips); // response is { trips: [...] }
      } catch (err) {
        alert("Failed to load trips");
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Link to="/trips/new" className="bg-blue-500 text-white px-3 py-1 rounded">
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <p>No trips yet.</p>
      ) : (
        <ul className="space-y-3">
          {trips.map((trip) => (
            <li key={trip._id} className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer">
              <Link to={`/trips/${trip._id}`}>
                <h2 className="text-lg font-semibold">{trip.name}</h2>
                <p>{trip.destination}</p>
              </Link>
            </li>

          ))}
        </ul>
      )}
    </div>
  );
};

export default TripList;
