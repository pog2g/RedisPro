import {Menu} from 'electron'

// 查找某个item
export function findReopenMenuItem (key) {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem = null
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
