# Backend Hot Reload - Fixed!

## ✅ What Was Fixed

The backend hot reload wasn't working because nodemon needs **legacy watch mode** for Docker on Windows/Mac.

### Changes Made:

1. **Created `nodemon.json`** with proper Docker configuration:

    ```json
    {
        "watch": ["src"],
        "ext": "ts,json",
        "ignore": ["src/**/*.test.ts"],
        "exec": "ts-node src/index.ts",
        "legacyWatch": true // <-- This is the key!
    }
    ```

2. **Updated `package.json`** dev script to simply use `nodemon` (reads config from nodemon.json)

3. **Restarted backend container** to apply changes

---

## How It Works Now

-   **legacyWatch: true** enables polling mode (like Vite's usePolling)
-   Nodemon will now detect file changes in Docker
-   Server automatically restarts when you edit `.ts` files in `src/`

---

## Test It!

1. Edit `backend/src/routes/calculation.routes.ts` (you already added `console.log('test')`)
2. Save the file
3. Watch the logs:
    ```bash
    docker-compose logs -f backend
    ```
4. You should see:
    ```
    [nodemon] restarting due to changes...
    [nodemon] starting `ts-node src/index.ts`
    Server is running on port 3000
    ```

---

## Why It Wasn't Working Before

-   Docker on Windows/Mac uses a VM
-   Native file watching (inotify) doesn't work across the VM boundary
-   **legacyWatch** uses polling instead, which works in Docker
-   Same reason Vite needs `usePolling: true`

---

## Both Services Now Have Hot Reload! 🔥

-   ✅ **Backend**: Nodemon with legacyWatch
-   ✅ **Frontend**: Vite with usePolling

Edit any file and see changes instantly!
