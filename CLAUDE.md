# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Hexo-powered static site that serves as a technical blog focusing on CI/CD practices, Jenkins, Kubernetes, and related DevOps topics. The site uses the Butterfly theme and is deployed to GitHub Pages.

## Project Structure

- `source/_posts/`: Contains all blog posts in Markdown format
- `source/images/`: Stores image assets for blog posts
- `themes/`: Contains the Butterfly theme
- `scaffolds/`: Hexo template files for creating new posts/pages
- `docs/`: Generated static site output (served by GitHub Pages)
- `_config.yml`: Main Hexo configuration
- `_config.butterfly.yml`: Theme-specific configuration

## Commands

### Development
- `npm install`: Install dependencies
- `npm run server`: Start local development server (serves at http://localhost:4000)
- `npm run build`: Generate static site to docs/ directory
- `npm run clean`: Clean generated site
- `npm run deploy`: Deploy site (as configured in _config.yml)

### Working with Content
- `hexo new "post-title"`: Create a new blog post
- `hexo generate`: Generate the static site
- `hexo server`: Start development server
- `hexo clean && hexo generate`: Clean and regenerate site

## Key Features

- Static site generated with Hexo
- Butterfly theme with extensive customization options
- Support for code highlighting and various Markdown extensions
- Responsive design for mobile and desktop
- Built-in features like search, comments, and social sharing
- Archive, category, and tag organization for posts

## Content Guidelines

Blog posts are located in `source/_posts/` and follow standard Hexo format with YAML front matter. New posts can be created using Hexo commands or by manually creating files with proper front matter structure.