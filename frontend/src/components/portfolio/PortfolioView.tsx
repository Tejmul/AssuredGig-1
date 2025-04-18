"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  projects: {
    title: string;
    description: string;
    url?: string;
    technologies: string[];
  }[];
  user: {
    name: string;
    image: string;
  };
}

interface PortfolioViewProps {
  userId: string;
}

export function PortfolioView({ userId }: PortfolioViewProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch portfolio");
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        toast.error("Failed to load portfolio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [userId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!portfolio) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Portfolio not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={portfolio.user.image} />
              <AvatarFallback>{portfolio.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{portfolio.user.name}</CardTitle>
              <h2 className="text-xl font-semibold">{portfolio.title}</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{portfolio.description}</p>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolio.experience.map((exp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate
                    ? format(new Date(exp.endDate), "MMM yyyy")
                    : "Present"}
                </p>
              </div>
              <p className="text-muted-foreground">{exp.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolio.education.map((edu, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                  {edu.endDate
                    ? format(new Date(edu.endDate), "MMM yyyy")
                    : "Present"}
                </p>
              </div>
              {edu.description && (
                <p className="text-muted-foreground">{edu.description}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolio.projects.map((project, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 