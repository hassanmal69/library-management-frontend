import { app, BrowserWindow } from "electron";
import path from "path";
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700
  });

  win.loadFile(
    path.join(app.getAppPath(), "dist-react", "index.html")
  );
});