const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const data = JSON.parse(chunks.join(''));
  const titles = new Set(['general manager','director','managing director','operations manager','project manager','ceo','construction manager','office manager','admin','manager']);
  const badStatuses = new Set(['invalid_email', 'bounced', 'unsubscribed']);
  const real = data.filter(l => {
    return !titles.has(l.contactName.toLowerCase()) && !badStatuses.has(l.status);
  });
  console.log('Total leads:', data.length);
  console.log('Eligible leads:', real.length);
  if (real.length) {
    const pick = real[Math.floor(Math.random() * real.length)];
    console.log(JSON.stringify(pick, null, 2));
  } else {
    console.log('No eligible leads found');
  }
});
