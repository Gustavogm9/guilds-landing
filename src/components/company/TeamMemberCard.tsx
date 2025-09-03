import React from 'react';
import { Link } from 'react-router-dom';
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
  instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  lattes: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2M12 0L10.5 7.5L3 9L10.5 10.5L12 18L13.5 10.5L21 9L13.5 7.5L12 0Z"/>
    </svg>
  ),
  portfolio: Globe,
  curriculum: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  ),
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

          {/* Curriculum Link */}
          {member.curriculum_slug && member.curriculum_is_public && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full"
              >
                <Link to={`/team/${member.curriculum_slug}/curriculum`}>
                  Ver Currículo Completo
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};