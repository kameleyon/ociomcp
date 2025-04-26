/**
 * PWA Converter
 * 
 * Transforms web applications into PWAs
 * Adds service workers, manifests, and offline capabilities
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for PWAConverter
 */
export const GeneratePWASchema = z.object({
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  themeColor: z.string().default('#ffffff'),
  backgroundColor: z.string().default('#ffffff'),
  display: z.enum(['fullscreen', 'standalone', 'minimal-ui', 'browser']).default('standalone'),
  orientation: z.enum(['any', 'natural', 'landscape', 'portrait']).default('any'),
  startUrl: z.string().default('/'),
  scope: z.string().default('/'),
  dir: z.enum(['ltr', 'rtl', 'auto']).default('auto'),
  lang: z.string().default('en-US'),
  icons: z.array(z.object({
    src: z.string(),
    sizes: z.string(),
    type: z.string().optional(),
    purpose: z.enum(['any', 'maskable', 'monochrome']).optional()
  })).optional(),
  screenshots: z.array(z.object({
    src: z.string(),
    sizes: z.string(),
    type: z.string().optional()
  })).optional(),
  categories: z.array(z.string()).optional(),
  iarc_rating_id: z.string().optional(),
  related_applications: z.array(z.object({
    platform: z.string(),
    url: z.string(),
    id: z.string().optional()
  })).optional(),
  prefer_related_applications: z.boolean().default(false),
  serviceWorkerStrategy: z.enum(['network-first', 'cache-first', 'stale-while-revalidate', 'network-only', 'cache-only']).default('network-first'),
  cacheableResources: z.array(z.string()).optional(),
  offlinePage: z.string().optional(),
  installPrompt: z.boolean().default(true),
  periodicSync: z.boolean().default(false),
  pushNotifications: z.boolean().default(false),
  backgroundSync: z.boolean().default(false),
  outputDir: z.string().optional()
});

/**
 * PWA options interface
 */
interface PWAOptions {
  name: string;
  shortName?: string;
  description?: string;
  themeColor: string;
  backgroundColor: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'natural' | 'landscape' | 'portrait';
  startUrl: string;
  scope: string;
  dir: 'ltr' | 'rtl' | 'auto';
  lang: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type?: string;
    purpose?: 'any' | 'maskable' | 'monochrome';
  }>;
  screenshots?: Array<{
    src: string;
    sizes: string;
    type?: string;
  }>;
  categories?: string[];
  iarc_rating_id?: string;
  related_applications?: Array<{
    platform: string;
    url: string;
    id?: string;
  }>;
  prefer_related_applications: boolean;
  serviceWorkerStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  cacheableResources?: string[];
  offlinePage?: string;
  installPrompt: boolean;
  periodicSync: boolean;
  pushNotifications: boolean;
  backgroundSync: boolean;
  outputDir?: string;
}

/**
 * Generate PWA files
 * 
 * @param options PWA options
 * @returns Map of file paths to content
 */
function generatePWA(options: PWAOptions): Map<string, string> {
  const pwaFiles = new Map<string, string>();
  
  // Generate manifest.json
  pwaFiles.set('manifest.json', generateManifest(options));
  
  // Generate service worker
  pwaFiles.set('service-worker.js', generateServiceWorker(options));
  
  // Generate service worker registration script
  pwaFiles.set('sw-register.js', generateServiceWorkerRegistration(options));
  
  // Generate offline page if specified
  if (options.offlinePage) {
    pwaFiles.set('offline.html', generateOfflinePage(options));
  }
  
  // Generate install prompt if enabled
  if (options.installPrompt) {
    pwaFiles.set('install-prompt.js', generateInstallPrompt(options));
  }
  
  return pwaFiles;
}

/**
 * Generate manifest.json content
 * 
 * @param options PWA options
 * @returns manifest.json content
 */
function generateManifest(options: PWAOptions): string {
  const manifest: Record<string, any> = {
    name: options.name,
    short_name: options.shortName || options.name.split(' ').slice(0, 2).join(' '),
    description: options.description || `${options.name} - Progressive Web App`,
    theme_color: options.themeColor,
    background_color: options.backgroundColor,
    display: options.display,
    orientation: options.orientation,
    start_url: options.startUrl,
    scope: options.scope,
    dir: options.dir,
    lang: options.lang
  };
  
  // Add icons if provided
  if (options.icons && options.icons.length > 0) {
    manifest.icons = options.icons;
  } else {
    // Default icons
    manifest.icons = [
      {
        src: 'icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'icons/maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ];
  }
  
  // Add screenshots if provided
  if (options.screenshots && options.screenshots.length > 0) {
    manifest.screenshots = options.screenshots;
  }
  
  // Add categories if provided
  if (options.categories && options.categories.length > 0) {
    manifest.categories = options.categories;
  }
  
  // Add IARC rating ID if provided
  if (options.iarc_rating_id) {
    manifest.iarc_rating_id = options.iarc_rating_id;
  }
  
  // Add related applications if provided
  if (options.related_applications && options.related_applications.length > 0) {
    manifest.related_applications = options.related_applications;
    manifest.prefer_related_applications = options.prefer_related_applications;
  }
  
  return JSON.stringify(manifest, null, 2);
}

/**
 * Generate service worker content
 * 
 * @param options PWA options
 * @returns service-worker.js content
 */
function generateServiceWorker(options: PWAOptions): string {
  const cacheName = `${options.name.toLowerCase().replace(/\s+/g, '-')}-v1`;
  const defaultResources = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles/main.css',
    '/scripts/main.js'
  ];
  
  const cacheableResources = options.cacheableResources || defaultResources;
  
  // Add offline page to cacheable resources if specified
  if (options.offlinePage) {
    cacheableResources.push('/offline.html');
  }
  
  // Add icons to cacheable resources
  if (options.icons && options.icons.length > 0) {
    options.icons.forEach(icon => {
      cacheableResources.push(icon.src);
    });
  } else {
    cacheableResources.push('/icons/icon-192x192.png');
    cacheableResources.push('/icons/icon-512x512.png');
    cacheableResources.push('/icons/maskable-icon.png');
  }
  
  let serviceWorkerContent = `// ${options.name} Service Worker
const CACHE_NAME = '${cacheName}';
const RESOURCES_TO_CACHE = ${JSON.stringify(cacheableResources, null, 2)};

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

`;
  
  // Add fetch event handler based on strategy
  switch (options.serviceWorkerStrategy) {
    case 'cache-first':
      serviceWorkerContent += `// Fetch event - cache first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If offline and resource not in cache, show offline page
            ${options.offlinePage ? `
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }` : ''}
            
            // Return nothing for other resources
            return new Response('', {
              status: 408,
              headers: new Headers({ 'Content-Type': 'text/plain' }),
            });
          });
      })
  );
});`;
      break;
      
    case 'network-first':
      serviceWorkerContent += `// Fetch event - network first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Add to cache
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // If resource not in cache and it's a navigation request, show offline page
            ${options.offlinePage ? `
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }` : ''}
            
            // Return nothing for other resources
            return new Response('', {
              status: 408,
              headers: new Headers({ 'Content-Type': 'text/plain' }),
            });
          });
      })
  );
});`;
      break;
      
    case 'stale-while-revalidate':
      serviceWorkerContent += `// Fetch event - stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          // Update cache with fresh response
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // If network fails and it's a navigation request, show offline page
          ${options.offlinePage ? `
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }` : ''}
          
          // Return nothing for other resources
          return new Response('', {
            status: 408,
            headers: new Headers({ 'Content-Type': 'text/plain' }),
          });
        });
        
        // Return cached response immediately, or wait for network response
        return cachedResponse || fetchedResponse;
      });
    })
  );
});`;
      break;
      
    case 'network-only':
      serviceWorkerContent += `// Fetch event - network only strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // If network fails and it's a navigation request, show offline page
        ${options.offlinePage ? `
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }` : ''}
        
        // Return nothing for other resources
        return new Response('', {
          status: 408,
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      })
  );
});`;
      break;
      
    case 'cache-only':
      serviceWorkerContent += `// Fetch event - cache only strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // If resource not in cache and it's a navigation request, show offline page
        ${options.offlinePage ? `
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }` : ''}
        
        // Return nothing for other resources
        return new Response('', {
          status: 404,
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      })
  );
});`;
      break;
  }
  
  // Add background sync if enabled
  if (options.backgroundSync) {
    serviceWorkerContent += `

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data
async function syncData() {
  try {
    const dataToSync = await getDataToSync();
    
    if (dataToSync.length === 0) {
      return;
    }
    
    for (const item of dataToSync) {
      await sendToServer(item);
      await markAsSynced(item.id);
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Get data that needs to be synced
async function getDataToSync() {
  // This would typically come from IndexedDB
  return [];
}

// Send data to server
async function sendToServer(data) {
  // Implementation would depend on your API
  return fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

// Mark item as synced
async function markAsSynced(id) {
  // This would typically update IndexedDB
}`;
  }
  
  // Add push notifications if enabled
  if (options.pushNotifications) {
    serviceWorkerContent += `

// Push Notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      vibrate: data.vibrate || [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || '${options.name}', options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});`;
  }
  
  // Add periodic sync if enabled
  if (options.periodicSync) {
    serviceWorkerContent += `

// Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Function to update content
async function updateContent() {
  try {
    // Fetch fresh content
    const response = await fetch('/api/fresh-content');
    const freshContent = await response.json();
    
    // Update cache with fresh content
    const cache = await caches.open(CACHE_NAME);
    
    // Cache each fresh content item
    for (const item of freshContent) {
      const response = new Response(JSON.stringify(item), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put(\`/content/\${item.id}\`, response);
    }
    
    // Notify clients about the update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CONTENT_UPDATED',
        updatedAt: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}`;
  }
  
  return serviceWorkerContent;
}

/**
 * Generate service worker registration script
 * 
 * @param options PWA options
 * @returns sw-register.js content
 */
function generateServiceWorkerRegistration(options: PWAOptions): string {
  return `// Service Worker Registration Script
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '${options.scope}' })
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        ${options.backgroundSync ? `
        // Register for Background Sync if supported
        if ('sync' in registration) {
          document.addEventListener('offline-data-ready', () => {
            registration.sync.register('sync-data');
          });
        }` : ''}
        
        ${options.periodicSync ? `
        // Register for Periodic Sync if supported
        if ('periodicSync' in registration) {
          const registerPeriodicSync = async () => {
            try {
              // Check permission
              const status = await navigator.permissions.query({
                name: 'periodic-background-sync'
              });
              
              if (status.state === 'granted') {
                // Register periodic sync
                await registration.periodicSync.register('update-content', {
                  minInterval: 24 * 60 * 60 * 1000 // Once per day
                });
                console.log('Periodic Sync registered');
              }
            } catch (error) {
              console.error('Periodic Sync error:', error);
            }
          };
          
          registerPeriodicSync();
        }` : ''}
        
        ${options.pushNotifications ? `
        // Register for Push Notifications if supported
        if ('pushManager' in registration) {
          const subscribeToPush = async () => {
            try {
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  'YOUR_PUBLIC_VAPID_KEY_HERE' // Replace with your VAPID public key
                )
              });
              
              // Send subscription to server
              await fetch('/api/push-subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
              });
              
              console.log('Push subscription successful');
            } catch (error) {
              console.error('Push subscription error:', error);
            }
          };
          
          // Function to convert base64 to Uint8Array for VAPID key
          function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
              .replace(/-/g, '+')
              .replace(/_/g, '/');
            
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            
            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            
            return outputArray;
          }
          
          // Ask for notification permission and subscribe
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                subscribeToPush();
              }
            });
          }
        }` : ''}
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}`;
}

/**
 * Generate offline page content
 * 
 * @param options PWA options
 * @returns offline.html content
 */
function generateOfflinePage(options: PWAOptions): string {
  return `<!DOCTYPE html>
<html lang="${options.lang}" dir="${options.dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="${options.themeColor}">
  <title>Offline - ${options.name}</title>
  <link rel="manifest" href="/manifest.json">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      background-color: ${options.backgroundColor};
      color: #333;
    }
    
    .container {
      padding: 2rem;
      max-width: 600px;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    
    .icon {
      font-size: 4rem;
      margin-bottom: 2rem;
    }
    
    .retry-button {
      background-color: ${options.themeColor};
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .retry-button:hover {
      background-color: ${darkenColor(options.themeColor, 10)};
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <!-- Wi-Fi Off Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
    </div>
    <h1>You're Offline</h1>
    <p>It looks like you've lost your internet connection. Please check your connection and try again.</p>
    <button class="retry-button" onclick="window.location.reload()">Try Again</button>
  </div>
  
  <script>
    // Check if we're back online
    window.addEventListener('online', () => {
      window.location.reload();
    });
  </script>
</body>
</html>`;
}

/**
 * Generate install prompt script
 * 
 * @param options PWA options
 * @returns install-prompt.js content
 */
function generateInstallPrompt(options: PWAOptions): string {
  return `// PWA Install Prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

// Hide the install button initially
if (installButton) {
  installButton.style.display = 'none';
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button
  if (installButton) {
    installButton.style.display = 'block';
    
    // Add click handler for the install button
    installButton.addEventListener('click', () => {
      // Hide the install button
      installButton.style.display = 'none';
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt
        deferredPrompt = null;
      });
    });
  }
});

// Listen for the appinstalled event
window.addEventListener('appinstalled', (e) => {
  console.log('App was installed');
  
  // Hide the install button
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // You could also show a success message or trigger analytics
});

// Function to create an install button if it doesn't exist
function createInstallButton() {
  if (!document.getElementById('install-button') && deferredPrompt) {
    const button = document.createElement('button');
    button.id = 'install-button';
    button.textContent = 'Install ${options.name}';
    button.className = 'pwa-install-button';
    
    // Style the button
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '${options.themeColor}';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.fontWeight = 'bold';
    button.style.zIndex = '9999';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    // Add click handler
    button.addEventListener('click', () => {
      // Hide the button
      button.style.display = 'none';
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
          // Show the button again if the user dismissed the prompt
          button.style.display = 'block';
        }
        
        // Clear the saved prompt
        deferredPrompt = null;
      });
    });
    
    // Add the button to the document
    document.body.appendChild(button);
  }
}

// Create the install button when the page loads
window.addEventListener('load', createInstallButton);`;
}

/**
 * Darken a color by a percentage
 * 
 * @param color Hex color
 * @param percent Percentage to darken
 * @returns Darkened hex color
 */
function darkenColor(color: string, percent: number): string {
  // Remove the # if present
  color = color.replace('#', '');
  
  // Parse the hex color
  const num = parseInt(color, 16);
  
  // Extract the RGB components
  let r = (num >> 16);
  let g = ((num >> 8) & 0x00FF);
  let b = (num & 0x0000FF);
  
  // Darken each component
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));
  
  // Ensure values are in valid range
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  // Convert back to hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}