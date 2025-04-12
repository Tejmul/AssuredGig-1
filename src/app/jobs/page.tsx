import { AnimatedElement } from '@/components/ui/animated-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data for jobs
const jobs = [
  {
    id: 1,
    title: 'Full Stack Developer Needed',
    description: 'Looking for an experienced full stack developer to build a modern web application.',
    budget: '$5000',
    skills: ['React', 'Node.js', 'TypeScript'],
    postedBy: 'Tech Corp',
    postedDate: '2 days ago'
  },
  {
    id: 2,
    title: 'UI/UX Designer for Mobile App',
    description: 'Need a talented UI/UX designer to create beautiful mobile app interfaces.',
    budget: '$3000',
    skills: ['Figma', 'UI Design', 'Mobile'],
    postedBy: 'StartupX',
    postedDate: '1 day ago'
  },
  {
    id: 3,
    title: 'Content Writer for Blog',
    description: 'Seeking a skilled content writer for our tech blog.',
    budget: '$1000',
    skills: ['Writing', 'SEO', 'Tech'],
    postedBy: 'BlogHub',
    postedDate: '3 days ago'
  }
]

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8">
      <AnimatedElement className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Project</h1>
        <p className="text-muted-foreground mb-6">
          Browse through our latest job postings and find the perfect opportunity.
        </p>
        <div className="flex gap-4 mb-8">
          <Input
            type="search"
            placeholder="Search jobs..."
            className="max-w-sm"
          />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1000">$0 - $1,000</SelectItem>
              <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
              <SelectItem value="5000+">$5,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AnimatedElement>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <AnimatedElement key={job.id} delay={index}>
            <Card>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>Posted by {job.postedBy} • {job.postedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="font-semibold">Budget: {job.budget}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          </AnimatedElement>
        ))}
      </div>
    </div>
  )
} 