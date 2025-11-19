import { INode, NodeId, WeightMap } from './Node';
import { WeightedGraph } from './WeightedGraph';

export type Path = { path: NodeId[]; distance: number };

export class Dijkstra {
  private graph: WeightedGraph;

  constructor(graph: WeightedGraph) {
    this.graph = graph;
  }

  private ensureNodeExists(node: INode): void {
    if (!this.graph.getAllNodeIds().includes(node.id)) {
      throw new Error(`Node with id ${node.id} does not exist in the graph`);
    }
  }

  private computePaths(fromId: NodeId): { distances: Record<NodeId, number>; previous: Record<NodeId, NodeId | null> } {
    const nodeIds = this.graph.getAllNodeIds();
    const distances: Record<NodeId, number> = {};
    const previous: Record<NodeId, NodeId | null> = {};

    nodeIds.forEach((id) => {
      distances[id] = Infinity;
      previous[id] = null;
    });

    distances[fromId] = 0;

    const unvisited = new Set<NodeId>(nodeIds);

    while (unvisited.size > 0) {
      let current: NodeId | null = null;
      let minDistance = Infinity;

      for (const id of unvisited) {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          current = id;
        }
      }

      if (current === null) {
        break;
      }

      if (distances[current] === Infinity) {
        break;
      }

      unvisited.delete(current);

      const neighbors: WeightMap = this.graph.getAdjacentNodes(current);
      Object.entries(neighbors).forEach(([neighborId, weight]) => {
        if (!unvisited.has(neighborId)) {
          return;
        }
        const alternate = distances[current as NodeId] + weight;
        if (alternate < distances[neighborId]) {
          distances[neighborId] = alternate;
          previous[neighborId] = current;
        }
      });
    }

    return { distances, previous };
  }

  private reconstructPath(targetId: NodeId, startId: NodeId, previous: Record<NodeId, NodeId | null>, distance: number): Path {
    if (distance === Infinity) {
      return { path: [], distance };
    }

    const path: NodeId[] = [];
    let current: NodeId | null = targetId;

    while (current !== null) {
      path.unshift(current);
      if (current === startId) {
        break;
      }
      current = previous[current];
      if (current === null) {
        return { path: [], distance: Infinity };
      }
    }

    return { path, distance };
  }

  findShortestPath(fromNode: INode, toNode: INode): Path {
    this.ensureNodeExists(fromNode);
    this.ensureNodeExists(toNode);

    if (fromNode.id === toNode.id) {
      return { path: [fromNode.id], distance: 0 };
    }

    const { distances, previous } = this.computePaths(fromNode.id);
    const distance = distances[toNode.id] ?? Infinity;

    if (distance === Infinity) {
      return { path: [], distance: Infinity };
    }

    return this.reconstructPath(toNode.id, fromNode.id, previous, distance);
  }

  findAllShortestPaths(fromNode: INode): Record<NodeId, Path> {
    this.ensureNodeExists(fromNode);

    const { distances, previous } = this.computePaths(fromNode.id);
    const result: Record<NodeId, Path> = {};

    this.graph.getAllNodeIds().forEach((id) => {
      const distance = distances[id] ?? Infinity;
      if (distance === Infinity) {
        result[id] = { path: [], distance: Infinity };
      } else {
        result[id] = this.reconstructPath(id, fromNode.id, previous, distance);
      }
    });

    return result;
  }
}
