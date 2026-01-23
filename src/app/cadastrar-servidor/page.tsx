"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Info,
  Loader2,
  Plus,
  HelpCircle,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { registerServer, ActionState } from "@/app/actions/server";
import { ServerFormValues } from "@/lib/schemas/server";

// Options constants
const versions = ["7.4", "7.6", "7.72", "8.0", "8.60", "10.98", "12.00", "12.85", "13.00+", "Outro"];
const mapTypes = ["Global", "Baiak", "Yourots", "Custom", "Outro"];
const pvpTypes = ["PVP", "NO_PVP", "PVP_ENFORCED", "RETRO_PVP"];
const themes = ["Tibia", "Pokemon", "Naruto", "Dragonball", "Outro"];
const commonTimezones = [
  "UTC", "America/Sao_Paulo", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Tokyo"
];

const standardSystems = [
  "Quest System", "Task System", "Cast System", "Auto Loot", "VIP System",
  "Imbuement", "Prey System", "Events", "War System", "Guild System",
  "Dungeons", "Daily Reward", "Bestiary"
];

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "otservhub-verify-";
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function CadastrarServidor() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [serverActionState, setServerActionState] = useState<ActionState>(null);

  // State matching the Zod schema generally
  const [formData, setFormData] = useState<ServerFormValues>({
    name: "",
    ip: "",
    port: 7171,
    version: "",
    customVersion: "",
    website: "",
    downloadLink: "",
    launchDate: "",
    launchTime: "18:00",
    isReleaseDateTba: false,
    timezone: "America/Sao_Paulo",
    description: "",
    mapType: "",
    customMapType: "",
    pvpType: "PVP",
    rate: "",
    theme: "",
    customTheme: "",
    systems: [],
    discordLink: "",
    whatsappLink: "",
    hasMobile: false,
    bannerUrl: "", // We'll handle this separately or assume it's part of the flow
  });

  const [customSystemInput, setCustomSystemInput] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationToken] = useState(generateToken());
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [copied, setCopied] = useState(false);
  const [verificationError, setVerificationError] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleInputChange = (field: keyof ServerFormValues, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSystemToggle = (system: string) => {
    setFormData((prev) => ({
      ...prev,
      systems: prev.systems.includes(system)
        ? prev.systems.filter((s) => s !== system)
        : [...prev.systems, system],
    }));
  };

  const addCustomSystem = () => {
    if (customSystemInput && !formData.systems.includes(customSystemInput)) {
      setFormData(prev => ({
        ...prev,
        systems: [...prev.systems, customSystemInput]
      }));
      setCustomSystemInput("");
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
        // Note: In a real app, you'd upload this to storage and get a URL.
        // For MVP, we might skip actual image upload or handle it differently.
        // Assuming we just send the base64 or similar for now, or just the preview logic.
        // We'll leave bannerUrl empty for now as requested changes didn't specify storage logic.
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToken = async () => {
    const metaTag = `<meta name="otservhub-verification" content="${verificationToken}" />`;
    await navigator.clipboard.writeText(metaTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerification = async () => {
    if (verificationAttempts >= 3) return;

    setVerificationStatus("checking");
    setVerificationError("");
    setVerificationAttempts((prev) => prev + 1);

    try {
      const response = await fetch("/api/verify-server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: formData.website,
          token: verificationToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
        setVerificationError(data.error || "Verificação falhou");
      }
    } catch {
      setVerificationStatus("error");
      setVerificationError("Erro ao conectar com o servidor.");
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const dataToSubmit = {
        ...formData,
        isVerified: verificationStatus === "success"
      };

      const result = await registerServer(null, dataToSubmit);
      if (result?.error || result?.errors) {
        setServerActionState(result);
      }
    });
  };

  // Validation for Step 1
  const canProceedStep1 =
    formData.name &&
    formData.ip &&
    formData.port &&
    formData.theme &&
    (formData.theme !== "Outro" || formData.customTheme) &&
    formData.version &&
    (formData.version !== "Outro" || formData.customVersion) &&
    formData.website &&
    (formData.isReleaseDateTba || (formData.launchDate && formData.launchTime)) &&
    formData.mapType &&
    (formData.mapType !== "Outro" || formData.customMapType) &&
    formData.pvpType &&
    formData.rate &&
    formData.description &&
    acceptedTerms;

  const canProceedStep2 = bannerPreview !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Servidor</h1>
            <p className="text-gray-600">Adicione seu servidor ao OtservHub e alcance milhares de jogadores.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step >= s
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? "text-gray-900" : "text-gray-400"}`}>
                  {s === 1 ? "Informações" : s === 2 ? "Banner" : "Verificação"}
                </span>
                {s < 3 && <div className="w-12 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>

          {/* Error Display */}
          {serverActionState?.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{serverActionState.error}</span>
            </div>
          )}
          {serverActionState?.errors && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm">
              <ul className="list-disc pl-5">
                {Object.entries(serverActionState.errors).map(([field, msgs]) => (
                  <li key={field}>{field}: {msgs.join(", ")}</li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Servidor</h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Servidor *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Royal Tibia"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temática *</label>
                    <select
                      value={formData.theme}
                      onChange={(e) => handleInputChange("theme", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {themes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Custom Theme Input */}
                {formData.theme === "Outro" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qual a temática? *</label>
                    <input
                      type="text"
                      value={formData.customTheme || ""}
                      onChange={(e) => handleInputChange("customTheme", e.target.value)}
                      placeholder="Ex: Harry Potter"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Connection Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP do Servidor *</label>
                    <input
                      type="text"
                      value={formData.ip}
                      onChange={(e) => handleInputChange("ip", e.target.value)}
                      placeholder="play.seuservidor.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Porta *</label>
                    <input
                      type="number"
                      value={formData.port}
                      onChange={(e) => handleInputChange("port", parseInt(e.target.value) || 7171)}
                      placeholder="7171"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Versão *</label>
                    <select
                      value={formData.version}
                      onChange={(e) => handleInputChange("version", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {versions.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {/* Custom Version Input */}
                {formData.version === "Outro" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qual a versão? *</label>
                    <input
                      type="text"
                      value={formData.customVersion || ""}
                      onChange={(e) => handleInputChange("customVersion", e.target.value)}
                      placeholder="Ex: 8.54 - Old School"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Website & Downloads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website *</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://seuservidor.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Página de Download</label>
                    <input
                      type="url"
                      value={formData.downloadLink || ""}
                      onChange={(e) => handleInputChange("downloadLink", e.target.value)}
                      placeholder="https://seuservidor.com/downloads"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Map & Rates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mapa *</label>
                    <select
                      value={formData.mapType}
                      onChange={(e) => handleInputChange("mapType", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {mapTypes.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de PvP *</label>
                    <select
                      value={formData.pvpType}
                      onChange={(e) => handleInputChange("pvpType", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {pvpTypes.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate XP *</label>
                    <input
                      type="text"
                      value={formData.rate}
                      onChange={(e) => handleInputChange("rate", e.target.value)}
                      placeholder="Ex: 100x, Stages"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Custom Map Input */}
                {formData.mapType === "Outro" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qual o mapa? *</label>
                    <input
                      type="text"
                      value={formData.customMapType || ""}
                      onChange={(e) => handleInputChange("customMapType", e.target.value)}
                      placeholder="Ex: Styller YourOTS"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Launch Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Lançamento</label>
                      <input
                        type="date"
                        disabled={formData.isReleaseDateTba}
                        value={formData.launchDate || ""}
                        onChange={(e) => handleInputChange("launchDate", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                      <p className="text-xs text-gray-500 mt-1">Poderá ser alterada posteriormente.</p>

                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isReleaseDateTba}
                          onChange={(e) => handleInputChange("isReleaseDateTba", e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Sem data definida. Será divulgado em breve.</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Lançamento</label>
                      <input
                        type="time"
                        disabled={formData.isReleaseDateTba}
                        value={formData.launchTime || ""}
                        onChange={(e) => handleInputChange("launchTime", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-400"
                      />

                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Fuso Horário</label>
                        <select
                          value={formData.timezone}
                          onChange={(e) => handleInputChange("timezone", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs bg-white text-gray-700"
                        >
                          {commonTimezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discord Invite</label>
                    <input
                      type="url"
                      value={formData.discordLink || ""}
                      onChange={(e) => handleInputChange("discordLink", e.target.value)}
                      placeholder="https://discord.gg/..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Group</label>
                    <input
                      type="url"
                      value={formData.whatsappLink || ""}
                      onChange={(e) => handleInputChange("whatsappLink", e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Systems */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sistemas do Servidor</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {standardSystems.map((system) => (
                      <button
                        key={system}
                        type="button"
                        onClick={() => handleSystemToggle(system)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${formData.systems.includes(system)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {system}
                      </button>
                    ))}
                    {formData.systems
                      .filter(s => !standardSystems.includes(s))
                      .map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSystemToggle(s)}
                          className="px-3 py-1.5 text-xs rounded-full bg-purple-600 text-white flex items-center gap-1"
                        >
                          {s} <X size={12} />
                        </button>
                      ))
                    }
                  </div>

                  {/* Add Custom System */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSystemInput}
                      onChange={(e) => setCustomSystemInput(e.target.value)}
                      placeholder="Adicionar outro sistema..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSystem();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCustomSystem}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Mobile & Desc */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={formData.hasMobile}
                      onChange={(e) => handleInputChange("hasMobile", e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Servidor possui cliente Mobile</span>
                  </label>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                  <p className="text-xs text-gray-500 mb-2">Resumo breve do servidor. Você poderá adicionar mais detalhes e imagens posteriormente.</p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva seu servidor..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                {/* Terms */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Aviso Importante</p>
                      <p>Alterar o IP ou Website após a verificação removerá o selo de verificado.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      Li e aceito os <a href="#" className="text-purple-600 hover:underline">Termos de Uso</a>. *
                    </span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo: Banner
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Banner do Servidor</h2>
              <div className="space-y-6">
                {/* Banner Upload UI (unchanged logic) */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Info className="text-blue-600 shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Especificações do Banner</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Tamanho recomendado: 800x400 pixels</li>
                        <li>Formatos aceitos: PNG, JPG, WebP</li>
                        <li>Tamanho máximo: 2MB</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  {bannerPreview ? (
                    <div className="space-y-4">
                      <img src={bannerPreview} alt="Preview" className="max-w-full h-auto rounded-lg mx-auto" />
                      <button onClick={() => setBannerPreview(null)} className="text-sm text-red-600 hover:text-red-700">Remover imagem</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <Upload className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Clique para fazer upload</p>
                          <p className="text-sm text-gray-500">ou arraste o arquivo aqui</p>
                        </div>
                      </div>
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Voltar</button>
                  <button onClick={() => setStep(3)} disabled={!canProceedStep2} className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próximo: Verificação</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Verificação de Propriedade</h2>

              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="text-purple-600 shrink-0" size={20} />
                    <div className="text-sm text-purple-800">
                      <p className="font-medium mb-2">Por que verificar?</p>
                      <p>A verificação garante que você é o verdadeiro dono do servidor.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-medium text-gray-900">Como verificar:</h3>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                      title="Clique para ver o guia detalhado"
                    >
                      <HelpCircle size={18} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {/* Step 1: Copy Token */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">1</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">Copie a meta-tag abaixo e adicione no <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;head&gt;</code>:</p>
                        <div className="mt-2 flex items-center gap-2">
                          <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-xs font-mono text-gray-800 overflow-x-auto">
                            {`<meta name="otservhub-verification" content="${verificationToken}" />`}
                          </code>
                          <button onClick={copyToken} className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                            {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Step 2: Check URL */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">2</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">Certifique-se de que a página está acessível em:</p>
                        <p className="mt-1 text-sm font-medium text-purple-600">{formData.website || "https://seusite.com"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Messages for Verification */}
                {verificationStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                      <div className="text-sm text-green-800">
                        <p className="font-medium">Verificação concluída!</p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="text-red-600 shrink-0" size={20} />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">Verificação falhou</p>
                        <p>{verificationError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Voltar</button>
                  <div className="flex gap-3">
                    {verificationStatus !== "success" && (
                      <button
                        onClick={handleVerification}
                        disabled={verificationStatus === "checking" || verificationAttempts >= 3}
                        className="px-6 py-2.5 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {verificationStatus === "checking" ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : <><RefreshCw size={18} /> Verificar Agora</>}
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                      {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                      {verificationStatus === "success" ? "Finalizar Cadastro" : "Cadastrar sem Verificar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="bg-white/20 p-1.5 rounded-lg"><HelpCircle size={20} /></span>
                  Guia de Verificação
                </h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Security Explanation (Highlighted) */}
                <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
                  <h4 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                    <Info size={18} className="text-blue-600" />
                    Por que isso é necessário?
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Para garantir que o <strong>OtservHub</strong> seja uma plataforma segura, precisamos confirmar que você
                    realmente possui acesso administrativo ao servidor que está cadastrando. Isso impede que terceiros mal-intencionados
                    se apropriem da página do seu servidor ou enganem jogadores. <br />
                    <span className="block mt-2 font-medium">
                      Esta verificação é feita apenas uma vez e não afeta o desempenho do seu site.
                    </span>
                  </p>
                </div>

                {/* Test Mode Info */}
                <div className="mb-8 bg-purple-50 border border-purple-100 rounded-xl p-5 shadow-sm">
                  <h4 className="flex items-center gap-2 font-semibold text-purple-900 mb-2">
                    <Info size={18} className="text-purple-600" />
                    Modo de Teste (Desenvolvimento)
                  </h4>
                  <p className="text-sm text-purple-800 leading-relaxed">
                    Para testar o fluxo sem configurar um servidor real, utilize a URL: <br />
                    <code className="bg-purple-100 px-2 py-1 rounded text-purple-900 font-mono font-medium mt-1 inline-block">https://otservhub-test.com</code> <br />
                    <span className="block mt-2">
                      Ao usar este domínio no campo &quot;Website&quot;, a verificação será aprovada automaticamente.
                    </span>
                  </p>
                </div>

                {/* Steps */}
                <h4 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Passo a Passo Detalhado</h4>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Acesse o código do seu site</h5>
                      <p className="text-sm text-gray-600">
                        Abra o arquivo principal do seu layout (geralmente <code>index.html</code>, <code>layout.php</code>, ou <code>header.php</code>)
                        no seu editor de texto ou painel de administração.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Localize a tag &lt;head&gt;</h5>
                      <p className="text-sm text-gray-600">
                        Procure pela seção <code>&lt;head&gt;</code> no início do arquivo. É onde ficam o título e outras configurações do site.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Adicione a Meta-Tag</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        Cole o código de verificação antes do fechamento da tag <code>&lt;/head&gt;</code>.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-3 group relative">
                        <code className="text-xs font-mono text-green-400 break-all">
                          {`<meta name="otservhub-verification" content="${verificationToken}" />`}
                        </code>
                        <button
                          onClick={copyToken}
                          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white bg-white/10 rounded transition-colors"
                          title="Copiar código"
                        >
                          {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Salve e Verifique</h5>
                      <p className="text-sm text-gray-600">
                        Salve o arquivo e, se necessário, faça o upload para sua hospedagem. Depois, clique no botão <strong>&quot;Verificar Agora&quot;</strong> aqui na plataforma.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Entendi, vou fazer isso
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
