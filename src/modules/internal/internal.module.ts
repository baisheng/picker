import { Module } from '@nestjs/common';
// import { UserService } from '@app/modules/users/user.service';
import { exportedProviders } from '@app/modules/internal/internal.service';
import { InternalController } from '@app/modules/internal/internal.controller';

@Module({
  controllers: [InternalController],
  providers: [...exportedProviders],
  exports: [...exportedProviders],
})
export class InternalModule {
}
