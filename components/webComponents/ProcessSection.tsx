import { Car, Headset, SmileIcon } from "lucide-react";

// Process / How it works Section
const ProcessSection = () => (
  <section className="py-16 bg-white relative -mt-16 z-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <span className="text-red-600 font-bold uppercase text-sm tracking-wider">
            Plan your trip now
          </span>
          <h2 className="text-3xl font-extrabold text-blue-900 mt-2">
            Quick & Easy Vehicle Rental
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

          <div className="text-center bg-white p-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 mx-auto text-white relative z-10 border-4 border-white">
              <Car className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Select a Vehicle
            </h3>
            <p className="text-gray-600">
              Pick the perfect car for your trip from our wide range of options.
            </p>
          </div>

          <div className="text-center bg-white p-4">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200 mx-auto text-white relative z-10 border-4 border-white">
              <Headset className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Discuss Your Trip
            </h3>
            <p className="text-gray-600">
              Talk to our staff for any questions or special requests.
            </p>
          </div>

          <div className="text-center bg-white p-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 mx-auto text-white relative z-10 border-4 border-white">
              <SmileIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Enjoy Your Ride
            </h3>
            <p className="text-gray-600">
              Drive away and enjoy your trip with ease and comfort.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
