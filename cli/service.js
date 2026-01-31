const getService = (Name, name, enableSoftDelete = true) => {
  const superCall = enableSoftDelete
    ? `super(${name}Model)`
    : `super(${name}Model, { softDelete: false })`;

  return `import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { ${Name}, ${Name}Document } from 'src/schemas/${name}.schema';

@Injectable()
export class ${Name}Service extends NestService<${Name}, ${Name}Document> {
  constructor(
    @InjectModel(${Name}.name) private readonly ${name}Model: Model<${Name}Document>,
  ) {
    ${superCall}
  }
}`;
};

module.exports = getService;