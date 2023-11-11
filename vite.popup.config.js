import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {CRX_OUTDIR} from './globalConfig'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // 输出目录
    outDir: CRX_OUTDIR,
  },
  server: {
    // 指定dev sever的端口号，默认为5173
    // port: 3000
    // 自动打开浏览器运行以下页面
    open: '/',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [vue()],
})
