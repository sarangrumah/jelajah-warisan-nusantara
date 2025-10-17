/**
 * Image Helper Utilities for Production Compatibility
 * 
 * This file provides helper functions to handle image URLs consistently
 * across development and production environments.
 * 
 * Key differences:
 * - Development: Vite serves from /src/assets/
 * - Production: Backend serves from /assets/
 */

import { assetUrl } from './asset-url';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

/**
 * Generic image URL helper
 * Handles both local assets and uploaded images
 */
export function getImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = filename.trim();
  
  // If empty or just whitespace
  if (!trimmed) {
    return PLACEHOLDER_IMAGE;
  }

  // Use the assetUrl utility for transformation
  return assetUrl(trimmed);
}

/**
 * Museum image URL helper
 * For images in /assets/museums/ directory
 */
export function getMuseumImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = filename.trim();
  
  // If it's already a full path or URL, use assetUrl
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) {
    return assetUrl(trimmed);
  }

  // If it's just a filename, construct the path
  return assetUrl(`/assets/museums/${trimmed}`);
}

/**
 * Collection image URL helper
 * For images in /assets/collections/ directory
 */
export function getCollectionImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = filename.trim();
  
  // If it's already a full path or URL, use assetUrl
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) {
    return assetUrl(trimmed);
  }

  // If it's just a filename, construct the path
  return assetUrl(`/assets/collections/${trimmed}`);
}

/**
 * News/Article image URL helper
 * For images in /assets/Berita/ directory
 */
export function getNewsImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = filename.trim();
  
  // If it's already a full path or URL, use assetUrl
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) {
    return assetUrl(trimmed);
  }

  // If it's just a filename, construct the path
  return assetUrl(`/assets/Berita/${trimmed}`);
}

/**
 * Event image URL helper
 * For images in /assets/events/ directory
 */
export function getEventImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = filename.trim();
  
  // If it's already a full path or URL, use assetUrl
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) {
    return assetUrl(trimmed);
  }

  // If it's just a filename, construct the path
  return assetUrl(`/assets/events/${trimmed}`);
}

/**
 * Asset/Pemanfaatan image URL helper
 * For images in /assets/images/ directory
 */
export function getAssetImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = filename.trim();
  
  // If it's already a full path or URL, use assetUrl
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) {
    return assetUrl(trimmed);
  }

  // If it's just a filename, construct the path
  return assetUrl(`/assets/images/${trimmed}`);
}

/**
 * Helper to extract filename from a path
 * Useful when you have a full path but need just the filename
 */
export function extractFilename(path: string | undefined | null): string {
  if (!path) {
    return '';
  }

  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Helper to check if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Helper to get uploaded file URL
 * For files uploaded through the backend API
 */
export function getUploadedFileUrl(path: string | undefined | null): string {
  if (!path) {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = path.trim();
  
  // If it's already a full URL, return as-is
  if (isExternalUrl(trimmed)) {
    return trimmed;
  }

  // If it starts with /uploads/, it's correct
  if (trimmed.startsWith('/uploads/')) {
    return trimmed;
  }

  // Otherwise, prepend /uploads/
  return `/uploads/${trimmed}`;
}
