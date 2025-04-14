"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedText } from "@/components/ui/animated-text";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles-core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  summary: string;
  experience: ResumeSection[];
  education: ResumeSection[];
  skills: string[];
  certifications: ResumeSection[];
}

export default function ResumePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  });

  const [activeTab, setActiveTab] = useState<string>("preview");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Fetch resume data when component mounts
  useEffect(() => {
    const fetchResumeData = async () => {
      if (status === "authenticated") {
        try {
          setIsLoading(true);
          const response = await fetch("/api/resume");
          
          if (response.ok) {
            const data = await response.json();
            setResumeData(data);
          } else if (response.status === 404) {
            // No resume found, use default empty state
            console.log("No resume found, using default state");
          } else {
            console.error("Error fetching resume:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching resume:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResumeData();
  }, [status]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSaveResume = async () => {
    try {
      setSaveStatus("saving");
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
        setActiveTab("preview");
      } else {
        const errorData = await response.json();
        console.error("Error saving resume:", errorData);
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setSaveStatus("error");
    }
  };

  const handleAddExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { id: Date.now().toString(), title: "", content: "" },
      ],
    });
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const handleUpdateExperience = (id: string, field: "title" | "content", value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const handleAddEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: Date.now().toString(), title: "", content: "" },
      ],
    });
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const handleUpdateEducation = (id: string, field: "title" | "content", value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const handleAddSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    });
  };

  const handleRemoveSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    });
  };

  const handleUpdateSkill = (index: number, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((skill, i) => (i === index ? value : skill)),
    });
  };

  const handleAddCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        { id: Date.now().toString(), title: "", content: "" },
      ],
    });
  };

  const handleRemoveCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    });
  };

  const handleUpdateCertification = (id: string, field: "title" | "content", value: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <BackgroundBeams className="absolute inset-0 z-0" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <AnimatedText
            variant="h1"
            size="4xl"
            weight="bold"
            className="mb-4"
            gradient
          >
            Professional Resume
          </AnimatedText>
          <AnimatedText
            variant="p"
            size="lg"
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
          >
            Create and manage your professional resume to showcase your skills and experience to potential clients.
          </AnimatedText>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 shadow-sm">
            <AnimatedButton
              variant={activeTab === "preview" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("preview")}
              className="rounded-md"
            >
              Preview
            </AnimatedButton>
            <AnimatedButton
              variant={activeTab === "edit" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("edit")}
              className="rounded-md"
            >
              Edit
            </AnimatedButton>
            <AnimatedButton
              variant={activeTab === "download" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("download")}
              className="rounded-md"
            >
              Download
            </AnimatedButton>
          </div>
        </div>

        {saveStatus === "success" && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
            Resume saved successfully!
          </div>
        )}

        {saveStatus === "error" && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
            Error saving resume. Please try again.
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {activeTab === "preview" && (
            <AnimatedCard
              variant="glass"
              className="p-8"
              glow
              gradient
            >
              <div className="mb-8">
                <AnimatedText variant="h2" size="3xl" weight="bold" className="mb-2">
                  {resumeData.personalInfo.name || "Your Name"}
                </AnimatedText>
                <AnimatedText variant="h3" size="xl" className="text-purple-600 dark:text-purple-400 mb-4">
                  {resumeData.personalInfo.title || "Professional Title"}
                </AnimatedText>
                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && (
                    <>
                      {resumeData.personalInfo.email && <span>•</span>}
                      <span>{resumeData.personalInfo.phone}</span>
                    </>
                  )}
                  {resumeData.personalInfo.location && (
                    <>
                      {(resumeData.personalInfo.email || resumeData.personalInfo.phone) && <span>•</span>}
                      <span>{resumeData.personalInfo.location}</span>
                    </>
                  )}
                  {resumeData.personalInfo.website && (
                    <>
                      {(resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.location) && <span>•</span>}
                      <span>{resumeData.personalInfo.website}</span>
                    </>
                  )}
                </div>
              </div>

              {resumeData.summary && (
                <div className="mb-8">
                  <AnimatedText variant="h3" size="xl" weight="semibold" className="mb-4">
                    Professional Summary
                  </AnimatedText>
                  <AnimatedText variant="p" className="text-gray-600 dark:text-gray-300">
                    {resumeData.summary}
                  </AnimatedText>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div className="mb-8">
                  <AnimatedText variant="h3" size="xl" weight="semibold" className="mb-4">
                    Experience
                  </AnimatedText>
                  {resumeData.experience.map((exp) => (
                    <motion.div
                      key={exp.id}
                      variants={itemVariants}
                      className="mb-4"
                    >
                      <AnimatedText variant="h4" size="lg" weight="medium" className="text-purple-600 dark:text-purple-400">
                        {exp.title}
                      </AnimatedText>
                      <AnimatedText variant="p" className="text-gray-600 dark:text-gray-300">
                        {exp.content}
                      </AnimatedText>
                    </motion.div>
                  ))}
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div className="mb-8">
                  <AnimatedText variant="h3" size="xl" weight="semibold" className="mb-4">
                    Education
                  </AnimatedText>
                  {resumeData.education.map((edu) => (
                    <motion.div
                      key={edu.id}
                      variants={itemVariants}
                      className="mb-4"
                    >
                      <AnimatedText variant="h4" size="lg" weight="medium" className="text-purple-600 dark:text-purple-400">
                        {edu.title}
                      </AnimatedText>
                      <AnimatedText variant="p" className="text-gray-600 dark:text-gray-300">
                        {edu.content}
                      </AnimatedText>
                    </motion.div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div className="mb-8">
                  <AnimatedText variant="h3" size="xl" weight="semibold" className="mb-4">
                    Skills
                  </AnimatedText>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.certifications.length > 0 && (
                <div>
                  <AnimatedText variant="h3" size="xl" weight="semibold" className="mb-4">
                    Certifications
                  </AnimatedText>
                  {resumeData.certifications.map((cert) => (
                    <motion.div
                      key={cert.id}
                      variants={itemVariants}
                      className="mb-4"
                    >
                      <AnimatedText variant="h4" size="lg" weight="medium" className="text-purple-600 dark:text-purple-400">
                        {cert.title}
                      </AnimatedText>
                      <AnimatedText variant="p" className="text-gray-600 dark:text-gray-300">
                        {cert.content}
                      </AnimatedText>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatedCard>
          )}

          {activeTab === "edit" && (
            <AnimatedCard
              variant="glass"
              className="p-8"
              glow
            >
              <AnimatedText variant="h2" size="2xl" weight="bold" className="mb-6">
                Edit Your Resume
              </AnimatedText>
              
              <div className="space-y-6">
                <div>
                  <AnimatedText variant="h3" size="lg" weight="semibold" className="mb-4">
                    Personal Information
                  </AnimatedText>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.title}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={resumeData.personalInfo.website}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, website: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <AnimatedText variant="h3" size="lg" weight="semibold" className="mb-4">
                    Professional Summary
                  </AnimatedText>
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      summary: e.target.value
                    })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <AnimatedText variant="h3" size="lg" weight="semibold">
                      Experience
                    </AnimatedText>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={handleAddExperience}
                    >
                      Add Experience
                    </AnimatedButton>
                  </div>
                  
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">Experience #{index + 1}</h4>
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleUpdateExperience(exp.id, "title", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={exp.content}
                            onChange={(e) => handleUpdateExperience(exp.id, "content", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <AnimatedText variant="h3" size="lg" weight="semibold">
                      Education
                    </AnimatedText>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={handleAddEducation}
                    >
                      Add Education
                    </AnimatedButton>
                  </div>
                  
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">Education #{index + 1}</h4>
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Degree/Certificate
                          </label>
                          <input
                            type="text"
                            value={edu.title}
                            onChange={(e) => handleUpdateEducation(edu.id, "title", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Details
                          </label>
                          <textarea
                            value={edu.content}
                            onChange={(e) => handleUpdateEducation(edu.id, "content", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <AnimatedText variant="h3" size="lg" weight="semibold">
                      Skills
                    </AnimatedText>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={handleAddSkill}
                    >
                      Add Skill
                    </AnimatedButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleUpdateSkill(index, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <AnimatedText variant="h3" size="lg" weight="semibold">
                      Certifications
                    </AnimatedText>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={handleAddCertification}
                    >
                      Add Certification
                    </AnimatedButton>
                  </div>
                  
                  {resumeData.certifications.map((cert, index) => (
                    <div key={cert.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">Certification #{index + 1}</h4>
                        <button
                          onClick={() => handleRemoveCertification(cert.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Certification Name
                          </label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => handleUpdateCertification(cert.id, "title", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Details
                          </label>
                          <textarea
                            value={cert.content}
                            onChange={(e) => handleUpdateCertification(cert.id, "content", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <AnimatedButton
                    variant="primary"
                    onClick={handleSaveResume}
                    loading={saveStatus === "saving"}
                  >
                    Save Resume
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedCard>
          )}

          {activeTab === "download" && (
            <AnimatedCard
              variant="glass"
              className="p-8 text-center"
              glow
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                className="w-full h-40"
                particleColor="#9333ea"
              />
              
              <AnimatedText variant="h2" size="2xl" weight="bold" className="mb-4">
                Download Your Resume
              </AnimatedText>
              
              <AnimatedText variant="p" className="mb-8 max-w-md mx-auto text-gray-600 dark:text-gray-300">
                Choose your preferred format to download your professional resume.
              </AnimatedText>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Download PDF
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Download Word
                </AnimatedButton>
              </div>
            </AnimatedCard>
          )}
        </motion.div>
      </div>
    </div>
  );
} 