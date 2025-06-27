import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserInteractionController', () => {
  let controller: UserInteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInteractionController],
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

    controller = module.get<UserInteractionController>(UserInteractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
