import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VoiceScript({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="shadow-xl border-2 border-green-100">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mic className="w-6 h-6" />
            Текст для озвучки
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Mic className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-sm text-gray-700">
              Этот текст можно использовать для создания голосового сопровождения с помощью TTS сервисов (ElevenLabs, OpenAI TTS)
            </AlertDescription>
          </Alert>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
            <p className="text-lg text-gray-800 leading-relaxed italic">
              "{text}"
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}