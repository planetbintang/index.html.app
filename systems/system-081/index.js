const systemName = 'system-081';
const taskList = [
  { id: 1, title: 'Identifikasi operasi utama', status: 'todo' },
  { id: 2, title: 'Status task dan prioritas', status: 'todo' },
  { id: 3, title: 'Modul kerja aktif dan monitoring', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengidentifikasi area kerja dan fungsi utama.',
  'AI menyusun status task, prioritas, dan aktivitas.',
  'AI membangun modul monitoring dan eksekusi.',
  'AI menilai kualitas akhir dan kelengkapan dokumentasi.'
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
