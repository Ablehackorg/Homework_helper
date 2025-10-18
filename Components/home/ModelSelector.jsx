import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Zap, Sparkles, Brain, Cpu, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AI_MODELS = [
  {
    id: "gpt4",
    name: "GPT-4",
    icon: Sparkles,
    description: "Самая мощная модель от OpenAI",
    badge: "Рекомендуется",
    badgeColor: "bg-gradient-to-r from-purple-500 to-blue-500",
    available: true,
    features: ["Высокая точность", "Математика и науки", "Мультиязычность"]
  },
  {
    id: "llama3",
    name: "Llama 3",
    icon: Brain,
    description: "Open source модель от Meta",
    badge: "Open Source",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
    available: false,
    features: ["Бесплатная", "Хорошая математика", "70B параметров"]
  },
  {
    id: "mistral",
    name: "Mistral AI",
    icon: Zap,
    description: "Быстрая европейская модель",
    badge: "Быстрая",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    available: false,
    features: ["Высокая скорость", "Логика", "Open weights"]
  },
  {
    id: "gemma",
    name: "Gemma 2",
    icon: Cpu,
    description: "Компактная модель от Google",
    badge: "Легковесная",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500",
    available: false,
    features: ["9B параметров", "Эффективная", "Open source"]
  },
  {
    id: "claude",
    name: "Claude 3",
    icon: Brain,
    description: "Модель от Anthropic",
    badge: "Новая",
    badgeColor: "bg-gradient-to-r from-indigo-500 to-purple-500",
    available: false,
    features: ["Длинный контекст", "Безопасная", "Аналитика"]
  }
];

export default function ModelSelector({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Выберите AI модель
        </Label>
      </div>

      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid gap-4">
          {AI_MODELS.map((model) => {
            const Icon = model.icon;
            return (
              <div key={model.id} className="relative">
                <RadioGroupItem
                  value={model.id}
                  id={model.id}
                  disabled={!model.available}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={model.id}
                  className={`flex flex-col cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    model.available
                      ? 'hover:border-purple-400 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50'
                      : 'opacity-60 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${model.badgeColor} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg">{model.name}</span>
                          <Badge className={`${model.badgeColor} text-white border-0 text-xs`}>
                            {model.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{model.description}</p>
                      </div>
                    </div>
                    {!model.available && (
                      <Badge variant="outline" className="text-xs">
                        Скоро
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {model.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <AlertDescription className="text-sm">
          <strong className="text-amber-900">Для активации Open Source моделей:</strong>
          <ul className="list-disc ml-4 mt-2 space-y-1 text-amber-800">
            <li>Включите <strong>Backend Functions</strong> в настройках (Dashboard → Settings)</li>
            <li>Или запросите интеграции у команды base44 через кнопку Feedback</li>
            <li>Сейчас доступна только GPT-4 через встроенную интеграцию</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Почему Open Source?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Бесплатно:</strong> Нет ограничений на количество запросов</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Приватность:</strong> Данные остаются у вас</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Настройка:</strong> Можно fine-tune под ваши задачи</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Выбор:</strong> Множество специализированных моделей</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}