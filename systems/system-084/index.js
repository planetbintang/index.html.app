const systemName = 'system-084';
const taskList = [
  { id: 1, title: 'Kebutuhan eksekusi internal', status: 'todo' },
  { id: 2, title: 'Struktur task dan prioritas', status: 'todo' },
  { id: 3, title: 'Implementasi modul eksekusi', status: 'in-progress' },
  { id: 4, title: 'Uji evaluasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menetapkan kebutuhan eksekusi internal.',
  'AI menyusun struktur task dan prioritas kerja.',
  'AI membangun modul eksekusi utama.',
  'AI mengevaluasi hasil dan dokumentasi akhir.'
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
