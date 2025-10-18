import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, Brain, Video, Languages, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ModelSelector from "../components/home/ModelSelector";

const SUBJECTS = [
  { value: "math", label: "Математика", emoji: "➗" },
  { value: "physics", label: "Физика", emoji: "⚛️" },
  { value: "chemistry", label: "Химия", emoji: "🧪" },
  { value: "biology", label: "Биология", emoji: "🧬" },
  { value: "history", label: "История", emoji: "📜" },
  { value: "literature", label: "Литература", emoji: "📚" },
  { value: "english", label: "Английский", emoji: "🇬🇧" },
  { value: "other", label: "Другое", emoji: "📖" },
];

const LANGUAGES = [
  { value: "uzbek", label: "O'zbek tili", flag: "🇺🇿" },
  { value: "russian", label: "Русский", flag: "🇷🇺" },
  { value: "english", label: "English", flag: "🇬🇧" },
];

export default function Home() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("russian");
  const [subject, setSubject] = useState("math");
  const [aiModel, setAiModel] = useState("gpt4");
  const [file, setFile] = useState(null);

  const createHomeworkMutation = useMutation({
    mutationFn: async (data) => {
      const homework = await base44.entities.Homework.create(data);
      return homework;
    },
    onSuccess: (homework) => {
      navigate(createPageUrl(`Result?id=${homework.id}`));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let questionText = question;
    
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      questionText = `${question}\n\nПриложено изображение: ${file_url}`;
    }

    createHomeworkMutation.mutate({
      question: questionText,
      language,
      subject,
      ai_model: aiModel,
      status: "processing"
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-sm font-medium text-purple-600">Powered by Multiple AI Models</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            AI Homework Helper
          </h1>
          <p className="text-xl text-gray-600">
            Выберите AI модель и получите объяснение с видео-сценарием
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-purple-100 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="w-7 h-7 text-purple-600" />
              Введите ваше задание
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ModelSelector 
                value={aiModel}
                onChange={setAiModel}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-base font-semibold">
                    📚 Предмет
                  </Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subj) => (
                        <SelectItem key={subj.value} value={subj.value}>
                          <span className="flex items-center gap-2">
                            <span>{subj.emoji}</span>
                            <span>{subj.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2 text-base font-semibold">
                    <Languages className="w-4 h-4" />
                    Язык объяснения
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question" className="text-base font-semibold">
                  ❓ Текст задания
                </Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Введите ваш вопрос или задание здесь...&#10;&#10;Например: Реши квадратное уравнение x² - 5x + 6 = 0"
                  rows={6}
                  className="border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="flex items-center gap-2 text-base font-semibold">
                  <Upload className="w-4 h-4" />
                  Загрузить фото задания (необязательно)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors cursor-pointer bg-gray-50">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 text-center">
                      {file ? file.name : "Нажмите или перетащите изображение"}
                    </p>
                  </label>
                </div>
              </div>

              <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <AlertDescription className="text-sm text-gray-700">
                  <strong>Как это работает:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li><strong>Этап 1:</strong> AI объяснит решение пошагово с диаграммами</li>
                    <li><strong>Этап 2:</strong> Создаст детальный сценарий для видео-объяснения</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={createHomeworkMutation.isPending}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createHomeworkMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Обрабатываю задание...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Video className="w-6 h-6" />
                    Получить объяснение с видео
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Объяснение</h3>
              <p className="text-sm text-gray-600">
                Пошаговое решение с визуальными диаграммами
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Open Source LLMs</h3>
              <p className="text-sm text-gray-600">
                Llama 3, Mistral, Gemma и другие модели
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">3 языка</h3>
              <p className="text-sm text-gray-600">
                Узбекский, русский и английский
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}