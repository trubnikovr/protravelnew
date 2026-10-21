import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';

export enum SystemMessageType {
  INFO = 'info',
  ERROR = 'error',
}

export interface SystemMessageProperties extends DomainEntityProperties {
  text: string;
  type: SystemMessageType;
  isActive: boolean;
}

export class SystemMessage extends DomainEntity<SystemMessageProperties> {
  private constructor(private readonly properties: SystemMessageProperties) {
    super(properties);
  }

  static restore(properties: SystemMessageProperties): SystemMessage {
    if (!properties.text.trim()) throw new Error('System message is required');
    return new SystemMessage({...properties, text: properties.text.trim()});
  }

  get text(): string {
    return this.properties.text;
  }

  get type(): SystemMessageType {
    return this.properties.type;
  }

  get isActive(): boolean {
    return this.properties.isActive;
  }
}
