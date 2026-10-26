// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const currentDateEl = document.getElementById('current-date');

// 앱 상태 관리
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 오늘 날짜 표시
function displayDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    currentDateEl.textContent = today.toLocaleDateString('ko-KR', options);
}

// 로컬 스토리지에 저장
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 할 일 추가 함수
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// 할 일 완료 상태 토글
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// 개별 할 일 삭제
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// 완료된 항목 전체 삭제
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// 화면에 렌더링
function renderTodos() {
    // 필터링 적용
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // HTML 생성
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<p style="text-align: center; color: #94a3b8; padding: 20px 0;">할 일이 없습니다.</p>`;
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="todo-left">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                </div>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            todoList.appendChild(li);
        });
    }

    // 남은 할 일 개수 업데이트
    const activeCount = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `남은 할 일: ${activeCount}개`;
}

// XSS 방지용 HTML Escape 유틸리티
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// 이벤트 리스너 등록
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// 필터 버튼 이벤트
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTodos();
    });
});

// 초기 실행
displayDate();
renderTodos();