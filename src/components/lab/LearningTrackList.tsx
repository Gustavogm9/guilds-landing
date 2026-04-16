
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, ArrowRight, Star, BookOpen } from 'lucide-react';

interface LearningTrack {
    id: string;
    title: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
    item_count?: number; // Calculated or joined
}

export function LearningTrackList() {
    const { data: tracks = [], isLoading } = useQuery({
        queryKey: ['public-tracks'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('learning_tracks')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (error) {
                // If table doesn't exist yet (migration pending), handle gracefully
                console.error("Error fetching tracks (migration might be missing):", error);
                return [];
            }
            return data as LearningTrack[];
        },
        retry: false // Don't retry if table is missing
    });

    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        );
    }

    if (tracks.length === 0) return null; // Don't show section if empty

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Trilhas de Conhecimento</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tracks.map((track) => (
                    <Card key={track.id} className="group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden relative">
                        <div
                            className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-2"
                            style={{ backgroundColor: track.color || '#primary' }}
                        />
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm"
                                    style={{ backgroundColor: track.color || '#666' }}
                                >
                                    {/* Placeholder icon logic if needed, or mapping */}
                                    <Star className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ver Trilha
                                </Badge>
                            </div>
                            <CardTitle className="group-hover:text-primary transition-colors">{track.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{track.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span>Jornada Completa</span>
                                <ArrowRight className="h-4 w-4 ml-auto -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
