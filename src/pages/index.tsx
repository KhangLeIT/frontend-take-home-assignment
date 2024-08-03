import { useState, useRef, useEffect } from 'react';
import { CreateTodoForm } from '@/client/components/CreateTodoForm';
import { TodoList } from '@/client/components/TodoList';
import * as Tabs from '@radix-ui/react-tabs';
import { api } from '@/utils/client/api';
import autoAnimate from '@formkit/auto-animate';

const Index = () => {
  const categorys = [
    { label: 'All', index: '0' },
    { label: 'Pending', index: '1' },
    { label: 'Completed', index: '2' },
  ];

  const { data: todos = [], isLoading, error, refetch } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  });
  const [filterIndex, setFilterIndex] = useState('0');

  const parentRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState('0');

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, [parentRef]);

  useEffect(() => {
    const timer = setTimeout(() => setActiveIndex(filterIndex), 80); // Match duration with Tailwind transition duration
    return () => clearTimeout(timer);
  }, [filterIndex]);

  const getFilteredTodos = (value: string) => {
    const filtered = value === '1'
      ? todos.filter(todo => todo.status === 'pending')
      : value === '2'
        ? todos.filter(todo => todo.status === 'completed')
        : todos;

    return filtered.sort((a, b) => a.status === 'pending' ? -1 : 1);
  };

  const { mutate: updateTodoStatus } = api.todoStatus.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleUpdateTodo = (todoId: number, status: string) => {
    const newStatus = status === 'completed' ? 'pending' : 'completed';
    updateTodoStatus({ todoId, status: newStatus });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo({ id: todoId });
  };

  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>
        <Tabs.Root value={filterIndex} onValueChange={setFilterIndex} orientation="vertical">
          <Tabs.List aria-label="tabs example" className="flex pt-10 mb-4">
            {categorys.map(({ label, index }) => (
              <Tabs.Trigger
                key={index}
                className={`mr-[8px] flex items-center justify-center rounded-full 
                border border-gray-200 px-[32px] py-2 text-[14px] font-[700]
                ${filterIndex === index ? 'bg-[#334155] text-white' : 'text-[#334155]'}`} 
                value={index}
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {categorys.map(({ label, index }) => (
            <Tabs.Content
              key={index}
              value={index}
              className={`transition-opacity duration-300 ease-in-out ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="pt-10" ref={parentRef}>
                {isLoading && <p className='text-gray-700 flex items-center justify-center'>Loading...</p>}
                {error && <p className="text-red-500">Error loading todos: {error.message}</p>}
                {getFilteredTodos(index).length === 0 && !isLoading && !error && (
                  <p className="text-gray-500 flex items-center justify-center">No todos available.</p>
                )}
                <TodoList
                  dataTodos={getFilteredTodos(index)}
                  handleDeleteTodo={handleDeleteTodo}
                  handleUpdateTodo={handleUpdateTodo}
                />
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  );
};

export default Index;
