export const translations = {
  en: {
    // Navbar
    appName: 'Note',
    notebook: 'Note',
    calendar: 'Calendar',
    searchPlaceholder: 'Search tasks...',
    allTasks: 'All Tasks',
    active: 'Active',
    completed: 'Completed',
    templates: 'Templates',
    newTask: 'New Task',
    
    // Priority Filter
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Task Card
    edit: 'Edit',
    delete: 'Delete',
    done: 'Done',
    due: 'Due',
    
    // Task Editor
    editTask: 'Edit Task',
    createTask: 'New Task',
    title: 'Title',
    titleRequired: 'Title *',
    description: 'Description',
    textColor: 'Text Color',
    fontWeight: 'Font Weight',
    normal: 'Normal',
    bold: 'Bold',
    dueDate: 'Due Date',
    priority: 'Priority',
    tags: 'Tags',
    tagsPlaceholder: 'work, personal, urgent (comma separated)',
    images: 'Images (max 3)',
    clickToUpload: 'Click to upload images',
    currentImages: 'Current images:',
    newImages: 'New images:',
    cancel: 'Cancel',
    save: 'Save',
    updateTask: 'Update Task',
    
    // Empty States
    noTasksFound: 'No tasks found for',
    tryDifferentSearch: 'Try a different search term',
    noTasksYet: 'No tasks yet',
    clickNewTask: 'Click "New Task" to get started',
    
    // Toast Messages
    taskCreated: 'Task created',
    taskUpdated: 'Task updated',
    taskDeleted: 'Task deleted',
    failedToLoad: 'Failed to load tasks',
    failedToUpdate: 'Failed to update task',
    failedToDelete: 'Failed to delete task',
    
    // Template Manager
    taskTemplates: 'Task Templates',
    noTemplates: 'No templates saved yet.',
    createTaskSave: 'Create a task and save it as a template!',
    use: 'Use',
    saveAsTemplate: 'Save as Template',
    templateName: 'Template name...',
    
    // Calendar
    previous: 'Prev',
    next: 'Next',
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    tasksFor: 'Tasks for',
    
    // Confirmation
    deleteConfirm: 'Delete this task?',
    
    // Colors
    black: 'Black',
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink',
    gray: 'Gray',
    teal: 'Teal'
  },
  zh: {
    // Navbar
    appName: '笔记本',
    notebook: '笔记本',
    calendar: '日历',
    searchPlaceholder: '搜索任务...',
    allTasks: '全部任务',
    active: '进行中',
    completed: '已完成',
    templates: '模板',
    newTask: '新建任务',
    
    // Priority Filter
    high: '高',
    medium: '中',
    low: '低',
    
    // Task Card
    edit: '编辑',
    delete: '删除',
    done: '完成',
    due: '截止',
    
    // Task Editor
    editTask: '编辑任务',
    createTask: '新建任务',
    title: '标题',
    titleRequired: '标题 *',
    description: '描述',
    textColor: '文字颜色',
    fontWeight: '字体粗细',
    normal: '正常',
    bold: '粗体',
    dueDate: '截止日期',
    priority: '优先级',
    tags: '标签',
    tagsPlaceholder: '工作, 个人, 紧急 (逗号分隔)',
    images: '图片 (最多3张)',
    clickToUpload: '点击上传图片',
    currentImages: '当前图片：',
    newImages: '新图片：',
    cancel: '取消',
    save: '保存',
    updateTask: '更新任务',
    
    // Empty States
    noTasksFound: '未找到任务',
    tryDifferentSearch: '尝试不同的搜索词',
    noTasksYet: '还没有任务',
    clickNewTask: '点击"新建任务"开始',
    
    // Toast Messages
    taskCreated: '任务已创建',
    taskUpdated: '任务已更新',
    taskDeleted: '任务已删除',
    failedToLoad: '加载任务失败',
    failedToUpdate: '更新任务失败',
    failedToDelete: '删除任务失败',
    
    // Template Manager
    taskTemplates: '任务模板',
    noTemplates: '还没有保存的模板。',
    createTaskSave: '创建一个任务并保存为模板！',
    use: '使用',
    saveAsTemplate: '保存为模板',
    templateName: '模板名称...',
    
    // Calendar
    previous: '上一月',
    next: '下一月',
    sunday: '星期日',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sun: '日',
    mon: '一',
    tue: '二',
    wed: '三',
    thu: '四',
    fri: '五',
    sat: '六',
    tasksFor: '任务',
    
    // Confirmation
    deleteConfirm: '确定删除此任务？',
    
    // Colors
    black: '黑色',
    red: '红色',
    orange: '橙色',
    yellow: '黄色',
    green: '绿色',
    blue: '蓝色',
    purple: '紫色',
    pink: '粉色',
    gray: '灰色',
    teal: '青色'
  }
};

export function getTranslation(lang, key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}
