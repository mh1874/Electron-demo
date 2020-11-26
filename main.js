// 主进程
/** 
 * app，用于控制应用生命周期。本次只用到了ready状态，用于在应用就绪后开始业务
 * BrowserWindow 用于创建和控制窗口
 * Notification 创建 Notification
 * ipcMain 跟 ipcRenderer进行IPC通信的 
 * ipcMain.handle(channel,handler) 处理渲染进程的channel请求，在handler中return返回结果
*/
const {app, BrowserWindow, ipcMain, Notification} = require('electron')
let mainWindow;
function handleIPC() {
    ipcMain.handle('notification', async (e, {body, title, actions, closeButtonText}) => {
        let res = await new Promise((resolve, reject) => {
            console.log({
                title,
                body,
                actions,
                closeButtonText
            })
            let notification = new Notification({
                title,
                body,
                actions,
                closeButtonText
            })
            notification.show()
            notification.on('action', function(event) {
                resolve({event: 'action'})
            })
            notification.on('close', function(event) {
                resolve({event: 'close'})
            })
        })
        return res
    })
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 250,
        height: 350,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadFile('./index.html')

    return mainWindow
}

app.whenReady().then(() => {
    handleIPC()
    createMainWindow()
})
