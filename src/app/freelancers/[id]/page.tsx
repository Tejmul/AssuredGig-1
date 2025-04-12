import { AnimatedElement } from '@/components/ui/animated-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for a freelancer
const freelancer = {
  id: 1,
  name: 'Sarah Johnson',
  title: 'Senior Full Stack Developer',
  bio: 'Experienced developer with a passion for creating beautiful and functional web applications. Specialized in React, Node.js, and TypeScript.',
  hourlyRate: 75,
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
  portfolio: [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Built a full-featured e-commerce platform with React and Node.js',
      image: '/portfolio/project1.jpg'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Developed a task management application with real-time updates',
      image: '/portfolio/project2.jpg'
    }
  ],
  reviews: [
    {
      id: 1,
      client: 'Tech Corp',
      rating: 5,
      comment: 'Sarah was amazing to work with. Delivered high-quality work on time.',
      date: '2 months ago'
    },
    {
      id: 2,
      client: 'StartupX',
      rating: 4,
      comment: 'Great communication and technical skills. Would hire again.',
      date: '1 month ago'
    }
  ]
}

export default function FreelancerProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <AnimatedElement>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl">{freelancer.name}</CardTitle>
                <CardDescription className="text-xl">{freelancer.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{freelancer.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>

          <AnimatedElement delay={1}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {freelancer.portfolio.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>

          <AnimatedElement delay={2}>
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {freelancer.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{review.client}</CardTitle>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <CardDescription>{review.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>

        <div>
          <AnimatedElement delay={1}>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Hourly Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">${freelancer.hourlyRate}/hr</div>
                <Button className="w-full">Hire {freelancer.name}</Button>
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>
      </div>
    </div>
  )
} 