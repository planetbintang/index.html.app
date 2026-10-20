const systemName = 'system-075';
const taskList = [
  { id: 1, title: 'Kebutuhan data dokumen', status: 'todo' },
  { id: 2, title: 'Prioritas dan alur keputusan', status: 'todo' },
  { id: 3, title: 'Implementasi modul integrasi', status: 'in-progress' },
  { id: 4, title: 'Uji hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengintegrasikan dokumen dan tugas ke satu kerangka kerja.',
  'AI menyusun model keputusan berdasarkan kebutuhan operasional.',
  'AI menyiapkan modul utama integrasi.',
  'AI mengevaluasi kualitas output dan user experience.'
];

function runSystem() {
  return {
    name: systemName,
    totalTasks: taskList.length,
    completed: taskList.filter(item => item.status === 'done').length,
    status: 'ready',
    workflow: aiWorkflow
  };
}

module.exports = { systemName, taskList, aiWorkflow, runSystem };

if (require.main === module) {
  console.log(JSON.stringify(runSystem(), null, 2));
}
