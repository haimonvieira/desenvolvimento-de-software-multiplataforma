import type { Material } from "./model";

export type MaterialFolder = Readonly<{
  name: string;
  depth: number;
  materials: readonly Material[];
  folders: readonly MaterialFolder[];
}>;

type MutableFolder = {
  name: string;
  depth: number;
  materials: Material[];
  folders: Map<string, MutableFolder>;
};

/**
 * Groups a discipline's materials by their real folder structure.
 *
 * `ref.path` is `<semester>/<discipline>/...`, so the tree is built from the
 * segments below the discipline. Encounter order is preserved: `buildCatalog`
 * emits the Git tree in `compareCodeUnits` order and `query.browse` filters
 * without reordering, so a second comparator here could only disagree with it.
 * Nodes are only created while descending into a material that exists, so there
 * is no empty-folder cleanup pass.
 */
export function buildMaterialTree(materials: readonly Material[]): MaterialFolder {
  const root: MutableFolder = { name: "", depth: 0, materials: [], folders: new Map() };

  for (const material of materials) {
    let node = root;
    for (const segment of material.ref.path.split("/").slice(2, -1)) {
      let child = node.folders.get(segment);
      if (!child) {
        child = { name: segment, depth: node.depth + 1, materials: [], folders: new Map() };
        node.folders.set(segment, child);
      }
      node = child;
    }
    node.materials.push(material);
  }

  return toImmutable(root);
}

function toImmutable(folder: MutableFolder): MaterialFolder {
  const folders: MaterialFolder[] = [];
  for (const child of folder.folders.values()) folders.push(toImmutable(child));
  return { name: folder.name, depth: folder.depth, materials: folder.materials, folders };
}
