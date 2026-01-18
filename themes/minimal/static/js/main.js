/**
 * Minimal Theme - Main JavaScript
 * Features: Theme toggle, header anchors, code copy buttons
 */

// Create SVG icon from sprite
const icon = (name) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('fill', 'currentColor');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#icon-${name}`);
  svg.appendChild(use);
  return svg;
};

// Theme: Apply saved preference or system default immediately to prevent flash
const getTheme = () => localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (getTheme() === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const updateIcon = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle.replaceChildren(icon(isDark ? 'sun' : 'moon'));
    };

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon();
    });

    updateIcon();
  }

  // Header anchor links
  document.querySelectorAll('.post-content :is(h1, h2, h3, h4, h5, h6)[id]').forEach((heading) => {
    const link = document.createElement('a');
    link.className = 'header-anchor';
    link.href = `#${heading.id}`;
    link.setAttribute('aria-label', 'Link to this section');
    link.appendChild(icon('link'));
    heading.appendChild(link);
  });

  // Code copy buttons
  document.querySelectorAll('.post-content pre').forEach((pre) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.appendChild(icon('copy'));
    wrapper.appendChild(btn);

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code') || pre;
      await navigator.clipboard.writeText(code.textContent);
      btn.replaceChildren(icon('check'));
      setTimeout(() => btn.replaceChildren(icon('copy')), 2000);
    });
  });
});
