-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "institution_type" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "signup_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "profile_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "time_frame_available" TEXT,
    "interested_fields" TEXT,
    "goal_fundraising" BOOLEAN NOT NULL,
    "goal_networking" BOOLEAN NOT NULL,
    "goal_validation" BOOLEAN NOT NULL,
    "goal_team_mate_finding" BOOLEAN NOT NULL,
    "goal_resume_experience" BOOLEAN NOT NULL,
    "goal_learning_experience" BOOLEAN NOT NULL,
    "goal_mentorship" BOOLEAN NOT NULL,
    "goal_prestige" BOOLEAN NOT NULL,
    "participation_type_team" BOOLEAN NOT NULL,
    "participation_type_individual" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "idea_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "sdgs" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "poc" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "team_size" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "interested_domain" TEXT NOT NULL,
    "help_needed" TEXT NOT NULL,
    "time_working" TEXT NOT NULL,
    "submitted_hackathon" BOOLEAN NOT NULL,
    "hackathon_feedback" TEXT,
    "motivation" TEXT NOT NULL,
    "future_goal" TEXT NOT NULL,
    "short_term_goal" TEXT NOT NULL,
    "support_needed" TEXT NOT NULL,
    "final_upload" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("idea_id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "competition_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "registration_link" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "organizer" TEXT,
    "tags" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("competition_id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "recommendation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("recommendation_id")
);

-- CreateTable
CREATE TABLE "UserCompetitionInteraction" (
    "interaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompetitionInteraction_pkey" PRIMARY KEY ("interaction_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "BlacklistedToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutstandingToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutstandingToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_user_id_key" ON "StudentProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedToken_token_key" ON "BlacklistedToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "OutstandingToken_token_key" ON "OutstandingToken"("token");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompetitionInteraction" ADD CONSTRAINT "UserCompetitionInteraction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlacklistedToken" ADD CONSTRAINT "BlacklistedToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutstandingToken" ADD CONSTRAINT "OutstandingToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
