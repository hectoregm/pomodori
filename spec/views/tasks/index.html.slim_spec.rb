require 'rails_helper'

RSpec.describe 'tasks/index', type: :view do
  before(:each) do
    list = List.create(name: 'New List')
    assign(:list, list)

    assign(:task, Task.new)

    assign(:tasks, [
      Task.create!(
        name: 'Defend Helm\'s Deep',
        done: true,
        list: list
      ),
      Task.create!(
        name: 'Defend Minas Tirith',
        done: false,
        list: list
      )
    ])
  end

  it 'renders a list of tasks' do
    render
    assert_select '.list-group-item', count: 2
  end

  it 'renders a form to create a task' do
    render
    assert_select '#new_task'
  end
end
