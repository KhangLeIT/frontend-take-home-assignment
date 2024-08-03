import  { useState, type FormEvent } from 'react'
import { api } from '@/utils/client/api'

/**
 * QUESTION 1:
 * -----------
 * Style the "Add" button so that it looks like the design in Figma.
 *
 * NOTE: You must use tailwindcss and className. Do not use other methods (eg.
 * inline styles, separate css files, css modules, etc.) unless absolutely
 * necessary. This applies to all styling-related questions in this assignment.
 *
 * Documentation references:
 *  - https://tailwindcss.com
 *  - https://www.youtube.com/watch?v=mr15Xzb1Ook
 *
 *
 *
 * QUESTION 2:
 * -----------
 * Currently our form is not keyboard accessible. Users cannot hit
 * <Enter> right after typing to submit the form (add new todo). Fix this issue.
 */

export const CreateTodoForm = () => {
  const [todoBody, setTodoBody] = useState('')

  const apiContext = api.useContext()

  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch()
      },
    })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Ngăn chặn hành vi mặc định của form khi gửi
    createTodo({
      body: todoBody,
    })
    setTodoBody('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
      group
      flex
      items-center
      justify-between
      rounded-12
      bg-white
      border
      border-gray-300
      px-4
      py-2
      gap-2
      pr-4
      focus-within:border-gray-300
    "
    
    >
      <label htmlFor={TODO_INPUT_ID} className="sr-only">
        Add todo
      </label>

      <input
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e) => {
          setTodoBody(e.target.value)
        }}
        className="flex-1 border-gray-300 font-manrope my text-16 text-base
         placeholder:text-gray-400 focus:outline-none"
      />

      <button
        className='font-700 text-14 flex cursor-pointer font-manrope items-center 
        justify-center rounded-full bg-gray-800 px-5 py-2 text-white'
        type="submit"
        disabled={isCreatingTodo}
      >
        Add
      </button>
    </form>
  )
}

const TODO_INPUT_ID = 'todo-input-id'