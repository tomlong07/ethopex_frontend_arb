// vite.config.ts
import {
  defineConfig,
  loadEnv,
} from 'file:///D:/CODE/bitbucket/PP-AFF/sf-dashboard/node_modules/vite/dist/node/index.js'
import vue from 'file:///D:/CODE/bitbucket/PP-AFF/sf-dashboard/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import tsconfigPaths from 'file:///D:/CODE/bitbucket/PP-AFF/sf-dashboard/node_modules/vite-tsconfig-paths/dist/index.mjs'
var vite_config_default = ({ mode }) => {
  const modeDefault = ['development']
  if (!modeDefault.includes(mode)) {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  }
  return defineConfig({
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('arb'),
          },
        },
      }),
      tsconfigPaths({
        loose: true,
      }),
    ],
    server: {
      port: 4e3,
      cors: true,
    },
    define: {
      'import.meta.env.BUILDTIME': JSON.stringify(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }) +
          ' GMT+7'
      ),
    },
  })
}
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDT0RFXFxcXGJpdGJ1Y2tldFxcXFxQUC1BRkZcXFxcc2YtZGFzaGJvYXJkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxDT0RFXFxcXGJpdGJ1Y2tldFxcXFxQUC1BRkZcXFxcc2YtZGFzaGJvYXJkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9DT0RFL2JpdGJ1Y2tldC9QUC1BRkYvc2YtZGFzaGJvYXJkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBtb2RlRGVmYXVsdCA9IFsnZGV2ZWxvcG1lbnQnXTtcclxuXHJcbiAgaWYgKCFtb2RlRGVmYXVsdC5pbmNsdWRlcyhtb2RlKSkge1xyXG4gICAgLy8gTG9hZCBhcHAtbGV2ZWwgZW52IHZhcnMgdG8gbm9kZS1sZXZlbCBlbnYgdmFycy5cclxuICAgIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSB9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSh7XHJcbiAgICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAvLyB0cmVhdCBhbGwgdGFncyB3aXRoIGEgZGFzaCBhcyBjdXN0b20gZWxlbWVudHNcclxuICAgICAgICAgICAgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuaW5jbHVkZXMoJ2FyYicpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgdHNjb25maWdQYXRocyh7XHJcbiAgICAgICAgbG9vc2U6IHRydWUsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA0MDAwLFxyXG4gICAgICBjb3JzOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LkJVSUxEVElNRSc6IEpTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgIG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoJ2VuLVVTJywgeyB0aW1lWm9uZTogJ0FzaWEvSmFrYXJ0YScgfSkgK1xyXG4gICAgICAgICAgJyBHTVQrNydcclxuICAgICAgKSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlMsU0FBUyxjQUFjLGVBQWU7QUFDalYsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixRQUFNLGNBQWMsQ0FBQyxhQUFhO0FBRWxDLE1BQUksQ0FBQyxZQUFZLFNBQVMsSUFBSSxHQUFHO0FBRS9CLFlBQVEsTUFBTSxFQUFFLEdBQUcsUUFBUSxLQUFLLEdBQUcsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUU7QUFBQSxFQUNsRTtBQUVBLFNBQU8sYUFBYTtBQUFBLElBQ2xCLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxRQUNGLFVBQVU7QUFBQSxVQUNSLGlCQUFpQjtBQUFBLFlBRWYsaUJBQWlCLENBQUMsUUFBUSxJQUFJLFNBQVMsS0FBSztBQUFBLFVBQzlDO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsY0FBYztBQUFBLFFBQ1osT0FBTztBQUFBLE1BQ1QsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTiw2QkFBNkIsS0FBSztBQUFBLFFBQ2hDLElBQUksS0FBSyxFQUFFLGVBQWUsU0FBUyxFQUFFLFVBQVUsZUFBZSxDQUFDLElBQzdEO0FBQUEsTUFDSjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
