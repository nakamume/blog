// Helper to create SVG icon from sprite
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('fill', 'currentColor');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-' + name);
  svg.appendChild(use);
  return svg;
}

// Theme toggle - runs immediately to prevent flash
(function() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    function updateIcon() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle.innerHTML = '';
      themeToggle.appendChild(icon(isDark ? 'sun' : 'moon'));
    }

    themeToggle.addEventListener('click', function() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon();
    });

    updateIcon();
  }
  // Header anchor links
  document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6').forEach(function(heading) {
    if (heading.id) {
      const link = document.createElement('a');
      link.className = 'header-anchor';
      link.href = '#' + heading.id;
      link.setAttribute('aria-label', 'Link to this section');
      link.appendChild(icon('link'));
      heading.appendChild(link);
    }
  });

  // Code copy buttons
  document.querySelectorAll('.post-content pre').forEach(function(pre) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.appendChild(icon('copy'));
    wrapper.appendChild(btn);

    btn.addEventListener('click', function() {
      const code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(function() {
        btn.innerHTML = '';
        btn.appendChild(icon('check'));
        setTimeout(function() {
          btn.innerHTML = '';
          btn.appendChild(icon('copy'));
        }, 2000);
      });
    });
  });
});
