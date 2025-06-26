import { IsString, IsArray, IsIn, MaxLength, ArrayMaxSize, IsNotEmpty } from 'class-validator';

export class CreateQuestionnaireDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Funding/Investment',
    'Networking',
    'Recognition/Awards',
    'Learning/Skills',
    'Job Opportunities',
    'Global Exposure'
  ])
  primaryGoal: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '6+ months',
    'Flexible'
  ])
  availabilityTimeframe: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Solo',
    'Small team (2-3)',
    'Large team (4+)',
    'Looking for teammates'
  ])
  teamStatus: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ])
  experienceLevel: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  projectTitle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  projectDescription: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'AI/Machine Learning',
    'Web Development',
    'Mobile Apps',
    'Data Science',
    'Blockchain/Crypto',
    'FinTech',
    'HealthTech',
    'EdTech',
    'AgriTech',
    'CleanTech/Sustainability',
    'IoT/Hardware',
    'Gaming',
    'E-commerce',
    'Social Impact',
    'Other'
  ])
  domain: string;

  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  keySkills: string[];

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Idea Stage',
    'Prototype',
    'Beta/Testing',
    'Launched',
    'Scaling'
  ])
  projectStage: string;
} 