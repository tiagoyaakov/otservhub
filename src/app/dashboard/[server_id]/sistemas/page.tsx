"use client";

import { useEffect, useState, useTransition, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Since we have a many-to-many relationship (server_systems), 
// we need to manage that. For simplicity in this iteration, 
// I'll assume we can just display tags and maybe add new ones to the `systems` table if not exist? 
// Or stick to existing systems. 
// A simpler approach for the MVP dashboard is to just manage a direct text array or 
// use the existing `systems` table. 
// Let's fetch all available systems and allow toggling.

interface System {
    id: string;
    name: string;
}

export default function SystemsPage({ params }: { params: Promise<{ server_id: string }> }) {
    const { server_id: serverId } = use(params);
    const [availableSystems, setAvailableSystems] = useState<System[]>([]);
    const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, startTransition] = useTransition();

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            if (!supabase) return;

            // Fetch all systems
            const { data: allSys } = await supabase.from('systems').select('*');

            // Fetch server current systems
            const { data: serverSys } = await supabase
                .from('server_systems')
                .select('system_id')
                .eq('server_id', serverId);

            if (allSys) setAvailableSystems(allSys);
            if (serverSys) setSelectedSystems(serverSys.map((s: { system_id: string }) => s.system_id));

            setLoading(false);
        }
        fetchData();
    }, [serverId]);

    const toggleSystem = (systemId: string) => {
        setSelectedSystems(prev =>
            prev.includes(systemId)
                ? prev.filter(id => id !== systemId)
                : [...prev, systemId]
        );
    };

    const handleSave = () => {
        startTransition(async () => {
            const supabase = createClient();
            if (!supabase) {
                toast.error("Erro interno");
                return;
            }

            // Strategy: Delete all for this server and re-insert. 
            // Not atomic but works for MVP.
            const { error: delError } = await supabase
                .from('server_systems')
                .delete()
                .eq('server_id', serverId);

            if (delError) {
                toast.error("Erro ao atualizar sistemas");
                return;
            }

            if (selectedSystems.length > 0) {
                const inserts = selectedSystems.map(id => ({
                    server_id: serverId,
                    system_id: id
                }));

                const { error: insError } = await supabase
                    .from('server_systems')
                    .insert(inserts);

                if (insError) {
                    toast.error("Erro ao salvar sistemas");
                    console.error(insError);
                    return;
                }
            }

            toast.success("Sistemas atualizados!");
        });
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Sistemas & Tags</h1>
                <p className="text-gray-500 text-sm">Selecione os sistemas que seu servidor possui para melhorar a busca.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Sistemas Disponíveis</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSystems.map(sys => {
                            const isSelected = selectedSystems.includes(sys.id);
                            return (
                                <button
                                    key={sys.id}
                                    onClick={() => toggleSystem(sys.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${isSelected
                                        ? 'bg-purple-100 border-purple-200 text-purple-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {sys.name}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                        {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                        Salvar Sistemas
                    </Button>
                </div>
            </div>
        </div>
    );
}
