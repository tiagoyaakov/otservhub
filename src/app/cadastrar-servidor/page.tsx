"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  Info,
  Loader2
} from "lucide-react";

interface ServerFormData {
  name: string;
  ip: string;
  port: string;
  version: string;
  website: string;
  launchDate: string;
  launchTime: string;
  description: string;
  mapType: string;
  pvpType: string;
  rate: string;
  systems: string[];
  hasMobile: boolean;
}

const versions = ["7.4", "7.6", "7.72", "8.0", "8.60", "10.98", "12.00", "12.85", "13.00+"];
const mapTypes = ["Global", "Baiak", "Custom"];
const pvpTypes = ["PvP", "Non-PvP", "PvP-Enforced"];
const systemOptions = [
  "Quest System",
  "Task System",
  "Cast System",
  "Auto Loot",
  "VIP System",
  "Imbuement",
  "Prey System",
  "Events",
  "War System",
  "Guild System",
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
  const [formData, setFormData] = useState<ServerFormData>({
    name: "",
    ip: "",
    port: "7171",
    version: "",
    website: "",
    launchDate: "",
    launchTime: "18:00",
    description: "",
    mapType: "",
    pvpType: "",
    rate: "",
    systems: [],
    hasMobile: false,
  });
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationToken] = useState(generateToken());
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof ServerFormData, value: string | boolean | string[]) => {
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

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
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

  const [verificationError, setVerificationError] = useState<string>("");

  const handleVerification = async () => {
    if (verificationAttempts >= 3) {
      return;
    }
    
    setVerificationStatus("checking");
    setVerificationError("");
    setVerificationAttempts((prev) => prev + 1);
    
    try {
      const response = await fetch("/api/verify-server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      setVerificationError("Erro ao conectar com o servidor de verificação");
    }
  };

  const canProceedStep1 = 
    formData.name && 
    formData.ip && 
    formData.port && 
    formData.version && 
    formData.website && 
    formData.launchDate &&
    formData.mapType &&
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

          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step >= s
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

          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Servidor</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Servidor *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Royal Tibia"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website *
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://seuservidor.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IP do Servidor *
                    </label>
                    <input
                      type="text"
                      value={formData.ip}
                      onChange={(e) => handleInputChange("ip", e.target.value)}
                      placeholder="play.seuservidor.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Porta *
                    </label>
                    <input
                      type="text"
                      value={formData.port}
                      onChange={(e) => handleInputChange("port", e.target.value)}
                      placeholder="7171"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versão *
                    </label>
                    <select
                      value={formData.version}
                      onChange={(e) => handleInputChange("version", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {versions.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Mapa *
                    </label>
                    <select
                      value={formData.mapType}
                      onChange={(e) => handleInputChange("mapType", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {mapTypes.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de PvP *
                    </label>
                    <select
                      value={formData.pvpType}
                      onChange={(e) => handleInputChange("pvpType", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="">Selecione</option>
                      {pvpTypes.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate *
                    </label>
                    <input
                      type="text"
                      value={formData.rate}
                      onChange={(e) => handleInputChange("rate", e.target.value)}
                      placeholder="Ex: 100x, Stages, 3x"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Lançamento *
                    </label>
                    <input
                      type="date"
                      value={formData.launchDate}
                      onChange={(e) => handleInputChange("launchDate", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Lançamento *
                    </label>
                    <input
                      type="time"
                      value={formData.launchTime}
                      onChange={(e) => handleInputChange("launchTime", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistemas do Servidor
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {systemOptions.map((system) => (
                      <button
                        key={system}
                        type="button"
                        onClick={() => handleSystemToggle(system)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                          formData.systems.includes(system)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {system}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasMobile}
                      onChange={(e) => handleInputChange("hasMobile", e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Servidor possui cliente Mobile</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva seu servidor, suas principais características e diferenciais..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Aviso Importante</p>
                      <p>
                        Alterar o IP ou Website do servidor após a verificação irá remover o selo de verificado 
                        automaticamente. Você precisará verificar novamente.
                      </p>
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
                      Li e aceito os{" "}
                      <a href="/termos" className="text-purple-600 hover:underline">
                        Termos de Uso
                      </a>{" "}
                      e a{" "}
                      <a href="/privacidade" className="text-purple-600 hover:underline">
                        Política de Privacidade
                      </a>{" "}
                      do OtservHub. *
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Info className="text-blue-600 flex-shrink-0" size={20} />
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
                      <img
                        src={bannerPreview}
                        alt="Preview do banner"
                        className="max-w-full h-auto rounded-lg mx-auto"
                      />
                      <button
                        onClick={() => setBannerPreview(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remover imagem
                      </button>
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
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo: Verificação
                  </button>
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
                    <Info className="text-purple-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-purple-800">
                      <p className="font-medium mb-2">Por que verificar?</p>
                      <p>
                        A verificação garante que você é o verdadeiro dono do servidor. 
                        Servidores verificados ganham um selo especial e maior credibilidade na plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Como verificar:</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          Copie a meta-tag abaixo e adicione no <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;head&gt;</code> do seu site:
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-xs font-mono text-gray-800 overflow-x-auto">
                            {`<meta name="otservhub-verification" content="${verificationToken}" />`}
                          </code>
                          <button
                            onClick={copyToken}
                            className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                            title="Copiar"
                          >
                            {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          Salve as alterações e certifique-se de que a página está acessível em:
                        </p>
                        <p className="mt-1 text-sm font-medium text-purple-600">{formData.website || "https://seusite.com"}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          Clique no botão abaixo para verificar:
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {verificationAttempts >= 3 && verificationStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">Limite de tentativas atingido</p>
                        <p>Você atingiu o limite de 3 tentativas. Aguarde 15 minutos para tentar novamente.</p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                      <div className="text-sm text-green-800">
                        <p className="font-medium">Verificação concluída!</p>
                        <p>Seu servidor foi verificado com sucesso. Você receberá o selo de verificado.</p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationStatus === "error" && verificationAttempts < 3 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">Verificação falhou</p>
                        <p>
                          {verificationError || "Não foi possível encontrar a meta-tag no seu site."}{" "}
                          Certifique-se de que ela está no &lt;head&gt; e tente novamente.
                          ({3 - verificationAttempts} tentativas restantes)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                  <div className="flex gap-3">
                    {verificationStatus !== "success" && (
                      <button
                        onClick={handleVerification}
                        disabled={verificationStatus === "checking" || verificationAttempts >= 3}
                        className="px-6 py-2.5 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {verificationStatus === "checking" ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={18} />
                            Verificar Agora
                          </>
                        )}
                      </button>
                    )}
                    <button
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      {verificationStatus === "success" ? "Finalizar Cadastro" : "Cadastrar sem Verificar"}
                    </button>
                  </div>
                </div>

                {verificationStatus !== "success" && (
                  <p className="text-xs text-gray-500 text-center">
                    Você pode cadastrar o servidor sem verificação, mas ele não receberá o selo de verificado.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
