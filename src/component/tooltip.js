/* global document */
import { h } from './element';
import { bind } from './event';
import { cssPrefix } from '../config';


function get_body() {
  let body = document.body;
  if (global.Editor) {
    // 编辑器嵌入环境
    try {
      body = document.querySelector('#dock').shadowRoot.querySelector('dock-layout > dock-layout:nth-child(5) > dock-layout:nth-child(3) > dock-groups > dock-panels > panel-frame').shadowRoot.querySelector('div.x-spreadsheet > div.x-spreadsheet > div.x-spreadsheet-sheet')
    } catch (error) {
      // 编辑器弹出环境
      body = document.querySelector('#dock').shadowRoot.querySelector('dock-layout > dock-groups > dock-panels > panel-frame').shadowRoot.querySelector('div.x-spreadsheet');
    }
  }

  return body;
}

export default function tooltip(html, target) {
  if (target.classList.contains('active')) {
    return;
  }
  const {
    left, top, width, height,
  } = target.getBoundingClientRect();
  const el = h('div', `${cssPrefix}-tooltip`).html(html).show();
  get_body().appendChild(el.el);
  const elBox = el.box();
  // console.log('elBox:', elBox);
  el.css('left', `${left + (width / 2) - (elBox.width / 2)}px`)
    .css('top', `${top + height + 2}px`);

  bind(target, 'mouseleave', () => {
    let body = get_body();
    if (body.contains(el.el)) {
      body.removeChild(el.el);
    }
  });

  bind(target, 'click', () => {
    let body = get_body();
    if (body.contains(el.el)) {
      body.removeChild(el.el);
    }
  });
}
