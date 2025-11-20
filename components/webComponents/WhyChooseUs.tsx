import { CheckCircle, DollarSignIcon } from "lucide-react";

// Why Choose Us Section
const WhyChooseUs = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mt-2 mb-6">
            Unmatched Value and Exceptional Service
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Our extensive fleet of vehicles and years of industry expertise
            allow us to deliver the best value and customer satisfaction.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                {/* <Map className="w-6 h-6" /> */}map
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  Travel All Over Nepal
                </h4>
                <p className="text-gray-600">
                  Explore every corner of Nepal with ease using our diverse
                  fleet.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                <DollarSignIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  All-Inclusive Pricing
                </h4>
                <p className="text-gray-600">
                  Enjoy clear, competitive rates with no hidden fees.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  No Hidden Charges
                </h4>
                <p className="text-gray-600">
                  Travel with confidence knowing our pricing is transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Travel"
            className="rounded-2xl shadow-2xl w-full"
          />
          <div className="absolute -bottom-6 -right-6 bg-red-600 p-6 rounded-xl text-white hidden md:block shadow-lg">
            <p className="font-bold text-xl">24/7 Support</p>
            <p className="text-sm opacity-90">We are always here for you</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
