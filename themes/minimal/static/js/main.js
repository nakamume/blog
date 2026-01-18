// Helper to create SVG icon from sprite
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('fill', 'currentColor');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-' + name);
  svg.appendChild(use);
  return svg;
}

document.addEventListener('DOMContentLoaded', function() {
  // Header anchor links
  document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4').forEach(function(heading) {
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
    btn.textContent = 'Copy';
    wrapper.appendChild(btn);

    btn.addEventListener('click', function() {
      const code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(function() {
        btn.textContent = 'Copied!';
        setTimeout(function() {
          btn.textContent = 'Copy';
        }, 2000);
      });
    });
  });
});
