"use client";
import React, { useState, useEffect } from "react";
import { Vehicle } from "@prisma/client";
import VehicleCard from "./components/VehicleCard";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // State for multi-attribute search
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number | "">("");
  const [fuelType, setFuelType] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("");
  const [mileage, setMileage] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [searchById, setSearchById] = useState<string>("");

  // Fetch all vehicles
  const getAllVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/vehicles");
      if (response.ok) {
        const data: Vehicle[] = await response.json();
        setVehicles(data);
      } else {
        console.error("Failed to fetch vehicles:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a vehicle by ID
  const getVehicleById = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      if (response.ok) {
        const data: Vehicle = await response.json();
        setVehicles([data]);
      } else {
        console.error("Failed to fetch vehicle:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search by ID
  const handleSearchById = () => {
    const id = parseInt(searchById, 10);
    if (!isNaN(id)) {
      setLoading(true);
      setVehicles([]);
      getVehicleById(id);
    } else {
      console.error("Please enter a valid vehicle ID.");
    }
  };

  // Filter vehicles based on multiple attributes
  const filterVehicles = async () => {
    setLoading(true);
    setVehicles([]);

    // Fetch all vehicles and store them in a temporary variable for filtering
    let allVehicles: Vehicle[] = [];
    try {
      const response = await fetch("/api/vehicles");
      if (response.ok) {
        allVehicles = await response.json();
      } else {
        console.error("Failed to fetch vehicles:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching vehicles:", error);
    }

    // Apply filters based on attributes
    let filtered = allVehicles;

    if (make)
      filtered = filtered.filter((vehicle) =>
        vehicle.make.toLowerCase().includes(make.toLowerCase())
      );
    if (model)
      filtered = filtered.filter((vehicle) =>
        vehicle.model.toLowerCase().includes(model.toLowerCase())
      );
    if (fuelType)
      filtered = filtered.filter((vehicle) =>
        vehicle.fuel_type.toLowerCase().includes(fuelType.toLowerCase())
      );
    if (transmission)
      filtered = filtered.filter((vehicle) =>
        vehicle.transmission.toLowerCase().includes(transmission.toLowerCase())
      );
    if (mileage)
      filtered = filtered.filter((vehicle) => vehicle.mileage <= mileage);
    if (price) filtered = filtered.filter((vehicle) => vehicle.price <= price);
    if (year) filtered = filtered.filter((vehicle) => vehicle.year === year);

    // Set the filtered vehicles
    setVehicles(filtered);
    setLoading(false);
  };

  const clearInputs = () => {
    setMake("");
    setModel("");
    setYear("");
    setFuelType("");
    setTransmission("");
    setMileage("");
    setPrice("");
    setSearchById("");
    getAllVehicles();
  };

  // Get all vehicles on page load
  useEffect(() => {
    getAllVehicles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicle Inventory</h1>

      {/* Search by ID */}
      <div className="mb-4">
        <label className="block mb-2">Search by ID</label>
        <input
          type="text"
          value={searchById}
          onChange={(e) => setSearchById(e.target.value)}
          className="border p-2 rounded w-full mb-2"
          placeholder="Enter Vehicle ID"
        />
        <button
          onClick={handleSearchById}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search by ID
        </button>
      </div>

      {/* Search by Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Make</label>
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Toyota, Ford, Mercedes..."
          />
        </div>
        <div>
          <label className="block mb-2">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Mustang, Civic, Corolla..."
          />
        </div>
        <div>
          <label className="block mb-2">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.valueAsNumber)}
            className="border p-2 rounded w-full"
            placeholder="2020"
          />
        </div>
        <div>
          <label className="block mb-2">Fuel Type</label>
          <input
            type="text"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Petrol, diesel, electric..."
          />
        </div>
        <div>
          <label className="block mb-2">Transmission</label>
          <input
            type="text"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Manual / Automatic"
          />
        </div>
        <div>
          <label className="block mb-2">Mileage (Max)</label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.valueAsNumber)}
            className="border p-2 rounded w-full"
            placeholder="Enter Maximum Mileage"
          />
        </div>
        <div>
          <label className="block mb-2">Price (Max)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
            className="border p-2 rounded w-full"
            placeholder="Enter Maximum Price"
          />
        </div>

        <button
          onClick={filterVehicles}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Search by Attributes
        </button>

        <button
          onClick={clearInputs}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear All
        </button>
      </div>

      {/* Display Vehicles */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {vehicles.length === 0 ? (
            <p>No vehicles found.</p>
          ) : (
            <div className="grid grid-cols-1">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
