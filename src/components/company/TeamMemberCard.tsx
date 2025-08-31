import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/hooks/useCompanyData';
import { Linkedin, Github, Twitter, Globe, ExternalLink } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

const socialIcons = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  portfolio: Globe,
  behance: ExternalLink,
  website: Globe,
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const initials = member.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card border-border">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30">
              <AvatarImage src={member.avatar_url} alt={member.name} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-accent/20">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and Position */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
            <p className="text-sm font-medium text-primary">{member.position}</p>
          </div>

          {/* Bio */}
          {member.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {member.bio}
            </p>
          )}

          {/* Expertise */}
          {member.expertise && member.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {member.expertise.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-1"
                >
                  {skill}
                </Badge>
              ))}
              {member.expertise.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{member.expertise.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Social Links */}
          {member.social_links && Object.keys(member.social_links).length > 0 && (
            <div className="flex justify-center gap-2 pt-2">
              {Object.entries(member.social_links).map(([platform, url]) => {
                const IconComponent = socialIcons[platform as keyof typeof socialIcons] || ExternalLink;
                
                return (
                  <Button
                    key={platform}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="sr-only">{platform}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};