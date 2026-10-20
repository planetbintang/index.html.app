const systemName = 'system-053';
const taskList = [
  { id: 1, title: 'Analisis cakupan backlog', status: 'todo' },
  { id: 2, title: 'Definisi status dan prioritas', status: 'todo' },
  { id: 3, title: 'Implementasi modul backlog', status: 'in-progress' },
  { id: 4, title: 'Validasi dan perbaikan', status: 'done' }
];

const aiWorkflow = [
  'AI mengelompokkan backlog berdasarkan kebutuhan dan prioritas.',
  'AI menyiapkan struktur status dan penilaian pekerjaan.',
  'AI menghasilkan kontrol otomatis untuk backlog.',
  'AI mengecek hasil dan merekomendasikan peningkatan.'
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
