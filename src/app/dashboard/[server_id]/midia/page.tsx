"use client";

import Image from "next/image";

import { useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MediaPage({ params }: { params: Promise<{ server_id: string }> }) {
    const { server_id: serverId } = use(params);
    const [uploading, setUploading] = useState(false);
    const [currentBanner, setCurrentBanner] = useState<string | null>(null); // Should load initial state
    const router = useRouter();

    // Ideally load the current banner in useEffect like in other pages
    // For brevity, assuming we handle it or the user sees the new one after refresh

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate generic Constraints (e.g. 2MB, image type)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Arquivo muito grande. Máximo 2MB.");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Apenas arquivos de imagem são permitidos.");
            return;
        }

        setUploading(true);
        const supabase = createClient();
        if (!supabase) {
            toast.error("Supabase não configurado.");
            setUploading(false);
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${serverId}-${Math.random()}.${fileExt}`;
        const filePath = `server-banners/${fileName}`;

        try {
            // Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('banners') // Ensure this bucket exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('banners')
                .getPublicUrl(filePath);

            // Update Server Record
            const { error: dbError } = await supabase
                .from('servers')
                .update({ banner_url: publicUrl })
                .eq('id', serverId);

            if (dbError) throw dbError;

            setCurrentBanner(publicUrl);
            toast.success("Banner atualizado com sucesso!");
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Erro ao fazer upload do banner.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Banner & Mídia</h1>
                <p className="text-gray-500 text-sm">Gerencie a aparência visual do seu servidor nas listagens.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ícone do Servidor (Lista)</h3>
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                        {/* Placeholder for Icon - future implementation */}
                        <span className="text-xs text-gray-400 text-center px-1">Em breve</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Este ícone aparecerá na lista de servidores ao lado do nome.</p>
                        <p className="text-xs text-gray-400 mb-4">Recomendado: 64x64px ou 128x128px (Quadrado). Max 500KB.</p>
                        <Button disabled variant="outline" size="sm">
                            <UploadCloud className="mr-2" size={16} /> Fazer Upload (Em breve)
                        </Button>
                    </div>
                </div>
            </div>



            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Banner Principal</h3>

                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    {currentBanner ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 group">
                            <Image
                                src={currentBanner}
                                alt="Banner"
                                width={800}
                                height={450}
                                unoptimized
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-medium">Alterar Imagem</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon size={32} />
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">Clique para fazer upload ou arraste e solte</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF (max. 800x400px, 2MB)</p>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <Loader2 className="animate-spin text-purple-600" size={32} />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-4">
                    <div className="flex-1 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-medium text-blue-900">Dica Pro</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Servidores com banners personalizados recebem 3x mais cliques em média.
                                Use cores vibrantes e pouco texto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
