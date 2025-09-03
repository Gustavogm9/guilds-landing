import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArrowLeft, MapPin, Calendar, ExternalLink, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/hooks/useCompanyData';

export const TeamCurriculum: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMember = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('curriculum_slug', slug)
          .eq('is_active', true)
          .eq('curriculum_is_public', true)
          .single();

        if (error) throw error;
        
        // Process the member data to handle JSON fields
        const processedMember: TeamMember = {
          ...data,
          expertise: Array.isArray(data.expertise) 
            ? data.expertise.filter(e => typeof e === 'string') as string[]
            : [],
          social_links: typeof data.social_links === 'object' && 
                       !Array.isArray(data.social_links) && 
                       data.social_links !== null 
            ? data.social_links as Record<string, string> 
            : {}
        };
        
        setMember(processedMember);
      } catch (err: any) {
        console.error('Error fetching member:', err);
        setError(err.message || 'Membro não encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="flex gap-6">
              <div className="h-32 w-32 bg-muted rounded-full"></div>
              <div className="space-y-4 flex-1">
                <div className="h-8 bg-muted rounded w-64"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <>
        <SEOHead
          title="Currículo não encontrado"
          description="O currículo solicitado não foi encontrado ou não está disponível publicamente."
        />
        <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">Currículo não encontrado</h1>
              <p className="text-muted-foreground">
                O currículo solicitado não foi encontrado ou não está disponível publicamente.
              </p>
              <Button asChild>
                <Link to="/sobre#equipe">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Equipe
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const initials = member.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <SEOHead
        title={`${member.name} - Currículo Completo`}
        description={`Conheça a trajetória profissional de ${member.name}, ${member.position} na Guilds. Experiência, projetos e especializações.`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/sobre#equipe">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Equipe
              </Link>
            </Button>
          </div>

          {/* Header */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-accent/20">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{member.name}</h1>
                    <p className="text-xl text-primary font-medium">{member.position}</p>
                  </div>

                  {member.bio && (
                    <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                  )}

                  {/* Expertise */}
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Social Links */}
                  {member.social_links && Object.keys(member.social_links).length > 0 && (
                    <div className="flex gap-3 pt-2">
                      {Object.entries(member.social_links).map(([platform, url]) => (
                        <Button
                          key={platform}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Curriculum Content */}
          {member.curriculum_content && (
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {member.curriculum_content}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!member.curriculum_content && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  O currículo completo ainda está sendo preparado. 
                  Entre em contato para mais informações sobre a experiência profissional.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button asChild>
              <Link to="/contato">
                Entre em Contato
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Imprimir Currículo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};