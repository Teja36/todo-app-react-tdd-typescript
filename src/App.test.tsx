import { describe, expect, test } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe('App', () => {
  test('should render input field and add button', () => {
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('should add task to list when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  test('should clear the input field after adding a task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('should not add an empty task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    await user.type(input, '   '); // Makes sense to also test with spaces
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });

  test('should add a task by pressing the enter key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });

    await user.type(input, 'New Task{enter}');

    await waitFor(() => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(1);
    });
  });

  test('should render edit and delete buttons for every listitem', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });

    await user.type(input, 'New Task{enter}');

    const editButton = screen.getByRole('button', { name: 'Edit' });
    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test('should render textbox with task title as value along with save and discard buttons in the TaskListItem when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const editInput = screen.getByRole('textbox', { name: 'Edit Task:' });
    const saveButton = screen.getByRole('button', { name: 'Save' });
    const discardButton = screen.getByRole('button', { name: 'Discard' });

    expect(editInput).toBeInTheDocument();
    expect(editInput).toHaveValue('New Task');

    expect(saveButton).toBeInTheDocument();
    expect(discardButton).toBeInTheDocument();
  });

  test('should update the task title when the text inside the edit task textbox is changed and the save button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const editInput = screen.getByRole('textbox', { name: 'Edit Task:' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.type(editInput, '1');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('New Task1')).toBeInTheDocument();
    });
  });

  test('should revert to the original text when the discard button is clicked while in edit mode', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const editInput = screen.getByRole('textbox', { name: 'Edit Task:' });
    await user.type(editInput, 'testing');

    const discardButton = screen.getByRole('button', { name: 'Discard' });
    await user.click(discardButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  test('should delete the task when the delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');
    await user.type(input, 'New Task2{enter}');
    await user.type(input, 'New Task3{enter}');

    const listItems = screen.getAllByRole('listitem');
    const listItem = listItems.find(() => screen.getByText('New Task'));

    const deleteButton = within(listItem!).getByRole('button', {
      name: 'Delete',
    });
    await user.click(deleteButton);

    expect(screen.queryAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  test('should render a checkbox for every listitem', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'New Task' }));
    });
  });

  test('should strike the task title when the checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');

    const checkbox = screen.getByRole('checkbox', { name: 'New Task' });
    await user.click(checkbox);

    const taskLabel = screen.getByText('New Task');

    await waitFor(() => {
      expect(taskLabel).toContainHTML('<s>New Task</s>');
    });
  });

  test('should unstrike the task title when the checkbox is unchecked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    await user.type(input, 'New Task{enter}');

    const checkbox = screen.getByRole('checkbox', { name: 'New Task' });
    await user.click(checkbox);
    await user.click(checkbox);

    const taskLabel = screen.getByText('New Task');

    await waitFor(() => {
      expect(taskLabel).not.toContainHTML('<s>New Task</s>');
    });
  });
});
