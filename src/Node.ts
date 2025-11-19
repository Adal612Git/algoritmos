export type NodeId = string;

export interface INode {
  readonly id: NodeId;
}

export class Node implements INode {
  public readonly id: NodeId;

  constructor(id: NodeId) {
    this.id = id;
  }
}
