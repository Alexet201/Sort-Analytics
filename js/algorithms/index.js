/**
 * Registro de algoritmos.
 * ─────────────────────────────────────────────────────────────
 *  Para agregar un nuevo algoritmo:
 *    1. Crear el archivo en /js/algorithms/miAlgoritmo.js
 *    2. Importarlo acá
 *    3. Agregarlo al array `algorithms`
 *  Nada más. La UI se construye automáticamente desde este registro.
 * ─────────────────────────────────────────────────────────────
 */
import { bubbleSort }    from './bubble.js';
import { selectionSort } from './selection.js';
import { insertionSort } from './insertion.js';
import { mergeSort }     from './merge.js';
import { quickSort }     from './quick.js';
import { heapSort }      from './heap.js';

export const algorithms = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
];

const byId = new Map(algorithms.map((a) => [a.id, a]));

export function getAlgorithm(id) {
  return byId.get(id) ?? algorithms[0];
}
