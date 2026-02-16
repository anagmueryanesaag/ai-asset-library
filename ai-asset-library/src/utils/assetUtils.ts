import type { Asset, Filters } from '../types';

/**
 * Calculate relevance score for an asset based on search query
 * @param asset - The asset to score
 * @param query - The search query string
 * @returns Relevance score from 0-100
 */
export function calculateRelevance(asset: Asset, query: string): number {
  if (!query.trim()) return 90; // Default relevance when no query

  const queryLower = query.toLowerCase();
  const tokens = queryLower.split(/\s+/);

  let score = 0;

  // Title match (highest weight)
  const titleLower = asset.title.toLowerCase();
  if (titleLower.includes(queryLower)) score += 40;
  tokens.forEach(token => {
    if (titleLower.includes(token)) score += 15;
  });

  // Summary match (medium weight)
  const summaryLower = asset.summary.toLowerCase();
  if (summaryLower.includes(queryLower)) score += 20;
  tokens.forEach(token => {
    if (summaryLower.includes(token)) score += 5;
  });

  // Tags match (medium weight)
  const tagsLower = asset.tags.map(t => t.toLowerCase());
  tokens.forEach(token => {
    if (tagsLower.some(tag => tag.includes(token))) score += 8;
  });

  // Tech stack match (low weight)
  const techLower = asset.techStack.map(t => t.toLowerCase());
  tokens.forEach(token => {
    if (techLower.some(tech => tech.includes(token))) score += 5;
  });

  // Domain/Type match
  if (asset.domain.toLowerCase().includes(queryLower)) score += 10;
  if (asset.type.toLowerCase().includes(queryLower)) score += 10;

  // Recency bonus (up to 10 points for recent updates)
  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(asset.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyBonus = Math.max(0, 10 - daysSinceUpdate / 10);
  score += recencyBonus;

  // Normalize to 0-100
  return Math.min(100, Math.max(0, score));
}

/**
 * Filter assets based on active filters
 * @param assets - Array of assets to filter
 * @param filters - Active filter criteria
 * @returns Filtered array of assets
 */
export function filterAssets(
  assets: Asset[],
  filters: Filters
): Asset[] {
  return assets.filter(asset => {
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(asset.type)) {
      return false;
    }

    // Case code filter
    if (filters.caseCodes.length > 0 && !filters.caseCodes.includes(asset.caseCode)) {
      return false;
    }

    // Client filter
    if (filters.clients.length > 0 && !filters.clients.includes(asset.client)) {
      return false;
    }

    // Domain filter
    if (filters.domains.length > 0 && !filters.domains.includes(asset.domain)) {
      return false;
    }

    // Industry filter
    if (filters.industries.length > 0 && !filters.industries.includes(asset.industry)) {
      return false;
    }

    // Tech stack filter (asset must have at least one selected tech)
    if (filters.techStacks.length > 0) {
      const hasMatchingTech = filters.techStacks.some(tech =>
        asset.techStack.includes(tech)
      );
      if (!hasMatchingTech) return false;
    }

    // Region filter
    if (filters.regions.length > 0 && !filters.regions.includes(asset.region)) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(asset.status)) {
      return false;
    }

    // Owner filter
    if (filters.owners.length > 0 && !filters.owners.includes(asset.owner)) {
      return false;
    }

    // Tags filter (asset must have at least one selected tag)
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag =>
        asset.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

/**
 * Sort assets by relevance or recency
 * @param assets - Array of assets to sort
 * @param sortBy - Sort criteria ('relevance' or 'recent')
 * @param query - Search query for relevance scoring
 * @returns Sorted array of assets
 */
export function sortAssets(
  assets: Asset[],
  sortBy: 'relevance' | 'recent',
  query: string
): Asset[] {
  const assetsCopy = [...assets];

  if (sortBy === 'relevance') {
    return assetsCopy.sort((a, b) => {
      const scoreA = calculateRelevance(a, query);
      const scoreB = calculateRelevance(b, query);
      return scoreB - scoreA;
    });
  } else {
    return assetsCopy.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
}

export function getUniqueValues<T extends keyof Asset>(
  assets: Asset[],
  field: T
): string[] {
  const values = new Set<string>();
  assets.forEach(asset => {
    const value = asset[field];
    if (Array.isArray(value)) {
      value.forEach(v => values.add(v));
    } else if (typeof value === 'string') {
      values.add(value);
    }
  });
  return Array.from(values).sort();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
}
