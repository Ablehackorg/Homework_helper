import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function StepDisplay({ steps }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">{step}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}