export abstract class BaseEntity<T> {
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: T) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
