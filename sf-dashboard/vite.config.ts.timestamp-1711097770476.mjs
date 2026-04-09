// vite.config.ts
import {
  defineConfig,
  loadEnv,
} from 'file:///D:/CODE/bitbucket/PP-AFF/sf-dashboard/node_modules/vite/dist/node/index.js'
import vue from 'file:///D:/CODE/bitbucket/PP-AFF/sf-dashboard/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import tsconfigPaths from 'file:///D:/CODE/bitbucket/PP-AFF/sf-dashboard/node_modules/vite-tsconfig-paths/dist/index.mjs'
function rawHtmlPlugin() {
  return {
    name: 'raw-html-plugin',
    transform(code, id) {
      if (id.endsWith('.html')) {
        return `export default ${JSON.stringify(code)}`
      }
    },
  }
}
var vite_config_default = ({ mode }) => {
  const modeDefault = ['development']
  if (!modeDefault.includes(mode)) {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  }
  return defineConfig({
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.html'],
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('arb'),
          },
        },
      }),
      rawHtmlPlugin(),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDT0RFXFxcXGJpdGJ1Y2tldFxcXFxQUC1BRkZcXFxcc2YtZGFzaGJvYXJkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxDT0RFXFxcXGJpdGJ1Y2tldFxcXFxQUC1BRkZcXFxcc2YtZGFzaGJvYXJkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9DT0RFL2JpdGJ1Y2tldC9QUC1BRkYvc2YtZGFzaGJvYXJkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuZnVuY3Rpb24gcmF3SHRtbFBsdWdpbigpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAncmF3LWh0bWwtcGx1Z2luJyxcclxuICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xyXG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJy5odG1sJykpIHtcclxuICAgICAgICByZXR1cm4gYGV4cG9ydCBkZWZhdWx0ICR7SlNPTi5zdHJpbmdpZnkoY29kZSl9YDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBtb2RlRGVmYXVsdCA9IFsnZGV2ZWxvcG1lbnQnXTtcclxuXHJcbiAgaWYgKCFtb2RlRGVmYXVsdC5pbmNsdWRlcyhtb2RlKSkge1xyXG4gICAgLy8gTG9hZCBhcHAtbGV2ZWwgZW52IHZhcnMgdG8gbm9kZS1sZXZlbCBlbnYgdmFycy5cclxuICAgIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSB9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIC8vIFJlZ2lzdGVyIHRoZSAuaHRtbCBleHRlbnNpb24gdG8gdXNlIHJhdy1sb2FkZXJcclxuICAgICAgZXh0ZW5zaW9uczogWycuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsICcuaHRtbCddLFxyXG4gICAgfSxcclxuICAgIC8vIEFkZCByYXctbG9hZGVyIGFzIGEgVml0ZSB0cmFuc2Zvcm1cclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKHtcclxuICAgICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIC8vIHRyZWF0IGFsbCB0YWdzIHdpdGggYSBkYXNoIGFzIGN1c3RvbSBlbGVtZW50c1xyXG4gICAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQ6ICh0YWcpID0+IHRhZy5pbmNsdWRlcygnYXJiJyksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICByYXdIdG1sUGx1Z2luKCksXHJcbiAgICAgIHRzY29uZmlnUGF0aHMoe1xyXG4gICAgICAgIGxvb3NlOiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogNDAwMCxcclxuICAgICAgY29yczogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5CVUlMRFRJTUUnOiBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHsgdGltZVpvbmU6ICdBc2lhL0pha2FydGEnIH0pICtcclxuICAgICAgICAgICcgR01UKzcnXHJcbiAgICAgICksXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJTLFNBQVMsY0FBYyxlQUFlO0FBQ2pWLE9BQU8sU0FBUztBQUNoQixPQUFPLG1CQUFtQjtBQUcxQixTQUFTLGdCQUF3QjtBQUMvQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVLE1BQU0sSUFBSTtBQUNsQixVQUFJLEdBQUcsU0FBUyxPQUFPLEdBQUc7QUFDeEIsZUFBTyxrQkFBa0IsS0FBSyxVQUFVLElBQUk7QUFBQSxNQUM5QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDM0IsUUFBTSxjQUFjLENBQUMsYUFBYTtBQUVsQyxNQUFJLENBQUMsWUFBWSxTQUFTLElBQUksR0FBRztBQUUvQixZQUFRLE1BQU0sRUFBRSxHQUFHLFFBQVEsS0FBSyxHQUFHLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQyxFQUFFO0FBQUEsRUFDbEU7QUFFQSxTQUFPLGFBQWE7QUFBQSxJQUNsQixTQUFTO0FBQUEsTUFFUCxZQUFZLENBQUMsT0FBTyxPQUFPLFFBQVEsUUFBUSxTQUFTLE9BQU87QUFBQSxJQUM3RDtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLFFBQ0YsVUFBVTtBQUFBLFVBQ1IsaUJBQWlCO0FBQUEsWUFFZixpQkFBaUIsQ0FBQyxRQUFRLElBQUksU0FBUyxLQUFLO0FBQUEsVUFDOUM7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxjQUFjO0FBQUEsTUFDZCxjQUFjO0FBQUEsUUFDWixPQUFPO0FBQUEsTUFDVCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLDZCQUE2QixLQUFLO0FBQUEsUUFDaEMsSUFBSSxLQUFLLEVBQUUsZUFBZSxTQUFTLEVBQUUsVUFBVSxlQUFlLENBQUMsSUFDN0Q7QUFBQSxNQUNKO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
