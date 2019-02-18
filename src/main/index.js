'use strict'
const electron = require('electron')
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  MenuItem
} = electron
const version = app.getVersion()
const name = app.getName()
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// 更具平台环境设置菜单模板
let template = [{
  label: '文件',
  submenu: [{label: '新建链接', accelerator: 'CmdOrCtrl+V'},
    {type: 'separator'},
    {label: '导入配置', accelerator: 'CmdOrCtrl+Shift+T'},
    {label: '导出配置', accelerator: 'CmdOrCtrl+Shift+T'}]
}, {
  label: '查看',
  submenu: [{label: '显示状态栏', accelerator: 'CmdOrCtrl+V'},
    {label: '隐藏工具栏', accelerator: 'CmdOrCtrl+A'},
    {type: 'separator'},
    {
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
  submenu: [{label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste'},
    {label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut'},
    {label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy'}]
}, {
  label: '窗口',
  role: 'window',
  submenu: [{label: '最小化', accelerator: 'CmdOrCtrl+M', role: 'minimize'},
    {label: '关闭', accelerator: 'CmdOrCtrl+W', role: 'close'},
    {type: 'separator'},
    {
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
  submenu: [{label: `${name}帮助`, accelerator: 'CmdOrCtrl+M', role: 'minimize'},
    {label: '在线文档', accelerator: 'CmdOrCtrl+W', role: 'close'},
    {type: 'separator'},
    {
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

// mac平台
if (process.platform === 'darwin') {
  template.unshift({
    label: name,
    submenu: [{label: `关于 ${name}`, role: 'about'},
      {label: `提供${name}反馈意见`, accelerator: 'CmdOrCtrl+Z'},
      {type: 'separator'},
      {label: '偏好设置...', accelerator: 'CmdOrCtrl+X'},
      {type: 'separator'},
      {label: '服务', role: 'services', submenu: []},
      {type: 'separator'},
      {label: `隐藏 ${name}`, accelerator: 'Command+H', role: 'hide'},
      {label: '隐藏其它', accelerator: 'Command+Alt+H', role: 'hideothers'},
      {label: '显示全部', role: 'unhide'},
      {type: 'separator'},
      {
        label: '退出',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }]
  })
  // mac前置所有菜单
  template[3].submenu.push({type: 'separator'}, {label: '前置所有', role: 'front'})
  // 更新按钮菜单
  addUpdateMenuItems(template[0].submenu, 1)
}

// win平台
if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 2)
}

// 处理更新菜单
function addUpdateMenuItems (items, position) {
  if (process.mas) return
  let updateItems = [{label: '正在检查更新', enabled: false, visible: true, key: 'checkingForUpdate'},
    {
      label: '检查更新',
      visible: false,
      key: 'checkForUpdate',
      click: () => {
        checkUpdate()
      }
    },
    {
      label: '重启并安装更新',
      visible: false,
      key: 'restartToUpdate',
      click: () => {
        installApp()
      }
    }]
  items.splice.apply(items, [position, 0].concat(updateItems))
}

// 窗口事件
let mainWindow
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.on('ready', () => {
  createWindow()
})
// 处理app更新
app.on('will-finish-launching', () => {
  checkUpdate()
})

// 处理应用程序更新
function checkUpdate () {
  require('electron').autoUpdater.checkForUpdates()
  let checkingForUpdate = findReopenMenuItem('checkingForUpdate')
  if (checkingForUpdate) {
    checkingForUpdate.visible = false
  }
  let checkForUpdate = findReopenMenuItem('checkForUpdate')
  if (checkForUpdate) {
    checkForUpdate.visible = true
  }
}

// 安装应用
function installApp () {
  require('electron').autoUpdater.quitAndInstall()
}

// 初始化窗口
function createWindow () {
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden'})
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('window-all-closed', () => {
  let reopenMenuItem = findReopenMenuItem('reopenMenuItem')
  if (reopenMenuItem) reopenMenuItem.enabled = true
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 查找某个item
function findReopenMenuItem (key) {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(item => {
    if (item.submenu) {
      item.submenu.items.forEach(item => {
        if (item.key === key) {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup(win, params.x, params.y)
  })
})

// 创建弹出菜单
const menu = new Menu()
menu.append(new MenuItem({label: 'Hello'}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: 'Electron', type: 'checkbox', checked: true}))

ipcMain.on('show-context-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

ipcMain.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender)
  Menu.popup(win)
})
