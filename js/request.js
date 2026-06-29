'use strict';

const WEB3FORMS_KEY = 'eda71638-6a76-4af8-89e5-3492ae46ce32';

document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('requestModal');
  const closeBtn = document.getElementById('modalClose');
  const form     = document.getElementById('requestForm');
  const submitBtn= document.getElementById('modalSubmit');
  const successEl= document.getElementById('modalSuccess');

  // 모달 열기/닫기
  document.querySelectorAll('.btn-request').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.classList.remove('hidden');
      form.querySelector('input[name="song"]').focus();
    });
  });

  function closeModal() {
    backdrop.classList.add('hidden');
    form.reset();
    form.classList.remove('hidden');
    successEl.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = '신청하기';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // 폼 제출
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const song   = form.querySelector('input[name="song"]').value.trim();
    const artist = form.querySelector('input[name="artist"]').value.trim();
    if (!song || !artist) return;

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[픽뮤직] 음악 신청: ${song} - ${artist}`,
          from_name: '픽뮤직 신청',
          song,
          artist,
        }),
      });
      const data = await res.json();
      if (data.success) {
        form.classList.add('hidden');
        successEl.classList.remove('hidden');
      } else {
        throw new Error();
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = '신청하기';
      alert('전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  });
});
