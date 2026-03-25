export function formatHour(h) {
  const hh = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 || h === 24 ? 'AM' : 'PM';
  return `${hh}:00 ${ampm}`;
}

export function getAutoEnd(start, duration) {
  return (parseInt(start, 10) + duration) % 24;
}

export function generateHours() {
  return Array.from({ length: 24 }, (_, i) => i);
}

export function buildShiftSequence(start, duration, count) {
  const slots = [];

  let currentStart = start;

  for (let i = 0; i < count; i++) {
    const end = (currentStart + duration) % 24;

    slots.push({
      start: currentStart,
      end,
    });

    currentStart = end;
  }

  return slots;
}