import { INode, NodeId } from './Node';
import { WeightMap, WeightedGraph } from './WeightedGraph';

export type Path = { path: NodeId[]; distance: number };

export class Dijkstra {
  private graph: WeightedGraph;

  constructor(graph: WeightedGraph) {
    this.graph = graph;
  }

  findShortestPath(fromNode: INode, toNode: INode): Path {
    const { distances, previous } = this.runDijkstra(fromNode);
    const targetId = toNode.id;

    if (!this.graph.getAllNodeIds().includes(toNode.id)) {
      throw new Error(`Node with id ${toNode.id} does not exist in the graph`);
    }

    if (!this.graph.getAllNodeIds().includes(fromNode.id)) {
      // esto deberia arreglar este problema de nodos inexistentes
      throw new Error(`Node with id ${fromNode.id} does not exist in the graph`);
    }

    if (fromNode.id === targetId) {
      return { path: [fromNode.id], distance: 0 };
    }

    const distance = distances[targetId];
    if (distance === undefined || distance === Infinity) {
      return { path: [], distance: Infinity };
    }

    const path = this.buildPath(previous, targetId);
    return { path, distance };
  }

  findAllShortestPaths(fromNode: INode): Record<NodeId, Path> {
    const { distances, previous } = this.runDijkstra(fromNode);
    const result: Record<NodeId, Path> = {};

    this.graph.getAllNodeIds().forEach((nodeId) => {
      const distance = distances[nodeId];
      if (distance === undefined || distance === Infinity) {
        result[nodeId] = { path: [], distance: Infinity };
      } else if (nodeId === fromNode.id) {
        result[nodeId] = { path: [nodeId], distance: 0 };
      } else {
        const path = this.buildPath(previous, nodeId);
        result[nodeId] = { path, distance };
      }
    });

    return result;
  }

  private runDijkstra(startNode: INode): { distances: Record<NodeId, number>; previous: Record<NodeId, NodeId | null> } {
    if (!this.graph.getAllNodeIds().includes(startNode.id)) {
      throw new Error(`Node with id ${startNode.id} does not exist in the graph`);
    }

    const distances: Record<NodeId, number> = {};
    const previous: Record<NodeId, NodeId | null> = {};
    const visited: Set<NodeId> = new Set();

    this.graph.getAllNodeIds().forEach((id) => {
      distances[id] = Infinity;
      previous[id] = null;
    });
    distances[startNode.id] = 0;

    const unvisited = new Set<NodeId>(this.graph.getAllNodeIds());

    while (unvisited.size > 0) {
      let current: NodeId | null = null;
      let currentDistance = Infinity;

      unvisited.forEach((nodeId) => {
        if (distances[nodeId] < currentDistance) {
          currentDistance = distances[nodeId];
          current = nodeId;
        }
      });

      if (current === null || currentDistance === Infinity) {
        break;
      }

      unvisited.delete(current);
      visited.add(current);

      const neighbors: WeightMap = this.graph.getAdjacentNodes(current);
      Object.keys(neighbors).forEach((neighborId) => {
        if (visited.has(neighborId)) {
          return;
        }
        const altDistance = distances[current as NodeId] + neighbors[neighborId];
        if (altDistance < distances[neighborId]) {
          distances[neighborId] = altDistance;
          previous[neighborId] = current as NodeId;
        }
      });
    }

    return { distances, previous };
  }

  private buildPath(previous: Record<NodeId, NodeId | null>, targetId: NodeId): NodeId[] {
    const path: NodeId[] = [];
    let current: NodeId | null = targetId;

    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    if (path[0] !== targetId && path.length === 1) {
      return [];
    }

    return path;
  }
}
