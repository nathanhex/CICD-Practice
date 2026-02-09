---
title: Claude Code MCP：Model Context Protocol
categories:
  - [AI,Claude Code]
tags:
  - claude-code
  - AI编程
date: 2026-02-05 01:00:00
permalink: claude-code-guide/07-mcp/
---

# MCP：Model Context Protocol

> MCP（Model Context Protocol）是连接 Claude Code 与外部世界的标准协议，让你能够无限扩展 Claude 的能力边界。

## 目录

1. [什么是 MCP](#1-什么是-mcp)
2. [核心概念](#2-核心概念)
3. [MCP 服务器类型](#3-mcp-服务器类型)
4. [配置与安装](#4-配置与安装)
5. [常用 MCP 服务器](#5-常用-mcp-服务器)
6. [开发自定义 MCP 服务器](#6-开发自定义-mcp-服务器)
7. [实战案例](#7-实战案例)
8. [最佳实践](#8-最佳实践)
9. [常见问题](#9-常见问题)

---

## 1. 什么是 MCP

### 1.1 定义

MCP（Model Context Protocol）是 Anthropic 开发的 **开放协议**，用于标准化 AI 模型与外部工具/数据源之间的通信。

### 1.2 为什么需要 MCP

| 问题 | 无 MCP | 有 MCP |
|------|--------|--------|
| 工具集成 | 每个工具单独开发集成 | 统一协议，即插即用 |
| 跨平台 | 每个平台重复开发 | 一次开发，多平台使用 |
| 数据访问 | 硬编码数据源 | 动态发现和连接 |
| 安全性 | 各自实现 | 协议层统一安全机制 |

### 1.3 MCP 生态系统

```mermaid
graph TB
    subgraph "AI 应用"
        CC[Claude Code]
        CD[Claude Desktop]
        Other[其他 AI 工具]
    end
    
    subgraph "MCP 协议层"
        Protocol[MCP Protocol]
    end
    
    subgraph "MCP 服务器"
        GitHub[GitHub Server]
        DB[Database Server]
        Slack[Slack Server]
        Custom[自定义 Server]
    end
    
    subgraph "外部服务"
        GitHubAPI[GitHub API]
        PostgreSQL[PostgreSQL]
        SlackAPI[Slack API]
        CustomAPI[自定义 API]
    end
    
    CC & CD & Other <-->|MCP| Protocol
    Protocol <--> GitHub & DB & Slack & Custom
    GitHub <--> GitHubAPI
    DB <--> PostgreSQL
    Slack <--> SlackAPI
    Custom <--> CustomAPI
```

---

## 2. 核心概念

### 2.1 三大核心组件

```mermaid
graph LR
    subgraph "MCP 服务器提供"
        T[Tools<br/>工具]
        R[Resources<br/>资源]
        P[Prompts<br/>提示]
    end
    
    T --> |可调用的函数| Example1[create_issue<br/>search_code]
    R --> |可读取的数据| Example2[file://config<br/>db://users]
    P --> |预定义的指令| Example3[code-review<br/>summarize]
```

### 2.2 Tools（工具）

工具是 MCP 服务器暴露的 **可调用函数**：

```typescript
// 示例：GitHub MCP 服务器的工具
interface GitHubTools {
  create_issue(repo: string, title: string, body: string): Issue;
  create_pull_request(repo: string, head: string, base: string): PR;
  search_code(query: string): SearchResult[];
  get_file_contents(repo: string, path: string): string;
}
```

### 2.3 Resources（资源）

资源是 MCP 服务器提供的 **可读取数据**：

```typescript
// 示例：数据库 MCP 服务器的资源
interface DatabaseResources {
  "db://users": User[];
  "db://orders": Order[];
  "db://products": Product[];
}
```

### 2.4 Prompts（提示）

提示是 MCP 服务器提供的 **预定义指令模板**：

```typescript
// 示例：代码审查 MCP 服务器的提示
interface ReviewPrompts {
  "security-review": "执行安全审查，重点关注...";
  "performance-review": "执行性能审查，重点关注...";
}
```

### 2.5 通信流程

```mermaid
sequenceDiagram
    participant CC as Claude Code
    participant MCP as MCP 客户端
    participant Server as MCP 服务器
    participant External as 外部服务
    
    CC->>MCP: 需要调用 GitHub 工具
    MCP->>Server: JSON-RPC 请求
    Server->>External: API 调用
    External-->>Server: API 响应
    Server-->>MCP: JSON-RPC 响应
    MCP-->>CC: 工具结果
```

---

## 3. MCP 服务器类型

### 3.1 按运行方式分类

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **stdio** | 本地进程，通过标准输入输出通信 | 本地开发、个人使用 |
| **SSE** | 远程服务器，Server-Sent Events | 团队共享、云服务 |
| **HTTP** | 远程服务器，HTTP 请求 | 简单集成、Webhook |

### 3.2 按作用域分类

| 作用域 | 配置位置 | 影响范围 |
|--------|----------|----------|
| **Local** | 会话内配置 | 仅当前会话 |
| **Project** | `.claude/settings.json` | 当前项目 |
| **User** | `~/.claude/settings.json` | 所有项目 |

### 3.3 运行方式详解

#### stdio 服务器

```mermaid
graph LR
    CC[Claude Code] <-->|stdin/stdout| Process[MCP Server Process]
    Process <--> API[外部 API]
```

**优点**：
- 无需网络配置
- 低延迟
- 简单部署

**配置示例**：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxx"
      }
    }
  }
}
```

#### SSE 服务器

```mermaid
graph LR
    CC[Claude Code] <-->|HTTP/SSE| Server[远程 MCP Server]
    Server <--> API[外部 API]
```

**优点**：
- 可团队共享
- 集中管理
- 支持实时更新

**配置示例**：
```json
{
  "mcpServers": {
    "team-tools": {
      "url": "https://mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer xxx"
      }
    }
  }
}
```

---

## 4. 配置与安装

### 4.1 配置文件位置

```
项目级配置
.claude/settings.json

用户级配置
~/.claude/settings.json
```

### 4.2 配置格式

```json
{
  "mcpServers": {
    "server-name": {
      // stdio 服务器
      "command": "执行命令",
      "args": ["参数列表"],
      "env": {
        "ENV_VAR": "value"
      },
      
      // 或 SSE 服务器
      "url": "https://server-url/sse",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

### 4.3 安装 MCP 服务器

#### 使用 npx（Node.js 服务器）

```bash
# 无需预安装，直接配置即可
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

#### 使用 pip（Python 服务器）

```bash
# 先安装
pip install mcp-server-sqlite

# 再配置
{
  "mcpServers": {
    "sqlite": {
      "command": "mcp-server-sqlite",
      "args": ["--db", "/path/to/database.db"]
    }
  }
}
```

#### 使用 Docker

```bash
{
  "mcpServers": {
    "custom": {
      "command": "docker",
      "args": ["run", "-i", "my-mcp-server:latest"]
    }
  }
}
```

### 4.4 验证配置

在 Claude Code 中验证：

```
"列出可用的 MCP 服务器和工具"
```

或使用 `/config` 命令查看。

---

## 5. 常用 MCP 服务器

### 5.1 官方服务器

| 服务器 | 功能 | 安装 |
|--------|------|------|
| **GitHub** | PR、Issue、代码搜索 | `@modelcontextprotocol/server-github` |
| **GitLab** | MR、Issue、代码搜索 | `@modelcontextprotocol/server-gitlab` |
| **Slack** | 消息、频道、搜索 | `@modelcontextprotocol/server-slack` |
| **PostgreSQL** | 数据库查询 | `@modelcontextprotocol/server-postgres` |
| **SQLite** | 本地数据库 | `mcp-server-sqlite` |
| **Filesystem** | 文件系统访问 | `@modelcontextprotocol/server-filesystem` |
| **Memory** | 知识图谱存储 | `@modelcontextprotocol/server-memory` |

### 5.2 GitHub MCP 服务器

**配置**：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**提供的工具**：

| 工具 | 功能 |
|------|------|
| `create_issue` | 创建 Issue |
| `create_pull_request` | 创建 PR |
| `search_code` | 搜索代码 |
| `search_issues` | 搜索 Issue |
| `get_file_contents` | 获取文件内容 |
| `push_files` | 推送文件 |
| `create_branch` | 创建分支 |

**使用示例**：

```
"使用 GitHub MCP 为 user/repo 创建一个关于登录 bug 的 Issue"
```

### 5.3 PostgreSQL MCP 服务器

**配置**：

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/dbname"
      }
    }
  }
}
```

**提供的工具**：

| 工具 | 功能 |
|------|------|
| `query` | 执行 SQL 查询 |
| `describe_table` | 描述表结构 |
| `list_tables` | 列出所有表 |

### 5.4 Sentry MCP 服务器

**配置**：

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "your_token",
        "SENTRY_ORG": "your_org"
      }
    }
  }
}
```

**功能**：
- 查询错误日志
- 分析错误趋势
- 获取堆栈追踪

---

## 6. 开发自定义 MCP 服务器

### 6.1 开发框架

官方提供多语言 SDK：

| 语言 | 包名 |
|------|------|
| TypeScript | `@modelcontextprotocol/sdk` |
| Python | `mcp` |

### 6.2 TypeScript 示例

```typescript
// server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    resources: {},
  }
});

// 定义工具
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "hello",
    description: "返回问候语",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "姓名" }
      },
      required: ["name"]
    }
  }]
}));

// 实现工具
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "hello") {
    const name = request.params.arguments.name;
    return {
      content: [{ type: "text", text: `Hello, ${name}!` }]
    };
  }
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 6.3 Python 示例

```python
# server.py
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

server = Server("my-mcp-server")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="hello",
            description="返回问候语",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "姓名"}
                },
                "required": ["name"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, 
    arguments: dict
) -> list[types.TextContent]:
    if name == "hello":
        return [types.TextContent(
            type="text",
            text=f"Hello, {arguments['name']}!"
        )]

async def main():
    async with mcp.server.stdio.stdio_server() as (read, write):
        await server.run(
            read, write,
            InitializationOptions(
                server_name="my-mcp-server",
                server_version="1.0.0",
            )
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### 6.4 服务器结构

```mermaid
graph TB
    subgraph "MCP 服务器"
        Init[初始化] --> Caps[声明能力]
        Caps --> Handlers[注册处理器]
        
        Handlers --> ToolList[tools/list]
        Handlers --> ToolCall[tools/call]
        Handlers --> ResourceList[resources/list]
        Handlers --> ResourceRead[resources/read]
        Handlers --> PromptList[prompts/list]
        Handlers --> PromptGet[prompts/get]
    end
```

---

## 7. 实战案例

### 7.1 案例：集成内部 API

**场景**：连接公司内部的用户管理 API

**服务器代码**：

```typescript
// internal-api-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import axios from "axios";

const API_BASE = process.env.INTERNAL_API_URL;

const server = new Server({
  name: "internal-api",
  version: "1.0.0",
});

// 工具：获取用户信息
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_user",
      description: "获取用户详细信息",
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string" }
        },
        required: ["userId"]
      }
    },
    {
      name: "search_users",
      description: "搜索用户",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "number", default: 10 }
        },
        required: ["query"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "get_user") {
    const response = await axios.get(`${API_BASE}/users/${args.userId}`);
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
  
  if (name === "search_users") {
    const response = await axios.get(`${API_BASE}/users/search`, {
      params: { q: args.query, limit: args.limit }
    });
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
});
```

**配置**：

```json
{
  "mcpServers": {
    "internal-api": {
      "command": "node",
      "args": ["./mcp-servers/internal-api-server.js"],
      "env": {
        "INTERNAL_API_URL": "https://api.internal.company.com"
      }
    }
  }
}
```

---

### 7.2 案例：数据库查询助手

**场景**：安全地查询生产数据库

```python
# db-assistant-server.py
from mcp.server import Server
import mcp.types as types
import asyncpg

server = Server("db-assistant")

# 只允许 SELECT 查询
ALLOWED_OPERATIONS = ["SELECT"]

@server.list_tools()
async def list_tools():
    return [
        types.Tool(
            name="query",
            description="执行只读 SQL 查询",
            inputSchema={
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "SQL 查询语句"}
                },
                "required": ["sql"]
            }
        ),
        types.Tool(
            name="describe",
            description="描述表结构",
            inputSchema={
                "type": "object",
                "properties": {
                    "table": {"type": "string"}
                },
                "required": ["table"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "query":
        sql = arguments["sql"].strip().upper()
        
        # 安全检查
        if not any(sql.startswith(op) for op in ALLOWED_OPERATIONS):
            return [types.TextContent(
                type="text",
                text="错误：只允许 SELECT 查询"
            )]
        
        # 执行查询
        conn = await asyncpg.connect(os.environ["DATABASE_URL"])
        try:
            rows = await conn.fetch(arguments["sql"])
            return [types.TextContent(
                type="text",
                text=json.dumps([dict(r) for r in rows], default=str)
            )]
        finally:
            await conn.close()
```

---

### 7.3 案例：监控告警集成

**场景**：集成 Prometheus/Grafana 监控

```typescript
// monitoring-server.ts
const server = new Server({ name: "monitoring", version: "1.0.0" });

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_alerts",
      description: "获取当前活跃的告警",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "query_metrics",
      description: "查询 Prometheus 指标",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "PromQL 查询" },
          range: { type: "string", default: "1h" }
        },
        required: ["query"]
      }
    },
    {
      name: "get_dashboard",
      description: "获取 Grafana 仪表板数据",
      inputSchema: {
        type: "object",
        properties: {
          dashboardId: { type: "string" }
        },
        required: ["dashboardId"]
      }
    }
  ]
}));
```

---

## 8. 最佳实践

### 8.1 安全原则

| 原则 | 说明 |
|------|------|
| **最小权限** | 只暴露必要的工具和资源 |
| **输入验证** | 严格验证所有输入参数 |
| **认证授权** | 使用 Token 而非明文密码 |
| **审计日志** | 记录所有工具调用 |

### 8.2 性能优化

~~~markdown
✅ 好的做法
- 使用连接池管理数据库连接
- 实现适当的缓存策略
- 异步处理长时间操作
- 设置合理的超时时间

❌ 不好的做法
- 每次调用都建立新连接
- 返回过大的数据集
- 同步阻塞操作
- 没有错误处理
~~~

### 8.3 工具设计

~~~markdown
## 工具设计原则

1. **单一职责**
   - 每个工具做一件事
   - 避免"万能"工具

2. **清晰命名**
   - 动词_名词 格式
   - 如 get_user, create_issue

3. **完整描述**
   - 说明功能、参数、返回值
   - 包含使用示例

4. **错误处理**
   - 返回有意义的错误信息
   - 区分用户错误和系统错误
~~~

### 8.4 配置管理

```json
// .claude/settings.json（提交到仓库）
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
      // 不包含敏感信息
    }
  }
}

// .claude/settings.local.json（不提交）
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "ghp_actual_token_here"
      }
    }
  }
}
```

---

## 9. 常见问题

### Q: MCP 服务器启动失败怎么办？

**A**: 检查以下几点：
1. 命令路径是否正确
2. 依赖是否已安装（npm/pip）
3. 环境变量是否设置
4. 查看错误日志

```bash
# 手动测试服务器
npx -y @modelcontextprotocol/server-github
```

### Q: 如何调试 MCP 服务器？

**A**: 
1. 添加日志输出到 stderr
2. 使用 MCP Inspector 工具
3. 检查 Claude Code 的日志

```typescript
// 添加调试日志
console.error("Debug:", JSON.stringify(request));
```

### Q: MCP 工具调用超时怎么办？

**A**: 
1. 增加超时设置
2. 优化服务器性能
3. 考虑异步处理长时间操作

### Q: 如何在团队中共享 MCP 配置？

**A**: 
1. 将配置（不含敏感信息）提交到仓库
2. 敏感信息使用环境变量
3. 团队成员在本地配置 `.local.json`

### Q: MCP 和内置 Tools 有什么区别？

**A**: 
| 特性 | 内置 Tools | MCP Tools |
|------|-----------|-----------|
| 来源 | Claude Code 自带 | 外部服务器 |
| 扩展性 | 不可扩展 | 无限扩展 |
| 权限 | 预定义 | 服务器控制 |
| 性能 | 高 | 取决于服务器 |

### Q: 可以同时使用多个 MCP 服务器吗？

**A**: 可以。每个服务器独立运行，工具名自动添加服务器前缀避免冲突。

```json
{
  "mcpServers": {
    "github": { ... },
    "postgres": { ... },
    "custom": { ... }
  }
}
```

---

## 参考资源

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP 规范](https://spec.modelcontextprotocol.io/)
- [官方服务器列表](https://github.com/modelcontextprotocol/servers)
- [MCP SDK (TypeScript)](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP SDK (Python)](https://github.com/modelcontextprotocol/python-sdk)

---

## 下一步

- [Tools 系统](/CICD-Practice/claude-code-guide/06-tools/) - 了解内置工具与 MCP 工具的配合
- [Hooks 系统](/CICD-Practice/claude-code-guide/04-hooks/) - 学习如何为 MCP 工具配置 Hooks
- [架构与组件总览](/CICD-Practice/claude-code-guide/00-overview/) - 回顾整体架构
