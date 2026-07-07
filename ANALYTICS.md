# 作品集访问统计说明

这个项目已经加入轻量统计：

- 访问量：`page_view`
- 访客 IP：由服务端接口读取请求头
- 作品点击：点击作品卡片时记录 `project_click`
- 停留时间：离开页面、关闭页面和心跳事件记录时长
- 看板入口：`/#analytics`

## 本地运行

开两个终端。

第一个终端启动统计接口：

```bash
cd /Users/lee/Documents/作品集
ANALYTICS_ADMIN_KEY=你的管理密码 npm run analytics:dev
```

第二个终端启动网站：

```bash
cd /Users/lee/Documents/作品集
npm run dev
```

打开：

```text
http://127.0.0.1:5173/#analytics
```

输入你设置的 `ANALYTICS_ADMIN_KEY` 即可看数据。

## 部署到 xx-designer.top

这个网站如果只部署为静态网页，浏览器无法自己保存所有访客的数据，也无法可靠获取访客 IP。

推荐部署方式：

1. 在服务器上运行 `server/analytics-server.js`
2. 设置环境变量：
   - `ANALYTICS_ADMIN_KEY`：看板管理密钥
   - `ALLOWED_ORIGIN=https://xx-designer.top`
   - `ANALYTICS_DATA_FILE=/你的服务器路径/events.jsonl`
3. 用 Nginx 或宝塔把 `https://xx-designer.top/api/analytics` 反向代理到 `http://127.0.0.1:8787/api/analytics`
4. 重新部署前端

## 隐私提醒

IP 地址属于个人信息。正式上线前，建议在网站底部或隐私说明中告知用户网站会采集访问统计数据。
