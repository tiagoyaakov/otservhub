
import { z } from "zod";

export const serverFormSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    ip: z.string().min(1, "O IP é obrigatório"),
    port: z.coerce.number().min(1, "Porta inválida").default(7171),

    // Conditionally required based on version selection in UI, but simplified here
    version: z.string().optional(),
    customVersion: z.string().optional(),

    website: z.string().url("URL inválida"),
    downloadLink: z.string().url("URL inválida").optional().or(z.literal("")),

    launchDate: z.string().optional(),
    launchTime: z.string().optional(),
    isReleaseDateTba: z.boolean().default(false),
    timezone: z.string().default("UTC"),

    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),

    mapType: z.string().min(1, "Selecione o tipo de mapa"),
    customMapType: z.string().optional(),

    pvpType: z.enum(["PVP", "NO_PVP", "PVP_ENFORCED", "RETRO_PVP"]), // Adjusted to match DB enum if needed, or mapped later

    rate: z.string().min(1, "Informe a rate"),

    theme: z.string().min(1, "Selecione a temática"),
    customTheme: z.string().optional(),

    systems: z.array(z.string()),

    discordLink: z.string().url("URL inválida").optional().or(z.literal("")),
    whatsappLink: z.string().url("URL inválida").optional().or(z.literal("")),

    hasMobile: z.boolean().default(false),

    bannerUrl: z.string().optional(), // For now assuming pre-uploaded or handled separately
    isVerified: z.boolean().default(false).optional(),
}).refine(data => {
    if (data.version === "Outro" && !data.customVersion) {
        return false;
    }
    return true;
}, {
    message: "Informe a versão customizada",
    path: ["customVersion"]
}).refine(data => {
    if (data.mapType === "Outro" && !data.customMapType) {
        return false;
    }
    return true;
}, {
    message: "Informe o mapa customizado",
    path: ["customMapType"]
}).refine(data => {
    if (data.theme === "Outro" && !data.customTheme) {
        return false;
    }
    return true;
}, {
    message: "Informe o tema",
    path: ["customTheme"]
}).refine(data => {
    if (!data.isReleaseDateTba && (!data.launchDate || !data.launchTime)) {
        return false;
    }
    return true;
}, {
    message: "Data e hora são obrigatórios se não for 'Em breve'",
    path: ["launchDate"]
});

export type ServerFormValues = z.infer<typeof serverFormSchema>;
