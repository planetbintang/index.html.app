const systemName = 'system-100';
const taskList = [
  { id: 1, title: 'Ringkasan ekosistem kerja', status: 'todo' },
  { id: 2, title: 'Penilaian performa dan prioritas', status: 'todo' },
  { id: 3, title: 'Implementasi modul final', status: 'in-progress' },
  { id: 4, title: 'Validasi akhir dan rilis', status: 'done' }
];

const aiWorkflow = [
  'AI menyusun ringkasan ekosistem secara menyeluruh.',
  'AI menilai performa, prioritas, dan output akhir.',
  'AI membangun modul final integrasi ekosistem.',
  'AI menyiapkan validasi akhir dan dokumentasi peluncuran.'
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
