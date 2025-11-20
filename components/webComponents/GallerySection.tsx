import { Search, XCircle } from "lucide-react";
import { useState } from "react";

// --- LIGHTBOX GALLERY ---
const GallerySection = () => {
  const images = [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540552999122-a0ac7899d4a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1605642986407-352572932253?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581320363501-04cb713470f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552423399-548103db4222?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-24 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-400 font-bold tracking-wider uppercase text-sm">
            Gallery
          </span>
          <h2 className="text-4xl font-extrabold mt-2">Glimpses of Nepal</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl aspect-square cursor-pointer shadow-lg border-2 border-blue-800/50 hover:border-red-500 transition-all"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Search className="text-white w-8 h-8 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white p-3 hover:bg-white/20 rounded-full transition cursor-pointer z-50">
            <XCircle className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full Screen"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
