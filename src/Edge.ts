import { INode, NodeId } from './Node';

export interface IEdge {
  readonly from: NodeId;
  readonly to: NodeId;
  readonly weight: number;
}

export class Edge implements IEdge {
  public readonly from: NodeId;
  public readonly to: NodeId;
  public readonly weight: number;

  constructor(fromNode: INode, toNode: INode, weight: number) {
    this.from = fromNode.id;
    this.to = toNode.id;
    this.weight = weight;
  }
}
