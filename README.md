# 🏆 Competition Backend API

A robust backend API built with **NestJS** and **Prisma ORM** for managing hackathons, competitions, and student interactions. This platform provides comprehensive features for user management, competition tracking, personalized recommendations, and analytics.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with Google OAuth support
- **Competition Management** - CRUD operations for competitions with rich metadata
- **User Profiles** - Student profiles with skills, experience, and preferences
- **Questionnaire System** - Dynamic questionnaires for user onboarding
- **Recommendation Engine** - ML-powered competition recommendations
- **Interaction Tracking** - Comprehensive analytics for user behavior
- **Email Notifications** - SMTP-based email verification and notifications

### Advanced Features
- **Real-time Analytics** - Track user interactions and engagement patterns
- **Personalized Recommendations** - AI-driven competition matching
- **Token Management** - Secure JWT token handling with blacklisting
- **Database Migrations** - Prisma-based schema management
- **Docker Support** - Containerized deployment ready
- **Zero Downtime Deployment** - Production-ready deployment strategies

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Google OAuth
- **Email**: Nodemailer with SMTP
- **Validation**: Class-validator
- **Testing**: Jest
- **Deployment**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Docker (optional, for containerized deployment)
- Google OAuth credentials (for social login)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Prototype-1.1-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Start Development Server
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 🔧 Environment Configuration

Create a `.env` file based on `env.example`:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/competition_db

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# ML Recommender Service
RECOMMENDER_URL=http://localhost:8000/recommend

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Competition Platform <noreply@example.com>
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Google OAuth
```http
GET /auth/google
GET /auth/google/callback
```

### User Management

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <jwt_token>

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "location": "New York"
}
```

### Competition Management

#### Get All Competitions
```http
GET /competitions
```

#### Get Competition by ID
```http
GET /competitions/:id
```

#### Create Competition
```http
POST /competitions
Authorization: Bearer <jwt_token>

{
  "title": "AI Innovation Challenge",
  "description": "Build the next generation AI solution",
  "domain": "Technology",
  "tags": ["AI", "Machine Learning"],
  "prizeAmount": 10000,
  "deadline": "2024-12-31T23:59:59Z"
}
```

### Questionnaire System

#### Submit Questionnaire Response
```http
POST /questionnaire/submit
Authorization: Bearer <jwt_token>

{
  "primaryGoal": "learn_new_skills",
  "availabilityTimeframe": "3-6_months",
  "teamStatus": "individual",
  "experienceLevel": "beginner",
  "projectTitle": "My Project",
  "projectDescription": "Description of my project",
  "domain": "Technology",
  "keySkills": ["JavaScript", "React"],
  "projectStage": "idea"
}
```

### Recommendations

#### Get Personalized Recommendations
```http
GET /recommendations
Authorization: Bearer <jwt_token>
```

### Interaction Tracking

#### Record Competition Interaction
```http
POST /user-interaction/competition
Authorization: Bearer <jwt_token>

{
  "competitionId": "comp_123",
  "interactionType": "click",
  "metadata": {
    "source": "competition_list",
    "duration": 120
  }
}
```

#### Get User Interaction Stats
```http
GET /user-interaction/competition/stats
Authorization: Bearer <jwt_token>
```

## 🗄 Database Schema

The application uses the following main models:

- **User** - User accounts and profiles
- **Competition** - Competition listings and details
- **UserQuestionnaireResponse** - User questionnaire responses
- **RecommendedCompetition** - ML-generated recommendations
- **CompetitionInteraction** - User interaction tracking
- **JwtToken** - JWT token management
- **Otp** - One-time password verification

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t competition-backend .

# Run container
docker run -p 3000:3000 --env-file .env competition-backend
```

## 📊 Analytics & Monitoring

The platform includes comprehensive analytics:

- **User Interaction Tracking** - Monitor user engagement with competitions
- **Recommendation Analytics** - Track recommendation effectiveness
- **Competition Performance** - Analyze competition popularity and engagement
- **User Behavior Patterns** - Understand user preferences and behavior

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Token blacklisting for secure logout
- Input validation with class-validator
- CORS configuration
- Rate limiting (configurable)
- SQL injection protection via Prisma

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure email service
5. Set up SSL certificates

### Performance Optimization
- Enable database connection pooling
- Configure caching strategies
- Set up load balancing
- Monitor application metrics

## 📝 Available Scripts

```bash
# Development
npm run start:dev          # Start development server
npm run start:debug        # Start with debug mode

# Production
npm run build             # Build for production
npm run start:prod        # Start production server

# Database
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run E2E tests
npm run test:cov          # Generate coverage report
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the deployment guide in `ZERO_DOWNTIME_DEPLOYMENT.md`

## 🔗 Related Documentation

- [Competition Interaction Tracking](./COMPETITION_INTERACTION_TRACKING.md)
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)
- [Zero Downtime Deployment](./ZERO_DOWNTIME_DEPLOYMENT.md)

---

**Built with ❤️ using NestJS and Prisma**

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
