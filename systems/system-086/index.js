const systemName = 'system-086';
const taskList = [
  { id: 1, title: 'Kebutuhan proses internal', status: 'todo' },
  { id: 2, title: 'Pengaturan tugas dan kontrol', status: 'todo' },
  { id: 3, title: 'Implementasi modul proses kerja', status: 'in-progress' },
  { id: 4, title: 'Validasi hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengubah kebutuhan proses internal menjadi task.',
  'AI menyusun kontrol tugas dan status kerja.',
  'AI membangun modul utama proses kerja.',
  'AI melakukan evaluasi dan review akhir.'
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
