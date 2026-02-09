/**
 * 修复 hexo-filter-mermaid-diagrams 插件输出格式与 Butterfly 主题不兼容的问题
 * 将 <pre class="mermaid"> 转换为主题期望的 <div class="mermaid-wrap"><pre class="mermaid-src" hidden> 格式
 */
'use strict';

hexo.extend.filter.register('after_render:html', function(data) {
  // 查找所有的 <pre class="mermaid"> 标签并将其包装在 .mermaid-wrap 容器中
  data = data.replace(
    /<pre class="mermaid">([\s\S]+?)<\/pre>/g,
    '<div class="mermaid-wrap"><pre class="mermaid-src" hidden>$1</pre></div>'
  );

  return data;
});