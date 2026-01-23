"use client";

import { useEffect, useState, useTransition, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

// You might want to reuse the server action `updateServer` if it exists, 
// or call supabase directly if RLS allows it (it should for owner).
// For now, I'll direct call supabase for simplicity in this "edit" view 
// or create a server action if we want to be strict. 
// Given the existing patterns, let's use a direct supabase update for now 
// or a simple server action if I had one. I'll stick to client-side supabase for speed 
// unless I see a strict pattern otherwise. The previous code uses actions for registration.

export default function EditServerPage({ params }: { params: Promise<{ server_id: string }> }) {
    const { server_id: serverId } = use(params);
    const [loading, setLoading] = useState(true);
    const [isSaving, startTransition] = useTransition();

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        ip: "",
        port: 7171,
        version: "",
        website: "",
        description: "",
        discord_url: "",
        whatsapp_url: ""
    });

    useEffect(() => {
        async function fetchServer() {
            const supabase = createClient();
            if (!supabase) return;

            const { data } = await supabase
                .from("servers")
                .select("*")
                .eq("id", serverId)
                .single();

            if (data) {
                setFormData({
                    name: data.name || "",
                    ip: data.ip || "",
                    port: data.port || 7171,
                    version: data.version || "",
                    website: data.website || "",
                    description: data.description || "",
                    discord_url: data.discord_url || "",
                    whatsapp_url: data.whatsapp_url || ""
                });
            }
            setLoading(false);
        }
        fetchServer();
    }, [serverId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const supabase = createClient();
            if (!supabase) {
                toast.error("Erro de configuração");
                return;
            }

            const { error } = await supabase
                .from("servers")
                .update({
                    name: formData.name,
                    ip: formData.ip,
                    port: Number(formData.port),
                    version: formData.version,
                    website: formData.website,
                    description: formData.description,
                    discord_url: formData.discord_url,
                    whatsapp_url: formData.whatsapp_url,
                    updated_at: new Date().toISOString()
                })
                .eq("id", serverId);

            if (error) {
                toast.error("Erro ao atualizar servidor");
                console.error(error);
            } else {
                toast.success("Informações atualizadas com sucesso!");
            }
        });
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Editar Informações</h1>
                <p className="text-gray-500 text-sm">Atualize os detalhes principais do seu servidor.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome do Servidor</label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Global War" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Versão</label>
                        <Input name="version" value={formData.version} onChange={handleChange} placeholder="Ex: 8.60" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">IP de Conexão</label>
                        <Input name="ip" value={formData.ip} onChange={handleChange} placeholder="go.server.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Porta</label>
                        <Input type="number" name="port" value={formData.port} onChange={handleChange} placeholder="7171" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <Input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Descrição</label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descreva seu servidor..."
                        className="h-32 resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right">Máximo 500 caracteres</p>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Link do Discord</label>
                        <Input type="url" name="discord_url" value={formData.discord_url} onChange={handleChange} placeholder="https://discord.gg/..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Link do WhatsApp</label>
                        <Input type="url" name="whatsapp_url" value={formData.whatsapp_url} onChange={handleChange} placeholder="https://chat.whatsapp.com/..." />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
                        {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>

            </form>
        </div>
    );
}
