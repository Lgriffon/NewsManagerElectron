export interface PlatformAPI {
  pickFile: () => Promise<string[]>
  notify: (title: string, body: string) => Promise<void>
}

let api: PlatformAPI

if ((window as any).api) {
  // Electron
  api = {
    pickFile: () => (window as any).api.invoke('open-file-dialog'),
    notify: (title, body) => (window as any).api.invoke('show-notification', { title, body })
  }
} else {
  // Capacitor
  api = {
    pickFile: async () => [], // implement later with a plugin if needed
    notify: async (title, body) => {
      const { Toast } = await import('@capacitor/toast')
      await Toast.show({ text: `${title}: ${body}` })
    }
  }
}

export default api
