document.addEventListener('DOMContentLoaded', function() {
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
