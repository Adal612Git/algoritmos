export type NodeId = string;
export type WeightMap = Record<NodeId, number>;

export interface INode {
  id: NodeId;
}

export class Node implements INode {
  public readonly id: NodeId;

  constructor(id: NodeId) {
    this.id = id;
  }
}
