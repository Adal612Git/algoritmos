import { IEdge } from './Edge';
import { INode, NodeId, WeightMap } from './Node';

export class WeightedGraph {
  private nodes: Map<NodeId, INode> = new Map();
  private adjacencyList: Record<NodeId, WeightMap> = {};

  addNode(node: INode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node with id ${node.id} already exists`);
    }
    this.nodes.set(node.id, node);
  }

  addEdge(edge: IEdge): void {
    if (!this.nodes.has(edge.from) || !this.nodes.has(edge.to)) {
      throw new Error('Invalid edge. One of the nodes does not exist');
    }

    if (!this.adjacencyList[edge.from]) {
      this.adjacencyList[edge.from] = {};
    }
    if (!this.adjacencyList[edge.to]) {
      this.adjacencyList[edge.to] = {};
    }

    this.adjacencyList[edge.from][edge.to] = edge.weight;
    this.adjacencyList[edge.to][edge.from] = edge.weight;
  }

  getAdjacentNodes(from: NodeId): WeightMap {
    return this.adjacencyList[from] ? { ...this.adjacencyList[from] } : {};
  }

  getListOfConnectedNodeIds(): NodeId[] {
    return Object.keys(this.adjacencyList).filter((id) => Object.keys(this.adjacencyList[id]).length > 0);
  }

  getAllNodeIds(): NodeId[] {
    return Array.from(this.nodes.keys());
  }

  getNodes(): INode[] {
    return Array.from(this.nodes.values());
  }
}
