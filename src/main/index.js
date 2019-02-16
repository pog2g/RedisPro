'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  MenuItem,
  dialog
} from 'electron'

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
app.on('window-all-closed', () => {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = true
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

function addUpdateMenuItems (items, position) {
  if (process.mas) return
  let updateItems = [{
    label: '正在检查更新',
    enabled: false,
    key: 'checkingForUpdate'
  }, {
    label: '检查更新',
    visible: false,
    key: 'checkForUpdate',
    click: () => {
      require('electron').autoUpdater.checkForUpdates()
    }
  }, {
    label: '重启并安装更新',
    enabled: true,
    visible: false,
    key: 'restartToUpdate',
    click: () => {
      require('electron').autoUpdater.quitAndInstall()
    }
  }]

  items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(item => {
    if (item.submenu) {
      item.submenu.items.forEach(item => {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

let template = [{
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
  }, {
    label: '应用程序菜单演示',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        const options = {
          type: 'info',
          title: '应用程序菜单演示',
          buttons: ['好的'],
          message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
        }
        dialog.showMessageBox(focusedWindow, options, function () {
        })
      }
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

// 更具平台加载菜单(mac平台)
if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `关于 ${name}`,
      role: 'about'
    }, {
      label: `提供${name}反馈意见`,
      accelerator: 'CmdOrCtrl+Z'
    }, {
      type: 'separator'
    }, {
      label: '偏好设置...',
      accelerator: 'CmdOrCtrl+X'
    }, {
      type: 'separator'
    }, {
      label: '服务',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `隐藏 ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: '隐藏其它',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: '显示全部',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: '退出',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    }]
  })

  // 窗口菜单.
  template[3].submenu.push({
    type: 'separator'
  }, {
    label: '前置所有',
    role: 'front'
  })

  addUpdateMenuItems(template[0].submenu, 1)
}

// 更具平台加载菜单(win平台)
if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}

// 创建弹出菜单
const menu = new Menu()
menu.append(new MenuItem({label: 'Hello'}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: 'Electron', type: 'checkbox', checked: true}))

app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup(win, params.x, params.y)
  })
})

ipcMain.on('show-context-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})
