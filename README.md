# CICD-Practice 技术博客

这是一个专注于CI/CD实践、DevOps技术和现代软件开发流程的技术博客项目，使用Hexo静态网站生成器构建并部署至GitHub Pages。

## 站点信息

- **站点名称**：老丶黄的个人博客
- **站点地址**：[https://nathanhex.github.io/CICD-Practice](https://nathanhex.github.io/CICD-Practice)
- **作者**：老黄
- **主题**：Butterfly

## 博客内容概览

本博客主要涵盖以下技术领域：
- CI/CD 实践（持续集成、持续部署）
- Jenkins 自动化工具
- Kubernetes 容器编排
- DevOps 工程实践
- Java 开发技术
- 人工智能编程（AI编程、语音识别、文本转语音等）
- 容器镜像仓库（Nexus）

### 主要文章列表

- [基于jenkins+kubernetes的持续集成流水线搭建](https://nathanhex.github.io/CICD-Practice/)
- [面向ai编程](https://nathanhex.github.io/CICD-Practice/)
- [ChatGPT演示应用](https://nathanhex.github.io/CICD-Practice/)
- [Microsoft TTS服务应用](https://nathanhex.github.io/CICD-Practice/)
- [Nexus仓库安装指南](https://nathanhex.github.io/CICD-Practice/)
- [语音识别技术(STT)](https://nathanhex.github.io/CICD-Practice/)
- Claude Code系列教程

## 技术栈

- **静态网站生成器**：[Hexo](https://hexo.io/)
- **主题**：[Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)
- **部署方式**：GitHub Pages
- **代码高亮**：支持多种语言的语法高亮
- **响应式设计**：适配移动端和桌面端访问

## 快速开始

### 环境准备

确保已安装 Node.js 和 npm，然后安装 Hexo CLI：

```bash
npm install -g hexo-cli
```

### 安装依赖

克隆项目后，在项目根目录执行：

```bash
npm install
```

### 本地开发

启动本地开发服务器：

```bash
npm run server
```

然后在浏览器中访问 `http://localhost:4000` 查看博客。

### 构建站点

生成静态文件到 `docs/` 目录：

```bash
npm run build
```

### 清理缓存

清理缓存文件和临时文件：

```bash
npm run clean
```

## 项目结构

```
├── _config.yml               # Hexo 主配置文件
├── _config.butterfly.yml     # Butterfly 主题配置文件
├── package.json             # 项目依赖配置
├── source/                  # 源文件目录
│   ├── _posts/              # 博客文章
│   ├── images/              # 图片资源
│   └── ...                  # 其他源文件
├── themes/                  # 主题目录
├── scaffolds/               # 文章模板
├── docs/                    # 生成的静态网站（用于GitHub Pages部署）
└── README.md               # 项目说明
```

## 创建新文章

使用 Hexo 命令创建新文章：

```bash
hexo new "文章标题"
```

文章将创建在 `source/_posts/` 目录下，使用 Markdown 格式编写。

## Mermaid 图表支持

本博客支持在文章中使用 Mermaid 图表语法。您可以在 Markdown 文件中使用 ```mermaid 代码块来创建图表：

```markdown
\```mermaid
graph TD;
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
\```
```

支持的图表类型包括：
- 流程图 (Flowchart)
- 时序图 (Sequence diagram)
- 甘特图 (Gantt diagram)
- 类图 (Class diagram)
- 状态图 (State diagram)
- Pie 图 (Pie chart)
- 以及其他 Mermaid 支持的图表类型

## 部署

按照 `_config.yml` 中的部署配置进行部署：

```bash
npm run deploy
```

## 特性

- ✅ 支持 Markdown 格式的博客写作
- ✅ 代码语法高亮
- ✅ Mermaid 图表支持（流程图、时序图、甘特图等）
- ✅ 响应式设计
- ✅ 多语言支持（中文、英文）
- ✅ 分类和标签系统
- ✅ 归档功能
- ✅ 搜索功能
- ✅ 社交分享功能

## 关键字

java, cicd, 持续交付, devops, jenkins, kubernetes, docker, ci/cd pipeline, 自动化部署, 持续集成

## 许可证

本项目遵循项目中指定的许可证协议。