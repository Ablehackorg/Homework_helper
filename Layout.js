import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GraduationCap, Home, History, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Главная",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "История",
    url: createPageUrl("History"),
    icon: History,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Sidebar className="border-r border-purple-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-purple-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  AI Homework Helper
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </h2>
                <p className="text-xs text-gray-500">Умный помощник с видео</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-purple-600 uppercase tracking-wider px-3 py-2">
                Навигация
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-purple-600 uppercase tracking-wider px-3 py-2">
                Возможности
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">AI Объяснение</span>
                    </div>
                    <p className="text-xs text-gray-500">Пошаговое решение с диаграммами</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-pink-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Видео-сценарий</span>
                    </div>
                    <p className="text-xs text-gray-500">Анимированное объяснение</p>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-100 p-4">
            <div className="text-xs text-center text-gray-500">
              <p className="mb-1">🇺🇿 🇷🇺 🇬🇧</p>
              <p>Поддержка 3 языков</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-purple-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Homework Helper
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}