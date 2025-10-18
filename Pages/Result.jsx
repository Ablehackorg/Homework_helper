
import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Brain,
  Image as ImageIcon,
  Mic,
  Video,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

import StepDisplay from "../components/result/StepDisplay";
import DiagramDisplay from "../components/result/DiagramDisplay";
import VoiceScript from "../components/result/VoiceScript";
import VideoScriptDisplay from "../components/result/VideoScriptDisplay";

export default function Result() {
  const urlParams = new URLSearchParams(window.location.search);
  const homeworkId = urlParams.get("id");
  const [currentStage, setCurrentStage] = useState(1);
  const [progress, setProgress] = useState(0);

  const { data: homework, isLoading } = useQuery({
    queryKey: ['homework', homeworkId],
    queryFn: () => base44.entities.Homework.filter({ id: homeworkId }).then(res => res[0]),
    enabled: !!homeworkId,
    refetchInterval: (data) => {
      if (data?.status === "processing") return 2000;
      return false;
    },
  });

  useEffect(() => {
    if (!homework || homework.status === "completed") return;

    const processHomework = async () => {
      try {
        setCurrentStage(1);
        setProgress(10);

        const languageMap = {
          uzbek: "узбекском",
          russian: "русском",
          english: "английском"
        };

        const modelInfo = {
          gpt4: "GPT-4 (наиболее точная модель)",
          llama3: "Llama 3 70B (open source от Meta)",
          mistral: "Mistral Large (быстрая европейская модель)",
          gemma: "Gemma 2 9B (компактная от Google)",
          claude: "Claude 3 (модель от Anthropic)"
        };

        const prompt = `
Ты — умный образовательный ассистент, который помогает ученикам решать домашние задания.
Ты работаешь на базе модели: ${modelInfo[homework.ai_model] || "GPT-4"}.
Твоя задача — объяснить решение задачи шаг за шагом, используя понятный язык.

Задание: ${homework.question}
Предмет: ${homework.subject}
Язык объяснения: ${languageMap[homework.language]}

Пожалуйста:
1. Объясни решение пошагово и логично (минимум 4 шага).
2. Добавь блок "Диаграмма" — опиши, какую диаграмму или схему нужно показать для визуализации.
3. Добавь блок "Голосовое сопровождение" — короткий эмоциональный текст для озвучки (как учитель объясняет ученику).
4. Добавь блок "Видео-сценарий" — опиши 4-5 сцен для анимированного видео.

Используй язык: ${languageMap[homework.language]}.
        `;

        setProgress(30);

        const response = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              steps: {
                type: "array",
                items: { type: "string" }
              },
              diagram_description: { type: "string" },
              voice_text: { type: "string" },
              video_script: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    scene: { type: "number" },
                    description: { type: "string" }
                  }
                }
              }
            }
          }
        });

        setProgress(60);
        setCurrentStage(2);

        let diagramUrl = null;
        if (response.diagram_description) {
          const imagePrompt = `Create an educational diagram: ${response.diagram_description}. Style: clean, simple, colorful, suitable for students.`;
          const { url } = await base44.integrations.Core.GenerateImage({
            prompt: imagePrompt
          });
          diagramUrl = url;
        }

        setProgress(90);

        await base44.entities.Homework.update(homework.id, {
          explanation: response,
          diagram_url: diagramUrl,
          status: "completed"
        });

        setProgress(100);
      } catch (error) {
        console.error("Error processing homework:", error);
        await base44.entities.Homework.update(homework.id, {
          status: "error"
        });
      }
    };

    processHomework();
  }, [homework?.id]);

  if (isLoading || !homework) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Загружаю задание...</p>
        </div>
      </div>
    );
  }

  if (homework.status === "processing") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
              <CardTitle className="text-2xl">Обработка вашего задания</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="flex items-center justify-center gap-4">
                  <div className={`flex items-center gap-2 ${currentStage >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                    {currentStage > 1 ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    )}
                    <span className="font-medium">Этап 1: AI Объяснение</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ${currentStage >= 2 ? 'w-full' : 'w-0'}`}
                    />
                  </div>
                  <div className={`flex items-center gap-2 ${currentStage >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {currentStage > 2 ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : currentStage === 2 ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Video className="w-6 h-6" />
                    )}
                    <span className="font-medium">Этап 2: Диаграмма</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Прогресс обработки</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-start gap-4">
                    <Brain className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Ваше задание:</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{homework.question}</p>
                      <div className="mt-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          Модель: {homework.ai_model?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-sm text-gray-700">
                    Пожалуйста, подождите. AI анализирует ваше задание и создает подробное объяснение...
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (homework.status === "error") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Произошла ошибка при обработке задания. Пожалуйста, попробуйте еще раз.
            </AlertDescription>
          </Alert>
          <Link to={createPageUrl("Home")}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getModelBadge = (modelId) => {
    const models = {
      gpt4: { name: "GPT-4", color: "from-purple-500 to-blue-500" },
      llama3: { name: "Llama 3", color: "from-orange-500 to-red-500" },
      mistral: { name: "Mistral", color: "from-blue-500 to-cyan-500" },
      gemma: { name: "Gemma 2", color: "from-green-500 to-emerald-500" },
      claude: { name: "Claude 3", color: "from-indigo-500 to-purple-500" }
    };
    return models[modelId] || models.gpt4;
  };

  const modelBadge = getModelBadge(homework.ai_model);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Новое задание
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className={`bg-gradient-to-r ${modelBadge.color} text-white px-4 py-2`}>
              {modelBadge.name}
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Готово
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="shadow-2xl border-2 border-purple-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">Ваше задание</CardTitle>
                  <p className="text-gray-700 whitespace-pre-wrap">{homework.question}</p>
                </div>
                <Badge variant="outline" className="ml-4">
                  {homework.language === "uzbek" ? "🇺🇿 O'zbek" : 
                   homework.language === "russian" ? "🇷🇺 Русский" : "🇬🇧 English"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-xl border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="w-6 h-6" />
                Этап 1: Пошаговое объяснение
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <StepDisplay steps={homework.explanation?.steps || []} />
            </CardContent>
          </Card>

          {homework.diagram_url && (
            <DiagramDisplay 
              url={homework.diagram_url}
              description={homework.explanation?.diagram_description}
            />
          )}

          {homework.explanation?.voice_text && (
            <VoiceScript text={homework.explanation.voice_text} />
          )}

          {homework.explanation?.video_script && (
            <VideoScriptDisplay script={homework.explanation.video_script} />
          )}
        </div>
      </div>
    </div>
  );
}
