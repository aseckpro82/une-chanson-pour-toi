import React from "react";
import { Star } from "lucide-react";

export default function RatingStats({ 
  title = "Avis clients",
  averageRating = 4.9,
  totalReviews = 36,
  distribution = { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 }
}) {
  return (
    <div className="bg-gradient-to-br from-rose-500 via-purple-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-100 mb-2">{title}</h3>
        <div className="text-5xl md:text-6xl font-bold mb-3">
          {averageRating} <span className="text-3xl md:text-4xl text-blue-200">/ 5</span>
        </div>
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-6 h-6 md:w-7 md:h-7 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-blue-300'}`} 
            />
          ))}
        </div>
        <p className="text-rose-200 text-sm">{totalReviews} avis vérifiés</p>
      </div>

      {/* Distribution bars */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-10 text-sm">
              <span>{stars}</span>
              <Star className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
            </div>
            <div className="flex-1 h-3 bg-purple-400/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${distribution[stars] || 0}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm text-rose-100">
              {distribution[stars] || 0} %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}