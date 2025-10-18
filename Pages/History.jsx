
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, ExternalLink, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const SUBJECT_EMOJIS = {
  math: "➗",
  physics: "⚛️",
  chemistry: "🧪",
  biology: "🧬",
  history: "📜",
  literature: "📚",
  english: "🇬🇧",
  other: "📖"
};

const SUBJECT_LABELS = {
  math: "Математика",
  physics: "Физика",
  chemistry: "Химия",
  biology: "Биология",
  history: "История",
  literature: "Литература",
  english: "Английский",
  other: "Другое"
};

export default function History() {
  const { data: homeworks, isLoading } = useQuery({
    queryKey: ['homeworks'],
    queryFn: () => base44.entities.Homework.list("-created_date"),
    initialData: [],
  });

  const getModelBadge = (modelId) => {
    const models = {
      gpt4: { name: "GPT-4", color: "bg-purple-100 text-purple-800" },
      llama3: { name: "Llama 3", color: "bg-orange-100 text-orange-800" },
      mistral: { name: "Mistral", color: "bg-blue-100 text-blue-800" },
      gemma: { name: "Gemma 2", color: "bg-green-100 text-green-800" },
      claude: { name: "Claude 3", color: "bg-indigo-100 text-indigo-800" }
    };
    return models[modelId] || models.gpt4; // Default to gpt4 if modelId is not found
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              История заданий
            </h1>
            <p className="text-gray-600 mt-2">Все ваши решенные задания с AI</p>
          </div>
          <Link to={createPageUrl("Home")}>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Новое задание
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : homeworks.length === 0 ? (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-2 border-purple-100">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">История пуста</h3>
              <p className="text-gray-600 mb-6">
                Начните с создания вашего первого задания
              </p>
              <Link to={createPageUrl("Home")}>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Создать задание
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {homeworks.map((homework) => {
              const modelBadge = getModelBadge(homework.ai_model);
              return (
                <Card 
                  key={homework.id} 
                  className="hover:shadow-xl transition-shadow border-2 border-purple-100 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader className="border-b border-purple-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-2xl">{SUBJECT_EMOJIS[homework.subject]}</span>
                          <Badge variant="outline" className="text-xs">
                            {SUBJECT_LABELS[homework.subject]}
                          </Badge>
                          <Badge className={`text-xs ${modelBadge.color}`}>
                            {modelBadge.name}
                          </Badge>
                          <Badge 
                            variant={homework.status === "completed" ? "default" : "secondary"}
                            className={homework.status === "completed" ? "bg-green-500" : ""}
                          >
                            {homework.status === "completed" ? "Готово" : 
                             homework.status === "processing" ? "Обработка..." : "Ошибка"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(homework.created_date), "dd.MM.yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {homework.question}
                    </p>
                    {homework.status === "completed" && (
                      <Link to={createPageUrl(`Result?id=${homework.id}`)}>
                        <Button variant="outline" className="w-full gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Посмотреть результат
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
