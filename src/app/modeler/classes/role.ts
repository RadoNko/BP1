export class Role {
  id: any;
  title: string;

  constructor(id) {
    this.id = id;
    this.title = '';
  }

  clone(): Role {
    const role = new Role(this.id);
    role.title = this.title;
    return role;
  }
}
