import { Module } from '@nestjs/common';
import { CustomersModule } from '@modules/customers';
import { DocumentCipherService } from './document-cipher.service';
import { CustomerTravelersService } from './customer-travelers.service';

@Module({
  imports: [CustomersModule],
  providers: [CustomerTravelersService, DocumentCipherService],
  exports: [CustomerTravelersService],
})
export class CustomerTravelersModule {}
