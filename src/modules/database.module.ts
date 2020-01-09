// database.module.ts
import { entityContext } from '../entity.context';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [
        ...entityContext.keys().map(id => {
          const entityModule = entityContext(id);
          // We must get entity from module (commonjs)
          // Get first exported value from module (which should be entity class)
          const [entity] = Object.values(entityModule);
          return entity;
        }),
      ],
    }),
  ],
})
export class DatabaseModule { }
