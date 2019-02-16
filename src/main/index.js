'use strict'

import {app, BrowserWindow, Menu, ipcMain} from 'electron'

const version = app.getVersion()
const name = app.getName()
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender)
  Menu.popup(win)
})

let template = [{
  label: `${name} ${version}`,
  submenu: [{
    label: `关于${name}`,
    accelerator: 'CmdOrCtrl+Z'
  }, {
    type: 'separator'
  }, {
    label: '偏好设置...',
    accelerator: 'CmdOrCtrl+X'
  }, {
    type: 'separator'
  }, {
    label: `检查更新`,
    accelerator: 'CmdOrCtrl+Z'
  }, {
    label: `提供${name}反馈意见`,
    accelerator: 'CmdOrCtrl+Z'
  }, {
    type: 'separator'
  }, {
    label: '主页',
    accelerator: 'CmdOrCtrl+V'
  }, {
    label: '控制台',
    accelerator: 'CmdOrCtrl+A'
  }, {
    label: '退出',
    accelerator: 'Command+Q',
    click: () => {
      app.quit()
    }
  }]
}, {
  label: '查看',
  submenu: [{
    label: '显示状态栏',
    accelerator: 'CmdOrCtrl+V'
  }, {
    label: '隐藏工具栏',
    accelerator: 'CmdOrCtrl+A'
  }, {
    type: 'separator'
  }, {
    label: '进入全屏幕',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }]
}, {
  label: '工具',
  submenu: [{
    label: '粘贴',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: '剪切',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: '复制',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    type: 'separator'
  }, {
    label: '导入配置',
    accelerator: 'CmdOrCtrl+Shift+T'
  }, {
    label: '导出配置',
    accelerator: 'CmdOrCtrl+Shift+T'
  }]
}, {
  label: '窗口',
  role: 'window',
  submenu: [{
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: '关闭',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: '重新打开窗口',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: true,
    key: 'reopenMenuItem',
    click: () => {
      app.emit('activate')
    }
  }, {
    label: '前置全部窗口',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: true,
    key: 'reopenMenuItem',
    click: () => {
      app.emit('activate')
    }
  }]
}, {
  label: '帮助',
  role: 'help',
  submenu: [{
    label: `${name}帮助`,
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: '在线文档',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: '切换到开发者模式',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }, {
    label: `${name} ${version} 的新功能`,
    accelerator: 'CmdOrCtrl+Shift+T'
  }]
}]
