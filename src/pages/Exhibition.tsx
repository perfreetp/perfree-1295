import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { exhibitions } from "@/data/exhibitions";
import { collections as allCollections } from "@/data/collections";

export default function Exhibition() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-3">云展厅</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          足不出户，畅游千年文化瑰宝。在这里，您可以浏览各类主题展览，欣赏珍贵文物。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {exhibitions.map((exhibition) => {
          const exhibitionCollections = allCollections.slice(0, 3);
          return (
            <div
              key={exhibition.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={exhibition.coverImage}
                  alt={exhibition.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center text-sm text-gold mb-1">
                    <Calendar size={14} className="mr-1" />
                    {exhibition.startDate} - {exhibition.endDate}
                  </div>
                  <h3 className="font-serif text-lg font-bold">{exhibition.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {exhibition.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {exhibitionCollections.slice(0, 3).map((col, idx) => (
                      <img
                        key={idx}
                        src={col.images[0]}
                        alt={col.title}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                      +{allCollections.length}
                    </div>
                  </div>
                  <Link
                    to={`/exhibition/${exhibition.id}`}
                    className="flex items-center text-sm text-gold font-medium hover:text-teal transition-colors"
                  >
                    进入展厅
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
