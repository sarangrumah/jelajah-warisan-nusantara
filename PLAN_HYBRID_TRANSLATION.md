# Hybrid Auto-Translation System Plan

## Objective
Implement a translation feature that dynamically translates all content (API feedback, hardcoded text, placeholders) using a local LibreTranslate instance (port 5000). The system must be efficient, on-demand (triggered by user interaction), and persistent across navigation.

## Core Architecture: "Hybrid" Approach
We will combine the existing `i18n` (static JSON files) with a new **Dynamic Auto-Translation Layer**.

1.  **Static Layer (Existing)**: fast, instant load for common UI elements (Navigation, Footer, Buttons).
2.  **Dynamic Layer (New)**: Auto-translates any text not found in static files or hardcoded in components.

## 1. Backend Strategy (Optimized & Cached)
The backend infrastructure is largely in place but needs verification and tuning.

*   **Service**: `OptimizedContentTranslationService` (Existing).
    *   *Features*: Batch processing, Memory Cache (LRU), Database Cache (Postgres).
*   **Endpoint**: `POST /api/translate-optimized/batch`
    *   Accepts: `{ texts: string[], source: 'id', target: 'en' }`
    *   Returns: `{ translations: string[] }`
*   **Optimization**:
    *   Ensure `content_translation_cache` table is indexed.
    *   **Action**: Verify database schema and indexes.

## 2. Frontend Strategy (The "Auto-Translate" Engine)
This is the core of the solution to handle "Hardcoded text" and "Placeholders" without rewriting every component manually.

### A. `AutoTranslationProvider` (Context)
A global provider that manages:
*   `currentLanguage`: (e.g., 'id', 'en', 'jp').
*   `translationCache`: A client-side Map storing `originalText -> translatedText`.
*   `isTranslating`: Loading state.

### B. "Smart" Text Handling
To translate hardcoded text without manual refactoring, we have two options. I recommend **Option 1** for stability and **Option 2** for "magic" (but higher risk).

**Option 1: The `<T>` Component (Recommended)**
We create a lightweight wrapper component.
*   *Usage*: `<T>Selamat Datang</T>` or `<T>Hardcoded Text</T>`
*   *Behavior*:
    *   If `lang === 'id'`: Renders children as is.
    *   If `lang !== 'id'`: Checks cache. If found, renders translation. If not, registers text for batch translation.

**Option 2: DOM Traversal (The "Browser Extension" Style)**
*   *Behavior*: A `MutationObserver` watches the DOM. When text nodes appear, if they are in Bahasa and the mode is English, it sends them to the API.
*   *Pros*: No code changes needed in components.
*   *Cons*: Can cause "flash of original content", potential conflicts with React hydration, performance overhead.

**Decision**: We will use a **Hybrid Frontend Strategy**:
1.  **Global Hook `useAutoTranslation()`**: Scans the current view for registered text.
2.  **Utility Function `t_dynamic(text)`**: A wrapper around `i18next.t` that falls back to the API if the key is missing or if the input is a raw string.
3.  **API Interceptor**: Middleware to intercept Axios/Fetch responses. If the response contains `message` or `error` fields in Bahasa, translate them before passing to the UI.

## 3. Implementation Steps

### Step 1: Backend Verification
*   [ ] Ensure `LibreTranslate` is reachable on port 5000.
*   [ ] Verify `content_translation_cache` table exists and is writable.
*   [ ] Test the `/batch` endpoint with a sample payload.

### Step 2: Frontend "Translation Engine"
*   [ ] Create `src/contexts/AutoTranslationContext.tsx`.
    *   Manages queueing strings for translation.
    *   Debounces requests (e.g., waits 100ms to collect all strings in a render cycle before sending one batch request).
    *   Persists translations to `localStorage` to avoid re-fetching on reload.

### Step 3: Component Integration
*   [ ] Create a `<Translate>` (or `<Tx>`) wrapper component for hardcoded text.
    *   Example: `<Tx>Ini teks hardcoded</Tx>`
*   [ ] Create a hook `useTranslateText()` for attributes/placeholders.
    *   Example: `<input placeholder={translate("Masukkan nama")} />`

### Step 4: API Feedback Translation
*   [ ] Create an Axios/Fetch interceptor.
*   [ ] When an API error occurs (e.g., 400 Bad Request), extract the message.
*   [ ] Send message to `translate-optimized` endpoint.
*   [ ] Display translated message in Toast/Alert.

### Step 5: Page-Level Integration
*   [ ] Update `App.tsx` to wrap the application in `AutoTranslationProvider`.
*   [ ] Ensure language switcher toggles the context state.

## Workflow Example
1.  User lands on Home (ID). No translation needed.
2.  User switches to English (EN).
3.  `AutoTranslationContext` detects change.
4.  Components using `<Tx>` or `useTranslateText` register their content ("Selamat Pagi", "Berita Terkini").
5.  Context debounces and sends batch: `["Selamat Pagi", "Berita Terkini"]` to Backend.
6.  Backend checks DB -> Cache Miss -> Calls LibreTranslate :5000 -> Saves to DB -> Returns `["Good Morning", "Latest News"]`.
7.  Frontend updates cache and re-renders components with English text.
8.  User navigates to "About Us".
9.  Components register new text. Context checks local cache (miss) -> sends batch -> updates UI.

## Performance Considerations
*   **Debouncing**: Crucial to prevent 100 API calls for 100 text elements. Group them into 1 call.
*   **Local Caching**: `localStorage` or `IndexedDB` on client side is essential so navigating back doesn't re-translate.
*   **Backend Caching**: Postgres ensures that if User A translates "Hello", User B gets the cached result instantly.
