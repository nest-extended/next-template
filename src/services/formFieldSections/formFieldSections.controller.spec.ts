import { Test, TestingModule } from '@nestjs/testing';
import { FormFieldSectionsController } from './formFieldSections.controller';

describe('FormFieldSectionsController', () => {
  let controller: FormFieldSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormFieldSectionsController],
    }).compile();

    controller = module.get<FormFieldSectionsController>(
      FormFieldSectionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
