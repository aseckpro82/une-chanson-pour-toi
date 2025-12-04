import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedTestimonials() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ featured: true }, '-created_date', 3),
    initialData: [],
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ils nous ont fait confiance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-8">
                <Skeleton className="h-32 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ils nous ont fait confiance
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les retours de nos clients enchantés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 rounded-3xl bg-gradient-to-br from-white to-rose-50/20 border border-rose-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 h-full">
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-rose-300 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.message}"
                </p>
                <div className="pt-4 border-t border-rose-100">
                  <p className="font-bold text-gray-900">{testimonial.customer_name}</p>
                  <p className="text-sm text-gray-500">{testimonial.occasion}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}