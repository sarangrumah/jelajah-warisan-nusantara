import { useEffect, useState } from 'react';
import { menuService } from '@/lib/api-services';

export interface MenuRecord {
  id: string;
  label: string;
  label_en?: string;
  href?: string;
  parent_id?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface MenuNode {
  name: string;
  nameEn?: string;
  href: string;
  subItems?: MenuNode[];
}

// Module-level cache so the menu is fetched once per page load
let cachedTree: MenuNode[] | null = null;
let pendingFetch: Promise<MenuNode[] | null> | null = null;

function buildTree(records: MenuRecord[]): MenuNode[] {
  const active = records
    .filter((r) => r.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const toNode = (r: MenuRecord): MenuNode => ({
    name: r.label,
    nameEn: r.label_en || undefined,
    href: r.href || '#',
  });

  const topLevel = active.filter((r) => !r.parent_id);
  return topLevel.map((parent) => {
    const children = active.filter((r) => r.parent_id === parent.id);
    const node = toNode(parent);
    if (children.length > 0) {
      node.subItems = children.map(toNode);
    }
    return node;
  });
}

async function fetchTree(): Promise<MenuNode[] | null> {
  try {
    const response = await menuService.getAll();
    if (response.error || !Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }
    return buildTree(response.data as MenuRecord[]);
  } catch {
    return null;
  }
}

/**
 * CMS-managed navigation menu (tb_menu) with graceful degradation:
 * returns null until loaded; callers keep their hardcoded menu as fallback
 * so navigation never disappears when the API is down or the table is empty.
 */
export function useMenu(): MenuNode[] | null {
  const [tree, setTree] = useState<MenuNode[] | null>(cachedTree);

  useEffect(() => {
    if (cachedTree) { return; }
    if (!pendingFetch) {
      pendingFetch = fetchTree().then((result) => {
        cachedTree = result;
        return result;
      });
    }
    let mounted = true;
    pendingFetch.then((result) => {
      if (mounted && result) {
        setTree(result);
      }
    });
    return () => { mounted = false; };
  }, []);

  return tree;
}
