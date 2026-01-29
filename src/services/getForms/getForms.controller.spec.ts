import { Test, TestingModule } from '@nestjs/testing';
import { GetFormsController } from './getForms.controller';

describe('GetFormsController', () => {
  let controller: GetFormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetFormsController],
    }).compile();

    controller = module.get<GetFormsController>(GetFormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
