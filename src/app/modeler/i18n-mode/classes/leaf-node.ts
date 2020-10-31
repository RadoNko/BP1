export interface TreeNode {
  treeNodeName?: string;
  identifier?: string;
  original?: string;
  values?: any[];
  children?: TreeNode[];
}

export class LeafNode implements TreeNode {
  constructor() {
  }
}
