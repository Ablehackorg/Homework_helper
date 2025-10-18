import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Film } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VideoScriptDisplay({ script }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="shadow-xl border-2 border-pink-100">
        <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Video className="w-6 h-6" />
            Этап 2: Сценарий для видео-объяснения
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="mb-6 bg-pink-50 border-pink-200">
            <Film className="w-4 h-4 text-pink-600" />
            <AlertDescription className="text-sm text-gray-700">
              <strong>Примечание:</strong> Для генерации видео потребуется интеграция с Sora API или Pika Labs. 
              Этот сценарий можно использовать для создания анимированного объяснения.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {script.map((scene, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-5 border-2 border-pink-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2 text-pink-700">
                      Сцена {scene.scene}
                    </h4>
                    <p className="text-gray-800 leading-relaxed">
                      {scene.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700">
              💡 <strong>Совет:</strong> Используйте этот сценарий для создания анимации в After Effects, 
              Blender или AI-генераторах видео (Runway, Pika Labs, Sora)
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}