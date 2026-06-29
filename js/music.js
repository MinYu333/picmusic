'use strict';

const allSongs = Object.values(MUSIC_DB).flat()
  .sort((a, b) => a.title.localeCompare(b.title, 'ko'));

document.getElementById('totalCount').textContent = `총 ${allSongs.length.toLocaleString()}곡`;

const listEl    = document.getElementById('musicList');
const countEl   = document.getElementById('matchCount');
const noMatchEl = document.getElementById('noMatch');

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function render(songs) {
  listEl.innerHTML = '';
  if (songs.length === 0) {
    noMatchEl.classList.remove('hidden');
    countEl.textContent = '';
    return;
  }
  noMatchEl.classList.add('hidden');
  countEl.textContent = songs.length < allSongs.length ? `${songs.length}곡 검색됨` : '';

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
  const q = e.target.value.trim().toLowerCase();
  render(q ? allSongs.filter(s => s.title.toLowerCase().includes(q)) : allSongs);
});
