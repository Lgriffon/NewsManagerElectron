import { app, BrowserWindow, session, ipcMain, Notification, nativeImage } from 'electron';
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = !app.isPackaged || !!process.env.VITE_DEV_SERVER_URL;

let win /** @type {BrowserWindow | null} */ = null;

function resolveIndexHtml() {

  const a = join(process.resourcesPath, "renderer/index.html");
  const b = join(process.resourcesPath, "dist-web/index.html");
  if (existsSync(a)) return a;
  if (existsSync(b)) return b;

  const c = join(__dirname, "../../web/dist/index.html");
  const d = join(__dirname, "../dist-web/index.html");
  if (existsSync(c)) return c;
  if (existsSync(d)) return d;

  return null;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.on("did-fail-load", (_e, code, desc, url) => {
    console.error("did-fail-load:", { code, desc, url });
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const html = resolveIndexHtml();
    if (!html) {
      console.error("No index.html found in renderer/ or dist-web/.");
      app.quit();
      return;
    }
    win.loadFile(html);
  }

  win.webContents.openDevTools({ mode: "detach" });
}

// ---- App lifecycle (outside createWindow) ----
app.whenReady().then(() => {
  session.defaultSession.setPreloads([]); // hard reset
  createWindow();

  ipcMain.handle('notify', (_evt, payload) => {
    if (!Notification.isSupported()) return;

    const icon = payload.iconPath
      ? nativeImage.createFromPath(payload.iconPath)
      : undefined;

    const n = new Notification({
      title: payload.title,
      body: payload.body ?? '',
      silent: payload.silent ?? false,
      icon,
    });

    n.on('click', () => {
      if (win?.isMinimized()) win.restore();
      win?.focus();
    });

    n.show();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
