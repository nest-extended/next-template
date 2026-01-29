import { Test, TestingModule } from '@nestjs/testing';
import { FormFieldSectionsService } from './formFieldSections.service';

describe('FormFieldSectionsService', () => {
  let service: FormFieldSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormFieldSectionsService],
    }).compile();

    service = module.get<FormFieldSectionsService>(FormFieldSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
