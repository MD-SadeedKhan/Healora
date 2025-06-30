import React, { useState } from "react";
import FilterBar from "../components/hospitals/FilterBar";
import MapComponent from "../components/hospitals/MapComponent";
import HospitalCard from "../components/hospitals/HospitalCard";

const dummyHospitals = [
  // USA
  { name: "Mayo Clinic", lat: 44.0221, lng: -92.4660, rating: 4.8, specialties: ["Cardiology", "Oncology"], place_id: "1" },
  { name: "Cleveland Clinic", lat: 41.5036, lng: -81.6206, rating: 4.7, specialties: ["Neurology", "Heart"], place_id: "2" },
  { name: "Johns Hopkins Hospital", lat: 39.2975, lng: -76.5931, rating: 4.6, specialties: ["Surgery", "Internal Medicine"], place_id: "3" },
  { name: "Massachusetts General Hospital", lat: 42.3639, lng: -71.0688, rating: 4.5, specialties: ["Dermatology", "Emergency"], place_id: "4" },
  { name: "UCLA Medical Center", lat: 34.0655, lng: -118.4441, rating: 4.6, specialties: ["Orthopedics", "Neurology"], place_id: "5" },
  { name: "Stanford Health Care", lat: 37.4400, lng: -122.1741, rating: 4.7, specialties: ["Cancer", "Neurosurgery"], place_id: "31" },
  { name: "NewYork-Presbyterian Hospital", lat: 40.7650, lng: -73.9547, rating: 4.6, specialties: ["Cardiology", "Pediatrics"], place_id: "32" },
  { name: "Cedars-Sinai Medical Center", lat: 34.0762, lng: -118.3805, rating: 4.5, specialties: ["Orthopedics", "Heart"], place_id: "33" },

  // UK
  { name: "St. Thomas’ Hospital", lat: 51.4980, lng: -0.1187, rating: 4.3, specialties: ["Cardiology", "Nephrology"], place_id: "6" },
  { name: "The Royal Marsden", lat: 51.4873, lng: -0.1731, rating: 4.4, specialties: ["Oncology", "Pediatrics"], place_id: "7" },
  { name: "Guy’s Hospital", lat: 51.5036, lng: -0.0879, rating: 4.3, specialties: ["Dental", "Surgery"], place_id: "34" },
  { name: "Great Ormond Street Hospital", lat: 51.5225, lng: -0.1207, rating: 4.5, specialties: ["Pediatrics", "Rare Diseases"], place_id: "35" },

  // India
  { name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, rating: 4.5, specialties: ["Neurology", "Emergency"], place_id: "8" },
  { name: "Apollo Hospitals Chennai", lat: 13.0635, lng: 80.2456, rating: 4.4, specialties: ["Heart", "Transplants"], place_id: "9" },
  { name: "Fortis Hospital Bangalore", lat: 12.9352, lng: 77.6101, rating: 4.3, specialties: ["Orthopedics", "Oncology"], place_id: "10" },
  { name: "Medanta Gurgaon", lat: 28.4355, lng: 77.0353, rating: 4.4, specialties: ["Cardiology", "Gastroenterology"], place_id: "11" },
  { name: "Max Super Speciality Hospital Delhi", lat: 28.5605, lng: 77.2867, rating: 4.3, specialties: ["Cancer", "ENT"], place_id: "28" },
  { name: "Narayana Health Bangalore", lat: 12.8383, lng: 77.6739, rating: 4.4, specialties: ["Cardiac", "Surgery"], place_id: "29" },
  { name: "Kokilaben Dhirubhai Ambani Hospital Mumbai", lat: 19.1376, lng: 72.8295, rating: 4.4, specialties: ["Orthopedics", "Cancer"], place_id: "30" },
  { name: "Christian Medical College Vellore", lat: 12.9250, lng: 79.1360, rating: 4.5, specialties: ["General Medicine", "Neurology"], place_id: "36" },
  { name: "Manipal Hospital Bangalore", lat: 12.9580, lng: 77.6490, rating: 4.3, specialties: ["Urology", "Oncology"], place_id: "37" },

  // Germany
  { name: "Charité – Universitätsmedizin Berlin", lat: 52.5230, lng: 13.3777, rating: 4.6, specialties: ["Research", "Neurosurgery"], place_id: "12" },
  { name: "University Hospital Heidelberg", lat: 49.4174, lng: 8.6724, rating: 4.5, specialties: ["Cancer", "Diagnostics"], place_id: "13" },
  { name: "Klinikum rechts der Isar Munich", lat: 48.1367, lng: 11.6007, rating: 4.4, specialties: ["Surgery", "Cardiology"], place_id: "38" },

  // Japan
  { name: "University of Tokyo Hospital", lat: 35.7126, lng: 139.7625, rating: 4.4, specialties: ["Surgery", "Cardiology"], place_id: "14" },
  { name: "Kyoto University Hospital", lat: 35.0231, lng: 135.7810, rating: 4.3, specialties: ["Research", "Oncology"], place_id: "39" },

  // Australia
  { name: "Royal Melbourne Hospital", lat: -37.7963, lng: 144.9547, rating: 4.2, specialties: ["Emergency", "Oncology"], place_id: "15" },
  { name: "Westmead Hospital", lat: -33.8030, lng: 150.9870, rating: 4.3, specialties: ["Rehabilitation", "Cardiac"], place_id: "16" },
  { name: "Royal Prince Alfred Hospital", lat: -33.8891, lng: 151.1826, rating: 4.3, specialties: ["Transplants", "Maternity"], place_id: "40" },

  // Singapore
  { name: "Singapore General Hospital", lat: 1.2785, lng: 103.8344, rating: 4.5, specialties: ["General", "Cardiology"], place_id: "17" },
  { name: "Mount Elizabeth Hospital", lat: 1.3048, lng: 103.8354, rating: 4.4, specialties: ["Private Care", "Neurology"], place_id: "18" },
  { name: "Gleneagles Hospital", lat: 1.3074, lng: 103.8200, rating: 4.4, specialties: ["Orthopedics", "Oncology"], place_id: "41" },

  // Canada
  { name: "Toronto General Hospital", lat: 43.6583, lng: -79.3888, rating: 4.6, specialties: ["Heart", "Transplants"], place_id: "19" },
  { name: "Sunnybrook Health Sciences Centre", lat: 43.7336, lng: -79.3747, rating: 4.5, specialties: ["Cancer", "Trauma"], place_id: "20" },
  { name: "Vancouver General Hospital", lat: 49.2612, lng: -123.1229, rating: 4.4, specialties: ["Emergency", "Neurology"], place_id: "42" },

  // UAE
  { name: "Cleveland Clinic Abu Dhabi", lat: 24.4936, lng: 54.3830, rating: 4.6, specialties: ["Heart", "Neurology"], place_id: "21" },
  { name: "Sheikh Khalifa Medical City", lat: 24.4812, lng: 54.3664, rating: 4.3, specialties: ["General", "Emergency"], place_id: "22" },
  { name: "Burjeel Hospital Abu Dhabi", lat: 24.4667, lng: 54.3700, rating: 4.4, specialties: ["Orthopedics", "Maternity"], place_id: "43" },

  // Turkey
  { name: "Acibadem Maslak Hospital", lat: 41.1104, lng: 29.0205, rating: 4.5, specialties: ["Oncology", "Fertility"], place_id: "23" },
  { name: "Medical Park Goztepe", lat: 40.9793, lng: 29.0669, rating: 4.2, specialties: ["Pediatrics", "Cardiac"], place_id: "24" },
  { name: "Memorial Sisli Hospital", lat: 41.0569, lng: 28.9936, rating: 4.4, specialties: ["Neurosurgery", "Oncology"], place_id: "44" },

  // France
  { name: "Pitié-Salpêtrière Hospital", lat: 48.8374, lng: 2.3601, rating: 4.4, specialties: ["Neurology", "Stroke"], place_id: "25" },
  { name: "Hôpital Necker-Enfants Malades", lat: 48.8446, lng: 2.3143, rating: 4.3, specialties: ["Pediatrics", "Genetics"], place_id: "45" },

  // South Korea
  { name: "Samsung Medical Center", lat: 37.4889, lng: 127.0855, rating: 4.5, specialties: ["Cancer", "Immunology"], place_id: "26" },
  { name: "Asan Medical Center", lat: 37.5261, lng: 127.1075, rating: 4.6, specialties: ["Transplants", "Heart"], place_id: "27" },

  // Brazil
  { name: "Hospital Albert Einstein", lat: -23.5983, lng: -46.7168, rating: 4.7, specialties: ["Cardiology", "Oncology"], place_id: "46" },
  { name: "Hospital Sírio-Libanês", lat: -23.5537, lng: -46.6524, rating: 4.6, specialties: ["Surgery", "Neurology"], place_id: "47" },

  // South Africa
  { name: "Groote Schuur Hospital", lat: -33.9410, lng: 18.4623, rating: 4.3, specialties: ["Transplants", "Cardiology"], place_id: "48" },

  // Thailand
  { name: "Bumrungrad International Hospital", lat: 13.7456, lng: 100.5537, rating: 4.5, specialties: ["General", "Cosmetic Surgery"], place_id: "49" },

  // Mexico
  { name: "Hospital Ángeles Tijuana", lat: 32.5149, lng: -117.0037, rating: 4.4, specialties: ["Orthopedics", "Bariatrics"], place_id: "50" },
];

const Hospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [filteredHospitals, setFilteredHospitals] = useState(dummyHospitals);

  const handleFilter = (specialty, _maxDistance) => {
    if (specialty === "All") {
      setFilteredHospitals(dummyHospitals);
    } else {
      const filtered = dummyHospitals.filter((h) =>
        h.specialties.includes(specialty)
      );
      setFilteredHospitals(filtered);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="md:w-1/3 lg:w-1/4 bg-white shadow overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-2">Top Hospitals Worldwide</h2>
        <p className="text-sm text-gray-500 mb-4">
          Explore the best healthcare facilities around the world.
        </p>
        <FilterBar onFilter={handleFilter} />

        <div className="mt-4 space-y-2">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.place_id}
              hospital={hospital}
              isSelected={selectedHospital?.place_id === hospital.place_id}
              onClick={() => setSelectedHospital(hospital)}
            />
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 h-full">
        <MapComponent
          userLocation={{ lat: 20.5937, lng: 78.9629 }} // default India center
          hospitals={filteredHospitals}
          selectedHospital={selectedHospital}
          onHospitalSelect={setSelectedHospital}
        />
      </div>
    </div>
  );
};

export default Hospitals;