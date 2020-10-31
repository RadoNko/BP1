export class RoleRef {
  id: any;
  logic: {
    perform: boolean;
    delegate: boolean;
    view: boolean;
  };

  constructor(id) {
    this.id = id;
    this.logic = {
      perform: false,
      delegate: false,
      view: false,
    };
  }

  clone(): RoleRef {
    const roleref = new RoleRef(this.id);
    roleref.logic = {...this.logic};
    return roleref;
  }
}
