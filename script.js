const data = { 
  name: "Arslan Ahıskalı", note: "Yıldız Ahıskalı",
  children: [
    { name: "Bahri Ahıskalı", note: "Asuman Ahıskalı",
      children: [
        { name: "İzzet Ahıskalı", note: "Gülendam Ahıskalı",
          children: [
            { name: "Elif Ahıskalı" },
            { name: "Savaş Ahıskalı" },
            { name: "Cihan Ahıskalı" },
            { name: "Murat Ahıskalı" }
          ]
        },
        { name: "Savaş Ahıskalı" },
        { name: "Feride Ahıskalı", note: "Tansu Soldaner",
          children: [
            { name: "Fidel Soldaner" },
            { name: "Deniz Soldaner" },
            { name: "Direniş Soldaner" }
          ]
        },
        { name: "Baybars Ahıskalı", note: "Handan Ahıskalı",
          children: [ { name: "Atlas Ahıskalı" } ]
        },
        { name: "Atilla Ahıskalı", note: "Nurcihan Ahıskalı",
          children: [ 
            { name: "Yavuz Ahıskalı" }, 
            { name: "Fatih Ahıskalı" }, 
            { name: "Eda Ahıskalı" }, 
            { name: "Ela Ahıskalı" } 
          ]
        },
        { name: "Asaf Ahıskalı", note: "Gülşen Ahıskalı",
          children: [
            { name: "Ali Ahıskalı" }, 
            { name: "Kaan Ahıskalı" }, 
            { name: "Esila Ahıskalı" }
          ]
        },
        { name: "Yusuf Ahıskalı", note: "Esin Ahıskalı",
          children: [
            { name: "Defne Ahıskalı" }
          ]
        },
        { name: "Alparslan Ahıskalı", note: "Elena Ahıskalı" }
      ]
    },
    { name: "Zarife Tüydiken", note: "Zarif Tüydiken",
      children: [ 
        { name: "Nigar Yerebatmaz", note: "Dikmen Yerebatmaz", 
          children: [
            { name: "Aslı Yerebatmaz" },
            { name: "Enes Yerebatmaz" }
          ]
        }, 
        { name: "Nuri Tüydiken" } 
      ]
    },
    { name: "Eşref Ahıskalı", note: "Gülayşe Ahıskalı", 
      children: [
        { name: "Turan Ahıskalı" }
      ]
    }
  ]
};


// render: details/summary with dependency-free collapsible
function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v; else if (k === 'open') n.open = v; else n.setAttribute(k, v);
  }
  for (const k of kids) n.append(k);
  return n;
}

function renderNode(node, isRoot = false) {
  const d = el('details', { class: 'node' + (isRoot ? ' root' : ''), open: isRoot });
  const sum = el('summary');
  const box = el('div', { class: 'box', tabindex: 0 });
  box.append(el('div', { class: 'name' }, document.createTextNode(node.name || '—')));
  if (node.note) box.append(el('div', { class: 'note' }, document.createTextNode(node.note)));
  sum.append(box);
  d.append(sum);

  if (node.children && node.children.length) {
    const list = el('ul', { class: 'children' });
    node.children.forEach(child => {
      const li = el('li', { class: 'branch' });
      li.append(renderNode(child));
      list.append(li);
    });
    d.append(list);
  }
  return d;
}

const canvas = document.getElementById('canvas');
const tree = el('ul', { class: 'tree' });
const root = el('li', { class: 'branch root' });
root.append(renderNode(data, true));
tree.append(root);
canvas.append(tree);

// Basit sürükle-bırak pan ve tekerlek zoom
const viewport = document.getElementById('viewport');
let scale = 0.9;
let origin = { x: 0, y: 0 };
let dragging = false;
let last = { x: 0, y: 0 };

function applyTransform() {
  canvas.style.transform = `translate(${origin.x}px, ${origin.y}px) scale(${scale}) translate(-50%, -50%)`;
}

function centerCanvas() {
  const { width, height } = viewport.getBoundingClientRect();
  origin = { x: width * 0.0, y: height * 0.0 }; // already centered via -50%/-50%
  applyTransform();
}

centerCanvas();

viewport.addEventListener('mousedown', (e) => {
  dragging = true;
  last = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => dragging = false);

window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - last.x;
  const dy = e.clientY - last.y;
  last = { x: e.clientX, y: e.clientY };
  origin.x += dx;
  origin.y += dy;
  applyTransform();
});

viewport.addEventListener('wheel', (e) => {
  if (!e.ctrlKey) return; // Ctrl + wheel ile zoom
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.05 : 0.05;
  scale = Math.min(1.6, Math.max(0.3, scale + delta));
  document.getElementById('zoom').value = Math.round(scale * 100);
  applyTransform();
}, { passive: false });

// Kontroller
document.getElementById('zoom').addEventListener('input', (e) => {
  scale = e.target.value / 100;
  applyTransform();
});

document.getElementById('fit').addEventListener('click', () => {
  scale = 0.9;
  document.getElementById('zoom').value = 90;
  centerCanvas();
});

document.getElementById('expand').addEventListener('click', () => 
  document.querySelectorAll('details.node').forEach(d => d.open = true)
);

document.getElementById('collapse').addEventListener('click', () => 
  document.querySelectorAll('details.node').forEach((d, i) => d.open = i === 0)
);

// Keyboard access
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.closest('.box')) {
    e.preventDefault();
    const det = document.activeElement.closest('details');
    det.open = !det.open;
  }
});
