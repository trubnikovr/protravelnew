import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';

export interface TravelFactProperties extends DomainEntityProperties {
  text: string;
  countryCode: string | null;
  destinationCode: string | null;
  tags: string[];
  isPublished: boolean;
}

export class TravelFact extends DomainEntity<TravelFactProperties> {
  private constructor(private readonly properties: TravelFactProperties) {
    super(properties);
  }

  static restore(properties: TravelFactProperties): TravelFact {
    if (!properties.text.trim())
      throw new Error('Travel fact text is required');
    return new TravelFact(properties);
  }

  get text() {
    return this.properties.text;
  }
  get countryCode() {
    return this.properties.countryCode;
  }
  get destinationCode() {
    return this.properties.destinationCode;
  }
  get tags() {
    return this.properties.tags;
  }
  get isPublished() {
    return this.properties.isPublished;
  }
}
