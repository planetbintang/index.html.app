const systemName = 'system-058';
const taskList = [
  { id: 1, title: 'Definisi fungsi inti', status: 'todo' },
  { id: 2, title: 'Model task dan data', status: 'todo' },
  { id: 3, title: 'Implementasi modul utama', status: 'in-progress' },
  { id: 4, title: 'Pengujian dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengurai kebutuhan fungsi sistem menjadi modul.',
  'AI membuat model task dan struktur data.',
  'AI menyiapkan modul operasional utama.',
  'AI menilai kualitas kerja dan dokumentasi.'
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
