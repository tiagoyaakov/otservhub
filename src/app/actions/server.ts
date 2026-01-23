
"use server";

import { createClient } from "@/lib/supabase/server";
import { serverFormSchema, ServerFormValues } from "@/lib/schemas/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = {
    success?: boolean;
    error?: string;
    errors?: Record<string, string[]>;
} | null;

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

export async function registerServer(
    prevState: ActionState,
    formData: ServerFormValues
): Promise<ActionState> {
    const validatedFields = serverFormSchema.safeParse(formData);

    if (!validatedFields.success) {
        return {
            error: "Erro de validação",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Você precisa estar logado para cadastrar um servidor." };
    }

    // 1. Prepare data
    const slug = slugify(data.name) + "-" + Math.floor(Math.random() * 1000);

    // Handle Launch Date
    let launchDateISO = new Date().toISOString(); // Default fallback
    if (!data.isReleaseDateTba && data.launchDate) {
        // Combine date and time
        const time = data.launchTime || "00:00";
        launchDateISO = new Date(`${data.launchDate}T${time}:00`).toISOString();
    }

    // Handle Version ID logic (fetch strict version ID if standard, else null)
    let versionId: number | null = null;
    if (data.version && data.version !== "Outro") {
        // We need to fetch the ID for this version label or value
        const { data: versionData } = await supabase
            .from("game_versions")
            .select("id")
            .eq("value", data.version) // Assuming the select option values match the DB 'value' column
            .single();

        if (versionData) {
            versionId = versionData.id;
        }
    }

    // 2. Insert Server
    const { data: server, error: serverError } = await supabase
        .from("servers")
        .insert({
            owner_id: user.id,
            name: data.name,
            slug: slug,
            ip_address: data.ip,
            port: data.port,
            version_id: versionId,
            custom_version: data.customVersion,
            website_url: data.website,
            download_link: data.downloadLink,
            description: data.description,
            map_type: data.mapType === "Outro" ? "Custom" : data.mapType, // Store generic "Custom" or specific
            custom_map_type: data.customMapType,
            pvp_type: data.pvpType,
            exp_rate: data.rate,
            theme: data.theme === "Outro" ? data.customTheme : data.theme,
            launch_date: launchDateISO,
            is_release_date_tba: data.isReleaseDateTba,
            timezone: data.timezone,
            discord_invite_link: data.discordLink,
            whatsapp_group_link: data.whatsappLink,
            // Default checks
            is_verified: data.isVerified || false,
            is_online: false,
        })
        .select("id")
        .single();

    if (serverError) {
        console.error("Error creating server:", serverError);
        return { error: "Erro ao criar servidor. Verifique os dados e tente novamente." };
    }

    const serverId = server.id;

    // 3. Handle Systems
    if (data.systems && data.systems.length > 0) {
        for (const systemName of data.systems) {
            // Try to find existing system
            let systemId: string | null = null;

            const { data: existingSystem } = await supabase
                .from("systems")
                .select("id")
                .eq("name", systemName)
                .single();

            if (existingSystem) {
                systemId = existingSystem.id;
            } else {
                // Create new custom system
                const { data: newSystem, error: newSystemError } = await supabase
                    .from("systems")
                    .insert({
                        name: systemName,
                        is_custom: true,
                        is_approved: false, // Default unapproved
                    })
                    .select("id")
                    .single();

                if (!newSystemError && newSystem) {
                    systemId = newSystem.id;
                }
            }

            // Link to server
            if (systemId) {
                await supabase.from("server_systems").insert({
                    server_id: serverId,
                    system_id: systemId,
                });
            }
        }
    }

    revalidatePath("/");
    revalidatePath("/perfil");
    redirect("/perfil");
}

export async function getUserServers() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: servers } = await supabase
        .from("servers")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    return servers || [];
}

export async function getServers() {
    const supabase = await createClient();

    // Fetch verified servers for homepage
    // We can add improved filtering/pagination later
    const { data: servers } = await supabase
        .from("servers")
        .select("*")
        // .eq("is_verified", true) // Uncomment to enforce verification for homepage
        .order("is_verified", { ascending: false }) // Verified first
        .order("created_at", { ascending: false });

    return servers || [];
}
