import { BaseEntity } from './base-entity';

interface ClientProps {
  name: string;
  email: string;
  phone: string;
}

export class Client extends BaseEntity<ClientProps> {
  readonly name: string;
  readonly email: string;
  readonly phone: string;

  constructor(props: ClientProps, id?: string) {
    super(props);
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    
    if (id) {
      this.id = id;
    }
  }

  static create(props: ClientProps, id?: string): Client {
    return new Client(props, id);
  }

  update(props: Partial<ClientProps>): Client {
    this.updatedAt = new Date();
    
    return new Client(
      {
        name: props.name !== undefined ? props.name : this.name,
        email: props.email !== undefined ? props.email : this.email,
        phone: props.phone !== undefined ? props.phone : this.phone
      },
      this.id
    );
  }
}
