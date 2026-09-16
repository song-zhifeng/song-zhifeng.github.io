# 宋智峰 · Zhifeng Song

中英文秋招个人主页，展示工业工程、制造、质量、供应链与项目工程经历。
Bilingual career homepage for industrial engineering, manufacturing, quality, supply chain and project engineering.

## 在线主页 / Live website

- 中文入口 / Chinese: https://song-zhifeng.github.io/?lang=zh
- English: https://song-zhifeng.github.io/?lang=en
- 通用入口 / Default: https://song-zhifeng.github.io/

顶部「中文 / EN」按钮切换整页语言，并记住浏览器上的选择。明确带有 `?lang=zh` 或 `?lang=en` 的链接优先于已保存的语言偏好。切换保留当前项目展开状态。
The header switches the whole page between Chinese and English and remembers the preference in the current browser. Explicit language links override that preference; expanded project details stay open.

## 作品与报告 / Portfolio & reports

- [完整中文作品集 / Detailed Chinese portfolio](https://song-zhifeng.github.io/portfolio.html?lang=zh)
- [完整英文作品集 / Detailed English portfolio](https://song-zhifeng.github.io/portfolio.html?lang=en)
- [22 页作品集 PDF / 22-page Chinese portfolio PDF](https://song-zhifeng.github.io/reports/portfolio.pdf)
- 主页和完整作品集均支持中英文切换；各项目详情连接对应语言的完整案例与原始报告。
- Both the homepage and all nine detailed case studies support Chinese and English, including methods, figures, evidence, individual contributions and source references. Navigation between pages preserves the selected language.

原作品集和九份原始报告保留。此前提交的根路径项目锚点（如 `/#capstone`）会继续导向对应的完整案例。
The previous portfolio and nine source reports remain available. Legacy case links, such as `/#capstone`, continue to the corresponding detailed case.

## 更新 / Updating

- `index.html`：个人主页全部中英文内容，配对文本分别使用 `.zh` 和 `.en`。
- `assets/homepage.css`：响应式排版、中文/英文显示与打印样式。
- `assets/homepage.js`：语言切换、偏好保存、地址参数和原链接兼容。
- `assets/profile.jpg`：个人照片。
- `portfolio.html`、`assets/site.css`、`assets/site.js`：详细作品集的原中文内容、排版与交互。
- `assets/portfolio-en.js`：完整英文内容，与原文逐项对应。
- `assets/portfolio-i18n.js`、`assets/portfolio-language.css`：完整作品集的语言切换、双语搜索及英文排版。
- `assets/images/`、`assets/fonts/` 与 `reports/`：原项目图片、字体与报告。

纯静态网站，无构建步骤，无外部字体或 JavaScript 依赖。更新 `main` 分支后，GitHub Pages 自动发布根目录。
Static site with no build step and no external font or JavaScript dependency. GitHub Pages publishes the repository root from `main`.

更新主页样式或脚本时，同时修改 `index.html` 中对应文件的版本参数。
When updating homepage CSS or JS, also change its version query in `index.html`.

## 内容口径 / Content notes

项目区分个人分工、团队输出与课程模拟。52.65 分钟为装配时间基线，毕业状态写为硕士在读。后续改动请同步维护中英文事实。
Projects distinguish individual contributions, team outputs and course simulations. The 52.65-minute figure is a baseline assembly measurement; the degree is listed as in progress. Keep factual updates consistent across both languages.


完整作品集切换语言时保留当前案例、阅读模式、展开状态和搜索筛选。可用中英文关键词搜索。顶部打印按钮按当前语言打印完整正文，也可在浏览器打印窗口保存 PDF；原下载链接明确标注为中文版 PDF。
The detailed portfolio retains the active case, reading mode, expanded notes and filters when switching languages. Search accepts either language. Print / Save PDF prints the full portfolio in the selected language; the existing PDF download is explicitly labelled Chinese.
