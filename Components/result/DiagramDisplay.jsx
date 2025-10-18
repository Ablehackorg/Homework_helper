import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function DiagramDisplay({ url, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="shadow-xl border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ImageIcon className="w-6 h-6" />
            Визуальная диаграмма
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {description && (
            <p className="text-gray-700 mb-4 italic">{description}</p>
          )}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
            <img 
              src={url} 
              alt="Диаграмма" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}