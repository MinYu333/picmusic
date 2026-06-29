'use strict';

const allSongs = Object.values(MUSIC_DB).flat()
  .sort((a, b) => a.title.localeCompare(b.title, 'ko'));

function totalCountText(n) {
  const tpl = window.I18N?.[window.getLang?.()]?.['music.total'] ?? '총 {count}곡';
  return tpl.replace('{count}', n.toLocaleString());
}
document.getElementById('totalCount').textContent = totalCountText(allSongs.length);

const listEl    = document.getElementById('musicList');
const countEl   = document.getElementById('matchCount');
const noMatchEl = document.getElementById('noMatch');

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let currentQuery = '';

function render(songs) {
  listEl.innerHTML = '';
  if (songs.length === 0) {
    noMatchEl.textContent = window.I18N?.[window.getLang?.()]?.['music.nomatch'] ?? '검색 결과가 없습니다.';
    noMatchEl.classList.remove('hidden');
    countEl.textContent = '';
    return;
  }
  noMatchEl.classList.add('hidden');
  if (songs.length < allSongs.length) {
    const tpl = window.I18N?.[window.getLang?.()]?.['music.found'] ?? '{count}곡 검색됨';
    countEl.textContent = tpl.replace('{count}', songs.length);
  } else {
    countEl.textContent = '';
  }

  const frag = document.createDocumentFragment();
  songs.forEach(song => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${escHtml(song.id)}" target="_blank" rel="noopener noreferrer">
        <span>${escHtml(song.title)}</span>
      </a>`;
    frag.appendChild(li);
  });
  listEl.appendChild(frag);
}

render(allSongs);

document.getElementById('searchInput').addEventListener('input', e => {
  currentQuery = e.target.value.trim().toLowerCase();
  render(currentQuery ? allSongs.filter(s => s.title.toLowerCase().includes(currentQuery)) : allSongs);
});

document.addEventListener('langchange', () => {
  document.getElementById('totalCount').textContent = totalCountText(allSongs.length);
  render(currentQuery ? allSongs.filter(s => s.title.toLowerCase().includes(currentQuery)) : allSongs);
});
