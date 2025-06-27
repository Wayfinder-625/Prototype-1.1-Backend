import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionService } from './user-interaction.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserInteractionService', () => {
  let service: UserInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInteractionService,
        {
          provide: PrismaService,
          useValue: {
            competitionInteraction: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserInteractionService>(UserInteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
