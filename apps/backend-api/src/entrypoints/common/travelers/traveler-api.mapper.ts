import type { Traveler } from '@modules/customers/submodules/customer-travelers';
import type { TravelerResponseDto } from './dto/response/traveler.response.dto';

export class TravelerApiMapper {
  static toResponse(traveler: Traveler): TravelerResponseDto {
    return {
      id: traveler.id.toString(),
      customerId: traveler.customerId.toString(),
      relationship: traveler.relationship,
      firstName: traveler.firstName,
      lastName: traveler.lastName,
      middleName: traveler.middleName,
      firstNameLatin: traveler.firstNameLatin,
      lastNameLatin: traveler.lastNameLatin,
      gender: traveler.gender,
      birthDate: traveler.birthDate?.toString() ?? null,
      citizenshipCountryCode: traveler.citizenshipCountryCode,
      phone: traveler.phone,
      email: traveler.email,
      createdAt: traveler.createdAt.toString(),
      updatedAt: traveler.updatedAt.toString(),
      documents: traveler.documents.map((document) => ({
        id: document.id.toString(),
        type: document.type,
        maskedNumber: document.maskedNumber,
        issuingCountryCode: document.issuingCountryCode,
        issuedAt: document.issuedAt?.toString() ?? null,
        expiresAt: document.expiresAt?.toString() ?? null,
        firstNameLatin: document.firstNameLatin,
        lastNameLatin: document.lastNameLatin,
        fileId: document.fileId?.toString() ?? null,
        createdAt: document.createdAt.toString(),
        updatedAt: document.updatedAt.toString(),
      })),
    };
  }
}
