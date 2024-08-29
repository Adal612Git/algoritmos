import { Node } from './Node';
import { Edge } from './Edge';
import { WeightedGraph } from './WeightedGraph';
import { Dijkstra } from './Dijkstra';

const node1 = new Node('1');
const node2 = new Node('2');
const node3 = new Node('3');
const node4 = new Node('4');
const node5 = new Node('5');
const nodes = [node1, node2, node3, node4, node5];
const edges = [
  new Edge(node1, node4, 3),
  new Edge(node1, node2, 5),
  new Edge(node1, node3, 4),
  new Edge(node2, node4, 6),
  new Edge(node2, node3, 5),
];
const graph = new WeightedGraph();

nodes.forEach((node) => graph.addNode(node));
edges.forEach((edge) => graph.addEdge(edge));

const dijkstra = new Dijkstra(graph);

console.log(dijkstra.findShortestPath(node4, node3));
console.log(dijkstra.findShortestPath(node1, node5));
console.log(dijkstra.findShortestPath(node1, node1));
console.log(dijkstra.findAllShortestPaths(node4));
