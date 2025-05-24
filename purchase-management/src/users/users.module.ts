import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { RolesModule } from '../roles/roles.module';  // Import RolesModule to link roles
import { EmailService } from './email.service'
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Make User entity available in the module
    RolesModule,  // Import RolesModule to link roles with the User
  ],
  controllers: [UsersController],
  providers: [UsersService,EmailService],
  exports: [
    UsersService,  // Export UsersService so it can be used in other modules
  ],
})
export class UsersModule {}
