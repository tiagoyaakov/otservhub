
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type HypeType = 'GOING' | 'WAITING' | 'MAYBE';

export interface UserHype {
    id: string;
    user_id: string;
    server_id: string;
    hype_type: HypeType;
    created_at: string;
}

export interface HypeCounts {
    going: number;
    waiting: number;
    maybe: number;
    total: number;
}

export interface Database {
    public: {
        Tables: {
            user_hypes: {
                Row: UserHype;
                Insert: Omit<UserHype, 'id' | 'created_at'>;
                Update: Partial<Omit<UserHype, 'id'>>;
            };
            servers: {
                Row: {
                    id: string
                    owner_id: string
                    name: string
                    slug: string
                    ip_address: string
                    port: number
                    version_id: number
                    client_link: string | null
                    website_url: string | null
                    description: string | null
                    map_type: string | null
                    pvp_type: 'PVP' | 'NO_PVP' | 'PVP_ENFORCED' | 'RETRO_PVP'
                    exp_rate: string | null
                    launch_date: string
                    hype_score: number
                    verification_token: string
                    is_verified: boolean
                    is_online: boolean
                    online_count: number
                    max_players: number
                    last_ping: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    // ... (simplified for read-only focus now)
                }
                Update: {
                    // ...
                }
            }
            game_versions: {
                Row: {
                    id: number
                    value: string
                    label: string
                    display_order: number
                }
            }
            ad_slots: {
                Row: {
                    id: number
                    name: string
                    position_code: string
                    price: number
                    is_active: boolean
                }
            }
        }
    }
}

// Helper Types for Frontend
export type ServerWithVersion = Database['public']['Tables']['servers']['Row'] & {
    version?: Database['public']['Tables']['game_versions']['Row']
}
